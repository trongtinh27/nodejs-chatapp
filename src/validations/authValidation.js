/**
 * Author: LÊ TRỌNG TÌNH, SUBO
 * Created: YYYY-MM-DD
 * Description: Validation schema for user registration and login
 */
import Joi from "joi";
import { StatusCodes } from "http-status-codes";
import ApiError from "~/utils/ApiError";

const registerSchema = (req, res, next) => {
  Joi.object({
    email: Joi.string()
      .email()
      .message({
        "any.required": "Email is required",
        "string.empty": "Email cannot be empty",
        "string.email": "Email is not valid",
        "string.base": "Email must be a string",
        "string.trim": "Email cannot contain leading or trailing spaces",
      })
      .required(),
    password: Joi.string()
      .pattern(new RegExp("^[a-zA-Z0-9]{3,30}$"))
      .min(8)
      .messages({
        "any.required": "Password is required",
        "string.empty": "Password cannot be empty",
        "string.min": "Password must be at least 8 characters long",
      })
      .required(),
    confirmPassword: Joi.string()
      .valid(Joi.ref("password"))
      .required()
      .messages({
        "any.only": "Passwords do not match",
        "any.required": "Confirm password is required",
        "string.empty": "Confirm password cannot be empty",
      }),
    fullName: Joi.string().min(3).max(30).required(),
    birthDay: Joi.date()
      .iso()
      .messages({
        "date.base": "Birth date must be a valid date",
        "date.format": "Birth date must be in ISO format (YYYY-MM-DD)",
      })
      .required(),
  })
    .validateAsync(req.body, { abortEarly: false })
    .then(() => {
      next();
    })
    .catch((err) => {
      next(
        new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, new Error(err).message)
      );
    });
};

const loginSchema = (req, res, next) => {
  Joi.object({
    email: Joi.string()
      .email()
      .message({
        "any.required": "Email is required",
        "string.empty": "Email cannot be empty",
        "string.email": "Email is not valid",
        "string.base": "Email must be a string",
        "string.trim": "Email cannot contain leading or trailing spaces",
      })
      .required(),
    password: Joi.string()
      .pattern(new RegExp("^[a-zA-Z0-9]{3,30}$"))
      .min(8)
      .messages({
        "any.required": "Password is required",
        "string.empty": "Password cannot be empty",
        "string.min": "Password must be at least 8 characters long",
      })
      .required(),
  })
    .validateAsync(req.body, { abortEarly: false })
    .then(() => {
      next();
    })
    .catch((err) => {
      next(
        new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, new Error(err).message)
      );
    });
};

const refreshSchema = async (req, res, next) => {
  // Lấy refreshToken từ body
  const refreshToken = req.cookies.refreshToken;

  // Validate refreshToken
  await Joi.object({
    refreshToken: Joi.string().required().messages({
      "any.required": "RefreshToken is required",
      "string.empty": "RefreshToken cannot be empty",
    }),
  })
    .validateAsync({ refreshToken })
    .then(() => {
      next();
    })
    .catch((err) => {
      next(
        new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, new Error(err).message)
      );
    });
};

export const authValidation = {
  registerSchema,
  loginSchema,
  refreshSchema,
};
