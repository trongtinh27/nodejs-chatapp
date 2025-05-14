/**
 * Author: LÊ TRỌNG TÌNH, SUBO
 * Created: YYYY-MM-DD
 * Description: Validation schema for profile
 */
import Joi from "joi";
import { StatusCodes } from "http-status-codes";
import ApiError from "~/utils/ApiError";

const getProfile = async (req, res, next) => {
  const accessToken = req.headers.authorization?.split(" ")[1];

  // Validate accessToken
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

const getUser = async (req, res, next) => {
  const { id } = req.params;

  await Joi.object({
    id: Joi.string().required().messages({
      "any.required": "Id is required",
      "string.empty": "Id cannot be empty",
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

const searchUsers = async (req, res, next) => {
  const { query } = req.query;
  await Joi.object({
    query: Joi.string()
      .required()
      .pattern(/^\S.*$/)
      .messages({
        "any.required": "query is required",
        "string.empty": "query cannot be empty",
        "string.pattern.base": "query cannot begin with a space",
      }),
  })
    .validateAsync({ query })
    .then(() => {
      next();
    })
    .catch((err) => {
      next(
        new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, new Error(err).message)
      );
    });
};

export const userValidation = {
  getProfile,
  getUser,
  searchUsers,
};
