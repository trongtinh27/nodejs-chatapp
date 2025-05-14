/**
 * Author: LÊ TRỌNG TÌNH, SUBO
 * Created: YYYY-MM-DD
 * Description: Utility functions for generating JWT tokens.
 * @module utils/jwtUtil
 * @requires jsonwebtoken
 */
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid"; // Import uuid for generating unique IDs
import ApiError from "./ApiError";
import { StatusCodes } from "http-status-codes";

const generateToken = (userId, secret, expiresIn) => {
  return jwt.sign({ userId }, secret, {
    expiresIn,
    jwtid: uuidv4(),
    algorithm: "HS256",
  });
};

const getUserId = (token, secret) => {
  try {
    var decoded = jwt.verify(token, secret);
    return decoded.userId;
  } catch (err) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "Token is invalid");
  }
};

const getUserIdFromHeader = (header) => {
  const token = header.authorization?.split(" ")[1];
  if (!token) {
    throw new ApiError(StatusCodes.UNAUTHORIZED, "Token is missing");
  }
  return getUserId(token, process.env.ACCESS_SECRET);
};

export const jwtUtil = {
  generateToken,
  getUserId,
  getUserIdFromHeader,
};
