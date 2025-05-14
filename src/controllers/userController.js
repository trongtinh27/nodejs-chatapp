/**
 * Author: LÊ TRỌNG TÌNH, SUBO
 * Created: YYYY-MM-DD
 * Description: Brief description of the file or function.
 */

import { StatusCodes } from "http-status-codes";
import { userService } from "~/services/userService";

const getProfile = async (req, res, next) => {
  try {
    const profile = await userService.getProfile(req);
    return res.status(StatusCodes.OK).json({
      status: StatusCodes.OK,
      message: "Get profile successfully",
      profile,
    });
  } catch (error) {
    next(error);
  }
};

const searchUsers = async (req, res, next) => {
  const { query } = req.query;

  try {
    const users = await userService.searchUsers(query);

    return res.status(StatusCodes.OK).json({
      status: StatusCodes.OK,
      message: "Search users successfully",
      users,
    });
  } catch (error) {
    next(error);
  }
};

const updateUser = async (req, res, next) => {};

const getUser = async (req, res, next) => {
  const { id } = req.params;
  try {
    const user = await userService.getUser(id);

    return res.status(StatusCodes.OK).json({
      status: StatusCodes.OK,
      message: "Get user successfully",
      user,
    });
  } catch (error) {
    next(error);
  }
};

export const userController = {
  getProfile,
  searchUsers,
  updateUser,
  getUser,
};
