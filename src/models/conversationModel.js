/**
 * Author: LÊ TRỌNG TÌNH, SUBO
 * Created: YYYY-MM-DD
 * Description: Brief description of the file or function.
 */
import { GET_DB } from "~/config/mongodb";
import { ObjectId } from "mongodb";
import ApiError from "~/utils/ApiError";
import { StatusCodes } from "http-status-codes";

export const COLLECTION_NAME = "conversations";

class ConversationModel {
  constructor({
    _id,
    participants,
    isGroup = false,
    groupName = null,
    groupAvatar = null,
    admin,
  }) {
    this._id = _id ? ObjectId.createFromHexString(_id) : null;
    (this.participants = participants.map((id) =>
      ObjectId.createFromHexString(id)
    )),
      (this.isGroup = isGroup),
      (this.groupName = groupName),
      (this.groupAvatar = groupAvatar),
      (this.admin = isGroup ? ObjectId.createFromHexString(admin) : null),
      (this.lastMessage = null),
      (this.createdAt = new Date()),
      (this.updatedAt = new Date());
  }

  static async createConversation(conversation) {
    const result = await GET_DB()
      .collection(COLLECTION_NAME)
      .insertOne(conversation);
    return { _id: result.insertedId, ...conversation };
  }

  static async getConversation(user1Id, user2Id) {
    const user1ObjectId = ObjectId.createFromHexString(user1Id);
    const user2ObjectId = ObjectId.createFromHexString(user2Id);

    const conversation = await GET_DB()
      .collection(COLLECTION_NAME)
      .findOne({
        participants: {
          $all: [user1ObjectId, user2ObjectId],
        },
        isGroup: false,
      });

    if (!conversation) {
      const newConversation = {
        participants: [user1ObjectId, user2ObjectId],
        isGroup: false,
        lastMessage: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const result = await this.createConversation(newConversation);
      return { _id: result.insertedId, ...newConversation };
    }
    return conversation;
  }

  static async findById(id) {
    return await GET_DB()
      .collection(COLLECTION_NAME)
      .findOne({ _id: ObjectId.createFromHexString(id) });
  }

  static async findByIdAndParticipant(id, participantId) {
    try {
      const aggregationPipeline = [
        {
          $match: {
            _id: ObjectId.createFromHexString(id),
            participants: {
              $in: [ObjectId.createFromHexString(participantId)],
            },
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "participants",
            foreignField: "_id",
            as: "participantsInfo",
          },
        },
        {
          $addFields: {
            // Xử lý conversation 1-1
            otherParticipant: {
              $cond: {
                if: { $eq: ["$isGroup", false] },
                then: {
                  $arrayElemAt: [
                    {
                      $filter: {
                        input: "$participantsInfo",
                        as: "participant",
                        cond: {
                          $ne: [
                            "$$participant._id",
                            ObjectId.createFromHexString(participantId),
                          ],
                        },
                      },
                    },
                    0,
                  ],
                },
                else: null,
              },
            },
            // Giữ lại thông tin group nếu là nhóm
            groupInfo: {
              $cond: {
                if: { $eq: ["$isGroup", true] },
                then: {
                  name: "$groupName",
                  avatar: "$groupAvatar",
                },
                else: null,
              },
            },
          },
        },
        {
          $project: {
            _id: 1,
            isGroup: 1,
            lastMessage: 1,
            createdAt: 1,
            updatedAt: 1,
            // Thông tin cho conversation 1-1
            "otherParticipant._id": 1,
            "otherParticipant.username": 1,
            "otherParticipant.avatarImg": 1,
            "otherParticipant.fullName": 1,
            // Thông tin cho group
            "groupInfo.name": 1,
            "groupInfo.avatar": 1,
          },
        },
      ];

      const result = await GET_DB()
        .collection(COLLECTION_NAME)
        .aggregate(aggregationPipeline)
        .toArray();

      if (!result || result.length === 0) {
        throw new ApiError(StatusCodes.NOT_FOUND, "Conversation not found!");
      }

      const conversation = result[0];

      // Format lại dữ liệu để dễ sử dụng
      return conversation;
    } catch (error) {
      throw new ApiError(
        error.statusCode || StatusCodes.BAD_REQUEST,
        error.message || "Error finding conversation"
      );
    }
  }

  // Lấy danh sách cuộc trò chuyện của một user
  static async getUserConversations(userId, page = 1, pageSize = 20) {
    page = parseInt(page);
    pageSize = parseInt(pageSize);
    const skip = (page - 1) * pageSize;

    const aggregationPipeline = [
      {
        $match: {
          participants: ObjectId.createFromHexString(userId),
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "participants",
          foreignField: "_id",
          as: "participantsInfo",
        },
      },
      {
        $addFields: {
          // Xử lý conversation 1-1
          otherParticipant: {
            $cond: {
              if: { $eq: ["$isGroup", false] },
              then: {
                $arrayElemAt: [
                  {
                    $filter: {
                      input: "$participantsInfo",
                      as: "participant",
                      cond: {
                        $ne: [
                          "$$participant._id",
                          ObjectId.createFromHexString(userId),
                        ],
                      },
                    },
                  },
                  0,
                ],
              },
              else: null,
            },
          },
          // Giữ lại thông tin group nếu là nhóm
          groupInfo: {
            $cond: {
              if: { $eq: ["$isGroup", true] },
              then: {
                name: "$groupName",
                avatar: "$groupAvatar",
              },
              else: null,
            },
          },
        },
      },
      {
        $project: {
          _id: 1,
          isGroup: 1,
          lastMessage: 1,
          createdAt: 1,
          updatedAt: 1,
          // Thông tin cho conversation 1-1
          "otherParticipant._id": 1,
          "otherParticipant.username": 1,
          "otherParticipant.avatarImg": 1,
          "otherParticipant.fullName": 1,
          // Thông tin cho group
          "groupInfo.name": 1,
          "groupInfo.avatar": 1,
        },
      },
      {
        $sort: { updatedAt: -1 }, // Sắp xếp từ mới đến cũ
      },
      {
        $facet: {
          data: [{ $skip: skip }, { $limit: pageSize }],
          totalCount: [{ $count: "count" }],
        },
      },
    ];

    const result = await GET_DB()
      .collection(COLLECTION_NAME)
      .aggregate(aggregationPipeline)
      .toArray();

    const total = result[0]?.totalCount[0]?.count || 0;
    const totalPage = Math.ceil(total / pageSize);

    if (page > totalPage && totalPage > 0) {
      throw new ApiError(StatusCodes.NOT_FOUND, "No page found");
    }

    return {
      page,
      pageSize,
      totalPage,
      data:
        result[0]?.data.map((conversation) => ({
          ...conversation,
        })) || [],
    };
  }

  static async updateLastMessage(
    conversationId,
    messageId,
    senderId,
    content,
    type = "text"
  ) {
    const result = await GET_DB()
      .collection(COLLECTION_NAME)
      .findOneAndUpdate(
        {
          _id: ObjectId.createFromHexString(conversationId),
        },
        {
          $set: {
            lastMessage: {
              message: ObjectId.isValid(messageId)
                ? messageId
                : ObjectId.createFromHexString(messageId),
              sender: ObjectId.createFromHexString(senderId),
              content,
              type,
              createdAt: new Date(),
            },
            updatedAt: new Date(),
          },
        },
        {
          returnDocument: "after",
          projection: {
            _id: 1,
            lastMessage: 1,
            updatedAt: 1,
            participants: 1,
            name: 1,
            // Thêm các trường khác cần thiết
          },
        }
      );

    return result;
  }

  static async addParticipants(id, participants) {
    const participantsObjectId = participants.map((p) =>
      ObjectId.createFromHexString(p)
    );

    const updatedConversation = await GET_DB()
      .collection(COLLECTION_NAME)
      .findOneAndUpdate(
        { _id: ObjectId.createFromHexString(id), isGroup: true },
        {
          $addToSet: { participants: { $each: participantsObjectId } },
          $set: { updatedAt: new Date() },
        },
        { returnDocument: "after" }
      );

    if (!updatedConversation)
      throw new ApiError(StatusCodes.NOT_FOUND, "Conversation not found");
    return updatedConversation;
  }

  static async removeParticipants(id, participants, admin) {
    admin = ObjectId.createFromHexString(admin);
    const participantsObjectId = participants
      .map((p) => ObjectId.createFromHexString(p))
      .filter((p) => !p.equals(admin));
    const updatedConversation = await GET_DB()
      .collection(COLLECTION_NAME)
      .findOneAndUpdate(
        { _id: ObjectId.createFromHexString(id), isGroup: true, admin: admin },
        {
          $pull: { participants: { $in: participantsObjectId } },
          $set: { updatedAt: new Date() },
        },
        { returnDocument: "after" }
      );

    if (!updatedConversation)
      throw new ApiError(StatusCodes.NOT_FOUND, "Conversation not found");
    return updatedConversation;
  }

  static async leaveConversation(id, participantId) {
    try {
      const participantObjectId = ObjectId.createFromHexString(participantId);
      const conversationId = ObjectId.createFromHexString(id);

      // Chỉ query 1 lần và kiểm tra admin trực tiếp trong updateOne
      const result = await GET_DB()
        .collection(COLLECTION_NAME)
        .updateOne(
          {
            _id: conversationId,
            isGroup: true,
            admin: { $ne: participantObjectId }, // Chặn admin rời nhóm
          },
          {
            $pull: { participants: participantObjectId },
            $set: { updatedAt: new Date() },
          }
        );

      // Nếu modifiedCount = 0 thì có thể do:
      // - Không tìm thấy conversation
      // - Người rời nhóm là admin
      if (result.modifiedCount === 0) {
        throw new ApiError(
          StatusCodes.BAD_REQUEST,
          "Group owner cannot leave group or conversation does not exist."
        );
      }

      return result.modifiedCount > 0;
    } catch (error) {
      throw error;
    }
  }
}

export default ConversationModel;
