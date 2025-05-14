/**
 * Author: LÊ TRỌNG TÌNH, SUBO
 * Created: YYYY-MM-DD
 * Description: Brief description of the file or function.
 */
import { jwtUtil } from "~/utils/jwtUltil";
import { StatusCodes } from "http-status-codes";
import ApiError from "~/utils/ApiError";
import MessageModel from "~/models/messageModel";
import ConversationModel from "~/models/conversationModel";

const sendMessage = async ({ conversationId, senderId, content, type }) => {
  try {
    // const { conversationId, senderId, content, type } = message;
    // const userId = jwtUtil.getUserIdFromHeader(request.headers);

    const newMessage = await MessageModel.sendMessage({
      conversationId,
      senderId,
      content,
      type,
    });

    if (!newMessage) {
      throw new ApiError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        "Failed to send message"
      );
    }

    return newMessage;
  } catch (error) {
    throw error;
  }
};

const getMessages = async (request) => {
  try {
    const { conversationId } = request.params;
    const { page, pageSize } = request.query;
    const messages = await MessageModel.getMessages(
      conversationId,
      page,
      pageSize
    );
    return messages;
  } catch (error) {
    console.error("Error in getMessages:", error);
    throw error;
  }
};

const deleteMessage = async (id, userId) => {
  try {
    const message = await MessageModel.deleteMessage(id, userId);
    if (!message) {
      throw new ApiError(
        StatusCodes.NOT_FOUND,
        "Message not found or already deleted"
      );
    }
    return message;
  } catch (error) {
    throw error;
  }
};

const markAsSeen = async (req) => {
  try {
    const { id } = req.params;
    const userId = jwtUtil.getUserIdFromHeader(req.headers);
    const message = await MessageModel.markAsSeen(id, userId);
    if (!message) {
      throw new ApiError(
        StatusCodes.NOT_FOUND,
        "Message not found or already seen"
      );
    }
    return message;
  } catch (error) {
    throw error;
  }
};

export const messageService = {
  sendMessage,
  getMessages,
  deleteMessage,
  markAsSeen,
};
