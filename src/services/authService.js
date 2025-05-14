/**
 * Author: LÊ TRỌNG TÌNH, SUBO
 * Created: YYYY-MM-DD
 * Description: Service for handling authentication-related operations.
 * @module services/authService
 * @requires UserModel
 * @requires env
 * @requires jwtUtil
 * @requires StatusCodes
 */
import UserModel from "~/models/userModel";
import { env } from "~/config/environment";
import { jwtUtil } from "~/utils/jwtUltil";
import bcrypt from "bcryptjs";
import { StatusCodes } from "http-status-codes";
import ApiError from "~/utils/ApiError";

const createNewUser = async (reqBody) => {
  const { email, password, fullName, birthDay } = reqBody;

  try {
    // Check if the email already exists
    if ((await UserModel.findByEmail(email)) !== null) {
      throw new ApiError(StatusCodes.BAD_REQUEST, "Email already exists");
    }
    let newUser = new UserModel({
      email,
      password,
      fullName,
      birthDay,
    });

    const _id = await UserModel.createUser(newUser);

    const accessToken = jwtUtil.generateToken(
      _id,
      env.ACCESS_SECRET,
      env.ACCESS_EXPIRES_IN
    );
    const refreshToken = jwtUtil.generateToken(
      _id,
      env.REFRESH_SECRET,
      env.REFRESH_EXPIRES_IN
    );

    return {
      status: StatusCodes.CREATED,
      message: "User created successfully",
      accessToken,
      refreshToken,
    };
  } catch (error) {
    throw error;
  }
};

const updatePassword = async (id, newPassword) => {};

const login = async (reqBody) => {
  const { email, password } = reqBody;
  try {
    const user = await UserModel.findByEmail(email);
    if (!user) {
      throw new ApiError(StatusCodes.UNAUTHORIZED, "Invalid email");
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new ApiError(StatusCodes.UNAUTHORIZED, "Invalid password");
    }

    const accessToken = jwtUtil.generateToken(
      user._id,
      env.ACCESS_SECRET,
      env.ACCESS_EXPIRES_IN
    );
    const refreshToken = jwtUtil.generateToken(
      user._id,
      env.REFRESH_SECRET,
      env.REFRESH_EXPIRES_IN
    );

    return {
      status: StatusCodes.OK,
      message: "Login successfully",
      accessToken,
      refreshToken,
    };
  } catch (error) {
    throw error;
  }
};

const refresh = async (refreshToken) => {
  if (!refreshToken) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "Token is invalid");
  }
  try {
    const userId = jwtUtil.getUserId(refreshToken, env.REFRESH_SECRET);
    const accessToken = jwtUtil.generateToken(
      userId,
      env.ACCESS_SECRET,
      env.ACCESS_EXPIRES_IN
    );
    return {
      status: StatusCodes.OK,
      message: "Refresh successfully",
      accessToken,
    };
  } catch (error) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "Token is invalid");
  }
};

export const authService = {
  createNewUser,
  login,
  refresh,
};
