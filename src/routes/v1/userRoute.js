/**
 * Author: LÊ TRỌNG TÌNH, SUBO
 * Created: YYYY-MM-DD
 * Description: User Router for handling API requests
 * @module routes/v1
 */
import express from "express";
import verifyToken from "~/middlewares/verifyTokenMiddleware";
import { userValidation } from "~/validations/userValidation";
import { userController } from "~/controllers/userController";

const Router = express.Router();

Router.route("/me").get(
  verifyToken,
  userValidation.getProfile,
  userController.getProfile
);

Router.route("/:id").get(userValidation.getUser, userController.getUser);

Router.route("/").get(userValidation.searchUsers, userController.searchUsers);

export const userRouter = Router;
