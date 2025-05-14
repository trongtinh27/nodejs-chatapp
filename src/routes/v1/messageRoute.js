/**
 * Author: LÊ TRỌNG TÌNH, SUBO
 * Created: YYYY-MM-DD
 * Description: User Router for handling API requests
 * @module routes/v1
 */

import express from "express";
import verifyToken from "~/middlewares/verifyTokenMiddleware";
import { messageController } from "~/controllers/messageController.js";
import { messageValidation } from "~/validations/messageValidation.js";

const Router = express.Router();

Router.use(verifyToken); // Apply token verification middleware to all routes

Router.route("/:conversationId").get(
  messageValidation.getMessages,
  messageController.getMessages
);

Router.route("/send").post(
  messageValidation.sendMessage,
  messageController.sendMessage
);

Router.route("/:id").delete(
  messageValidation.deleteMessage,
  messageController.deleteMessage
);

Router.route("/:id/read").patch(
  messageValidation.markAsSeen,
  messageController.markAsSeen
);

export const messageRouter = Router;
