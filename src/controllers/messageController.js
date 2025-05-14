/**
 * Author: LÊ TRỌNG TÌNH, SUBO
 * Created: YYYY-MM-DD
 * Description: Brief description of the file or function.
 */
import { StatusCodes } from "http-status-codes";
import { messageService } from "~/services/messageService";
import ApiError from "~/utils/ApiError";
import { jwtUtil } from "~/utils/jwtUltil";

const sendMessage = async (req, res, next) => {
  try {
    const message = await messageService.sendMessage(req);
    return res.status(StatusCodes.OK).json({
      status: StatusCodes.OK,
      message: "Message sent successfully",
      data: message,
    });
  } catch (error) {
    next(error);
  }
};

const getMessages = async (req, res, next) => {
  try {
    const message = await messageService.getMessages(req);
    return res.status(StatusCodes.OK).json({
      status: StatusCodes.OK,
      message: "Messages retrieved successfully",
      data: message,
    });
  } catch (error) {
    next(error);
  }
};

const deleteMessage = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = jwtUtil.getUserIdFromHeader(req.headers);
    const result = await messageService.deleteMessage(id, userId);
    if (!result) {
      throw new ApiError(
        StatusCodes.NOT_FOUND,
        "Message not found or already deleted"
      );
    }
    return res.status(StatusCodes.OK).json({
      status: StatusCodes.OK,
      message: "Message deleted successfully",
      isDelete: result,
    });
  } catch (error) {
    next(error);
  }
};

const markAsSeen = async (req, res, next) => {
  try {
    const result = await messageService.markAsSeen(req);
    if (!result) {
      throw new ApiError(
        StatusCodes.NOT_FOUND,
        "Message not found or already seen"
      );
    }
    return res.status(StatusCodes.OK).json({
      status: StatusCodes.OK,
      message: "Message marked as seen successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const messageController = {
  sendMessage,
  getMessages,
  deleteMessage,
  markAsSeen,
};
