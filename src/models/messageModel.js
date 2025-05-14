/**
 * Author: LÊ TRỌNG TÌNH, SUBO
 * Created: YYYY-MM-DD
 * Description: Brief description of the file or function.
 */
import { GET_DB } from "~/config/mongodb";
import { ObjectId } from "mongodb";
import ApiError from "~/utils/ApiError";
import { StatusCodes } from "http-status-codes";

const COLLECTION_NAME = "messages";

class MessageModel {
  constructor({
    _id,
    conversationId,
    senderId,
    content,
    type,
    createdAt,
    updatedAt,
    isDeleted,
    isSeen,
    seenBy,
    seenAt,
  }) {
    this._id = _id ? ObjectId.createFromHexString(_id) : null;
    this.conversationId = conversationId
      ? ObjectId.createFromHexString(conversationId)
      : null;
    this.senderId = senderId ? ObjectId.createFromHexString(senderId) : null;
    this.content = content;
    this.type = type;
    this.createdAt = createdAt || new Date();
    this.updatedAt = updatedAt || new Date();
    this.isDeleted = isDeleted || false;
    this.seenBy = seenBy || [];
    this.isSeen = isSeen || false;
    this.seenAt = seenAt || null;
  }

  static async createMessage(message) {
    const result = await GET_DB()
      .collection(COLLECTION_NAME)
      .insertOne(message);
    return { _id: result.insertedId, ...message };
  }

  static async sendMessage({
    conversationId,
    senderId,
    content,
    type = "text",
  }) {
    const message = new MessageModel({
      conversationId,
      senderId,
      content,
      type,
    });

    const insertMessage = await this.createMessage(message);
    if (!insertMessage) {
      throw new ApiError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        "Failed to send message"
      );
    }

    const sender = await GET_DB()
      .collection("users") // Giả sử collection users
      .findOne(
        { _id: insertMessage.senderId },
        {
          projection: {
            fullName: 1,
            avatarImg: 1,
          },
        }
      );
    const newMessage = {
      ...message,
      sender: [
        {
          _id: sender._id,
          fullName: sender.fullName,
          avatarImg:
            sender.avatarImg || "https://www.gravatar.com/avatar/?d=mp",
        },
      ],
    };
    return newMessage;
  }

  static async getMessages(conversationId, page = 1, pageSize = 20) {
    pageSize = parseInt(pageSize);
    page = parseInt(page);
    const skip = (page - 1) * pageSize;

    const pipeline = [
      {
        $match: {
          conversationId: ObjectId.createFromHexString(conversationId),
          isDeleted: false,
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "senderId",
          foreignField: "_id",
          as: "sender",
        },
      },
      {
        $sort: { createdAt: -1 },
      },
      {
        $project: {
          _id: 1,
          conversationId: 1,
          content: 1,
          type: 1,
          createdAt: 1,
          updatedAt: 1,
          isDeleted: 1,
          isSeen: 1,
          seenBy: 1,
          seenAt: 1,
          "sender._id": 1,
          "sender.username": 1,
          "sender.avatarImg": 1,
          "sender.fullName": 1,
        },
      },
      {
        $facet: {
          metadata: [{ $count: "total" }],
          data: [{ $skip: skip }, { $limit: pageSize }],
        },
      },
    ];

    const result = await GET_DB()
      .collection(COLLECTION_NAME)
      .aggregate(pipeline)
      .toArray();

    const metadata = result[0]?.metadata[0] || { total: 0 };
    const total = metadata.total;
    const totalPage = Math.ceil(total / pageSize);

    if (totalPage > 0 && page > totalPage)
      throw new ApiError(StatusCodes.NOT_FOUND, "No page found");

    return {
      page,
      pageSize,
      totalPage,
      messages: result[0]?.data || [],
    };
  }

  static async deleteMessage(messageId, userId) {
    const message = await GET_DB()
      .collection(COLLECTION_NAME)
      .findOne({ _id: ObjectId.createFromHexString(messageId) });

    if (!message) {
      throw new ApiError(StatusCodes.NOT_FOUND, "Message not found");
    }
    if (message.senderId.toString() !== userId) {
      throw new ApiError(
        StatusCodes.FORBIDDEN,
        "You are not allowed to delete this message"
      );
    }
    const result = await GET_DB()
      .collection(COLLECTION_NAME)
      .updateOne(
        { _id: ObjectId.createFromHexString(messageId) },
        { $set: { isDeleted: true } }
      );

    return result.modifiedCount > 0;
  }

  static async markAsSeen(messageId, userId) {
    const db = GET_DB();
    const messageObjectId = ObjectId.createFromHexString(messageId);
    const userObjectId = ObjectId.createFromHexString(userId);

    const [messageWithConversation] = await db
      .collection("messages")
      .aggregate([
        { $match: { _id: messageObjectId } },
        {
          $lookup: {
            from: "conversations",
            localField: "conversationId",
            foreignField: "_id",
            as: "conversation",
          },
        },
        { $unwind: "$conversation" },
        {
          $project: {
            senderId: 1,
            conversationId: 1,
            isGroup: "$conversation.isGroup",
            isSeen: 1,
            seenBy: 1,
          },
        },
      ])
      .toArray();

    if (!messageWithConversation)
      throw new ApiError(404, "Message or conversation not found");

    const { senderId, isGroup, isSeen, seenBy = [] } = messageWithConversation;

    if (senderId.toString() === userId)
      throw new ApiError(400, "Sender cannot mark as seen");

    // Case: Nhóm
    if (isGroup) {
      const alreadySeen = seenBy.some((uid) => uid.toString() === userId);

      if (alreadySeen) {
        return []; // đã xem rồi => không làm gì cả
      }

      // Nếu chưa thấy => update và trả danh sách mới
      await db.collection("messages").updateOne(
        { _id: messageObjectId },
        {
          $addToSet: { seenBy: userObjectId },
          $set: { seenAt: new Date() },
        }
      );

      const [finalMessage] = await db
        .collection("messages")
        .aggregate([
          { $match: { _id: messageObjectId } },
          {
            $lookup: {
              from: "users",
              localField: "seenBy",
              foreignField: "_id",
              as: "seenByUsers",
            },
          },
          {
            $project: {
              _id: 0,
              seenByUsers: {
                _id: 1,
                name: 1,
                avatar: 1,
              },
            },
          },
        ])
        .toArray();

      return finalMessage.seenByUsers.map((user) => ({
        userId: user._id.toString(),
        name: user.name,
        avatar: user.avatar,
      }));
    }

    // Case: 1-1
    if (isSeen) {
      return false; // đã seen rồi
    }

    await db
      .collection("messages")
      .updateOne(
        { _id: messageObjectId },
        { $set: { isSeen: true, seenAt: new Date() } }
      );

    return true; // lần đầu tiên đánh dấu seen
  }
}

export default MessageModel;
