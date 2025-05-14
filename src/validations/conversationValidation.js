/**
 * Author: LÊ TRỌNG TÌNH, SUBO
 * Created: YYYY-MM-DD
 * Description: Brief description of the file or function.
 */
import Joi from "joi";
import { StatusCodes } from "http-status-codes";
import ApiError from "~/utils/ApiError";

const getConversation = async (req, res, next) => {
  const participants = req.body.participants;

  await Joi.object({
    participants: Joi.string().required().messages({
      "any.required": "Participants is required",
      "string.empty": "Participants cannot be empty",
    }),
  })
    .validateAsync({ participants })
    .then(() => {
      next();
    })

    .catch((err) => {
      next(
        new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, new Error(err).message)
      );
    });
};

const createGroup = async (req, res, next) => {
  const participants = req.body.participants;

  await Joi.object({
    participants: Joi.array()
      .items(
        Joi.string().required().messages({
          "string.empty": "UserId not empty.",
          "any.required": "UserId is required.",
        })
      )
      .min(2)
      .required()
      .messages({
        "array.min": "The group must have at least 3 members.",
        "any.required": "Membership list is required.",
      }),
  })
    .validateAsync({ participants })
    .then(() => {
      next();
    })
    .catch((err) => {
      next(
        new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, new Error(err).message)
      );
    });
};

const getConversationDetail = async (req, res, next) => {
  const { id } = req.params;

  await Joi.object({
    id: Joi.string().length(24).hex().required().messages({
      "any.required": "Id is required",
      "string.empty": "Id cannot be empty",
      "string.length": "Id is invalid",
      "string.hex": "Id must be a valid hexadecimal string",
    }),
  })
    .validateAsync({ id })
    .then(() => {
      next();
    })

    .catch((err) => {
      next(
        new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, new Error(err).message)
      );
    });
};

const getUserConversations = async (req, res, next) => {
  const accessToken = req.headers.authorization?.split(" ")[1];

  await Joi.object({
    accessToken: Joi.string().required().messages({
      "any.required": "AccessToken is required",
      "string.empty": "AccessToken cannot be empty",
    }),
  })
    .validateAsync({ accessToken })
    .then(() => {
      next();
    })
    .catch((err) => {
      next(
        new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, new Error(err).message)
      );
    });
};

const addParticipants = async (req, res, next) => {
  const participants = req.body.participants;

  await Joi.object({
    participants: Joi.array().items(
      Joi.string().required().messages({
        "string.empty": "UserId not empty.",
        "any.required": "UserId is required.",
      })
    ),
  })
    .validateAsync({ participants })
    .then(() => {
      next();
    })
    .catch((err) => {
      next(
        new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, new Error(err).message)
      );
    });
};

const removeParticipants = async (req, res, next) => {
  const participants = req.body.participants;
  const { id } = req.params;

  await Joi.object({
    participants: Joi.array().items(
      Joi.string().required().messages({
        "string.empty": "UserId not empty.",
        "any.required": "UserId is required.",
      })
    ),
    id: Joi.string().length(24).hex().required().messages({
      "any.required": "Id is required",
      "string.empty": "Id cannot be empty",
      "string.length": "Id is invalid",
      "string.hex": "Id must be a valid hexadecimal string",
    }),
  })
    .validateAsync({ participants, id })
    .then(() => {
      next();
    })
    .catch((err) => {
      next(
        new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, new Error(err).message)
      );
    });
};

export const leaveConversation = async (req, res, next) => {
  const accessToken = req.headers.authorization?.split(" ")[1];
  const { id } = req.params;

  await Joi.object({
    accessToken: Joi.string().required().messages({
      "any.required": "AccessToken is required",
      "string.empty": "AccessToken cannot be empty",
    }),
    id: Joi.string().length(24).hex().required().messages({
      "any.required": "Id is required",
      "string.empty": "Id cannot be empty",
      "string.length": "Id is invalid",
      "string.hex": "Id must be a valid hexadecimal string",
    }),
  })
    .validateAsync({ accessToken, id })
    .then(() => {
      next();
    })
    .catch((err) => {
      next(
        new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, new Error(err).message)
      );
    });
};

export const conversationValidation = {
  getConversation,
  createGroup,
  getConversationDetail,
  addParticipants,
  removeParticipants,
  leaveConversation,
  getUserConversations,
};
