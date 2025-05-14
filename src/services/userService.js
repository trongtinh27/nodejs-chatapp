/**
 * Author: LÊ TRỌNG TÌNH, SUBO
 * Created: YYYY-MM-DD
 * Description: Brief description of the file or function.
 */
import UserModel from "~/models/userModel";
import { jwtUtil } from "~/utils/jwtUltil";
import { StatusCodes } from "http-status-codes";
import ApiError from "~/utils/ApiError";

const getProfile = async (req) => {
  try {
    const userId = jwtUtil.getUserIdFromHeader(req.headers);

    const user = await UserModel.findById(userId);

    const profile = {
      id: user._id,
      email: user.email,
      fullName: user.fullName,
      avatar: user.avatarImg,
      birthDay: user.birthDay,
    };
    return profile;
  } catch (error) {
    throw error;
  }
};

const getUser = async (id) => {
  try {
    const user = await UserModel.findById(id);
    const profile = {
      id: user._id,
      email: user.email,
      fullName: user.fullName,
      avatar: user.avatarImg,
      birthDay: user.birthDay,
    };
    return profile;
  } catch (error) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "User not found");
  }
};

const searchUsers = async (query) => {
  try {
    const users = await UserModel.findByEmailOrFullName(query);

    const profiles = users.map((user) => ({
      id: user._id,
      email: user.email,
      fullName: user.fullName,
      avatar: user.avatarImg,
      birthDay: user.birthDay,
    }));

    return profiles;
  } catch (error) {
    throw error;
  }
};

export const userService = {
  getProfile,
  getUser,
  searchUsers,
};
