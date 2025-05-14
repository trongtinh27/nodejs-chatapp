/**
 * Author: LÊ TRỌNG TÌNH, SUBO
 * Created: YYYY-MM-DD
 * Description: Conversation Router for handling API requests
 * @module routes/v1
 */
import express from "express";
import { converastionController } from "~/controllers/conversationController";
import verifyToken from "~/middlewares/verifyTokenMiddleware";
import { conversationValidation } from "~/validations/conversationValidation";

const Router = express.Router();

Router.use(verifyToken);

Router.route("/")
  // Lấy tất cả cuộc trò chuyện của user
  .get(
    conversationValidation.getUserConversations,
    converastionController.getUserConversations
  )

  // Tạo cuộc trò chuyện (Cá nhân)
  .post(
    conversationValidation.getConversation,
    converastionController.getConversation
  );

// Tạo cuộc trò chuyện (Nhóm)
Router.route("/group").post(
  conversationValidation.createGroup,
  converastionController.createGroup
);

Router.route("/:id").get(
  conversationValidation.getConversationDetail,
  converastionController.getConversationDetail
);

// Lấy tất cả tin nhắn của cuộc trò chuyện
Router.route("/:id/messages").get();

// Rời khỏi nhóm
Router.route("/:id/leave").post(
  conversationValidation.leaveConversation,
  converastionController.leaveConversation
);

// 	Thêm người vào nhóm
Router.route("/:id/add").post(
  conversationValidation.addParticipants,
  converastionController.addParticipants
);

// 	Xóa người khỏi nhóm
Router.route("/:id/remove").post(
  conversationValidation.removeParticipants,
  converastionController.removeParticipants
);

export const conversationRouter = Router;
