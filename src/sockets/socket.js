/**
 * Author: LÊ TRỌNG TÌNH, SUBO
 * Created: YYYY-MM-DD
 * Description: Initializes socket events for handling messages.
 */
import { Server } from "socket.io";
import { messageService } from "~/services/messageService";
import { conversationService } from "~/services/conversationService";

let io; // Declare io globally

const initializeSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: "*", // Đảm bảo ứng dụng React có thể kết nối
      methods: ["GET", "POST"],
      allowedHeaders: ["Content-Type"],
      credentials: true, // Cho phép cookie nếu cần thiết
    },
    // path: "/ws",
  });

  io.on("connection", (socket) => {
    // Lắng nghe sự kiện "join-conversation" để người dùng tham gia vào một conversation room
    socket.on("join-conversation", (conversationId) => {
      socket.join(conversationId);
    });

    // Thêm xử lý join-conversations
    socket.on("join-conversations", () => {
      socket.join("conversations-updates");
    });

    // Lắng nghe sự kiện "leave-conversation" để người dùng rời khỏi một conversation room
    socket.on("leave-conversation", (conversationId) => {
      socket.leave(conversationId);
    });

    socket.on("sendMessage", async (messageData) => {
      const { conversationId, message } = messageData;
      try {
        const savedMessage = await messageService.sendMessage({
          conversationId,
          senderId: message.sender,
          content: message.content,
          type: message.type,
        });

        const updatedConversation =
          await conversationService.updateConversationLastMessage(
            conversationId,
            savedMessage._id,
            message.sender,
            message.content,
            message.type
          );

        // Gửi tin nhắn đến room conversation
        io.to(conversationId).emit("receive-message", savedMessage);

        // Chuẩn hóa dữ liệu gửi đi
        const emitData = {
          _id: updatedConversation._id,
          conversationId: updatedConversation._id, // Thêm cả conversationId để tương thích ngược
          lastMessage: updatedConversation.lastMessage,
          updatedAt: updatedConversation.updatedAt,
          // Thêm các trường khác nếu cần
        };

        // Gửi đến room cập nhật conversations
        io.to("conversations-updates").emit("conversation-updated", emitData);
      } catch (error) {
        console.error("Error handling message:", error);
      }

      //   .then((savedMessage) => {
      //     io.to(conversationId).emit("receive-message", savedMessage); // Broadcast message to room
      //   })
      //   .catch((error) => {
      //     console.error("Error saving message:", error);
      //   });
      // // Emit the message to other connected clients
    });

    socket.on("typing", (data) => {
      socket.broadcast.emit("typing", data);
    });
  });
  return io;
};

const getIoInstance = () => {
  if (!io) {
    throw new Error("Socket.io not initialized. Call initializeSocket first.");
  }
  return io;
};

export const socket = {
  initializeSocket,
  getIoInstance,
};
