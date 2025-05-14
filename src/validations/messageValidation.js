/**
 * Author: LÊ TRỌNG TÌNH, SUBO
 * Created: YYYY-MM-DD
 * Description: Brief description of the file or function.
 */

import Joi from "joi";
import { StatusCodes } from "http-status-codes";
import ApiError from "~/utils/ApiError";
import { jwtUtil } from "~/utils/jwtUltil";

const sendMessage = async (req, res, next) => {
  const { conversationId, content, type } = req.body;
  const senderId = jwtUtil.getUserIdFromHeader(req.headers);

  await Joi.object({
    conversationId: Joi.string().required().messages({
      "any.required": "Conversation ID is required",
      "string.empty": "Conversation ID cannot be empty",
    }),
    senderId: Joi.string().required().messages({
      "any.required": "Sender ID is required",
      "string.empty": "Sender ID cannot be empty",
    }),
    content: Joi.string().required().messages({
      "any.required": "Content is required",
      "string.empty": "Content cannot be empty",
    }),
    type: Joi.string()
      .valid("text", "image", "video", "file")
      .default("text")
      .optional(),
  })
    .validateAsync({ conversationId, senderId, content, type })
    .then(() => {
      next();
    })
    .catch((err) => {
      next(
        new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, new Error(err).message)
      );
    });
};

const getMessages = async (req, res, next) => {
  const { conversationId } = req.params;

  await Joi.object({
    conversationId: Joi.string().required().messages({
      "any.required": "Conversation ID is required",
      "string.empty": "Conversation ID cannot be empty",
    }),
  })
    .validateAsync({ conversationId })
    .then(() => {
      next();
    })
    .catch((err) => {
      next(
        new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, new Error(err).message)
      );
    });
};

const deleteMessage = async (req, res, next) => {
  const { id } = req.params;
  const userId = jwtUtil.getUserIdFromHeader(req.headers);
  await Joi.object({
    id: Joi.string().required().messages({
      "any.required": "Message ID is required",
      "string.empty": "Message ID cannot be empty",
    }),
    userId: Joi.string().required().messages({
      "any.required": "User ID is required",
      "string.empty": "User ID cannot be empty",
    }),
  })
    .validateAsync({ id, userId })
    .then(() => {
      next();
    })
    .catch((err) => {
      next(
        new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, new Error(err).message)
      );
    });
};

const markAsSeen = async (req, res, next) => {
  const { id } = req.params;
  const userId = jwtUtil.getUserIdFromHeader(req.headers);

  await Joi.object({
    id: Joi.string().required().messages({
      "any.required": "Message ID is required",
      "string.empty": "Message ID cannot be empty",
    }),
    userId: Joi.string().required().messages({
      "any.required": "User ID is required",
      "string.empty": "User ID cannot be empty",
    }),
  })
    .validateAsync({ id, userId })
    .then(() => {
      next();
    })
    .catch((err) => {
      next(
        new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, new Error(err).message)
      );
    });
};

export const messageValidation = {
  sendMessage,
  getMessages,
  deleteMessage,
  markAsSeen,
};
