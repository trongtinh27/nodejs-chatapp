/**
 * Author: LÊ TRỌNG TÌNH, SUBO
 * Created: YYYY-MM-DD
 * Description: Brief description of the file or function.
 */

import { StatusCodes } from "http-status-codes";
import { jwtUtil } from "~/utils/jwtUltil";
import { conversationService } from "~/services/conversationService";
import { socket } from "~/sockets/socket";

const getConversation = async (req, res, next) => {
  try {
    const participant = req.body.participants;

    const currentUserId = jwtUtil.getUserIdFromHeader(req.headers);

    const participants = [currentUserId, participant];

    const conversation = await conversationService.getConversation(
      participants
    );

    // // Lấy đối tượng io từ module để kết nối
    // const io = socket.getIoInstance();

    // // Kiểm tra nếu io không được khởi tạo
    // if (!io) {
    //   return res.status(500).json({
    //     message: "Socket.IO instance is not initialized properly.",
    //   });
    // }
    // // Sau khi tạo conversation, kết nối tất cả người tham gia vào socket room
    // participants.forEach((participantId) => {
    //   io.to(participantId).emit(
    //     "join-conversation",
    //     conversation._id.toString()
    //   );
    // });

    return res.status(StatusCodes.CREATED).json({
      status: StatusCodes.CREATED,
      message: "Get conversation successfully",
      conversation,
    });
  } catch (error) {
    next(error);
  }
};

const createGroup = async (req, res, next) => {
  try {
    const group = await conversationService.createGroup(req.body, req.headers);
    return res.status(StatusCodes.CREATED).json({
      status: StatusCodes.CREATED,
      message: "Create group conversation successfully",
      group,
    });
  } catch (error) {
    next(error);
  }
};

const getConversationDetail = async (req, res, next) => {
  try {
    const detail = await conversationService.getConversationDetail(req);
    return res.status(StatusCodes.OK).json({
      status: StatusCodes.OK,
      message: "Get Conversation detail successfully.",
      detail,
    });
  } catch (error) {
    next(error);
  }
};

const addParticipants = async (req, res, next) => {
  try {
    const { id } = req.params;
    const participants = req.body.participants;
    return res
      .status(StatusCodes.OK)
      .json(await conversationService.addParticipants(id, participants));
  } catch (error) {
    next(error);
  }
};

const leaveConversation = async (req, res, next) => {
  try {
    const leave = await conversationService.leaveConversation(req);

    if (leave) {
      return res.status(StatusCodes.OK).json({
        status: StatusCodes.OK,
        message: "Leave conversation successfully.",
      });
    }

    return res.status(StatusCodes.BAD_REQUEST).json({
      status: StatusCodes.BAD_REQUEST,
      message: "Leave conversation failed.",
    });
  } catch (error) {
    next(error);
  }
};

const removeParticipants = async (req, res, next) => {
  try {
    const data = await conversationService.removeParticipants(req);
    return res.status(StatusCodes.OK).json({
      status: StatusCodes.OK,
      message: "Remove member successfully.",
      data,
    });
  } catch (error) {
    next(error);
  }
};

const getUserConversations = async (req, res, next) => {
  try {
    const conversations = await conversationService.getUserConversations(req);
    return res.status(StatusCodes.OK).json({
      status: StatusCodes.OK,
      conversations,
    });
  } catch (error) {
    next(error);
  }
};

export const converastionController = {
  getConversation,
  createGroup,
  getConversationDetail,
  addParticipants,
  removeParticipants,
  leaveConversation,
  getUserConversations,
};
