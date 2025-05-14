/**
 * Author: LÊ TRỌNG TÌNH, SUBO
 * Created: YYYY-MM-DD
 * Description: Router for handling API requests
 * @module routes/v1
 */
import express from "express";
import { StatusCodes } from "http-status-codes";
import { userRouter } from "./userRoute.js"; // Import userRouter from userRoutes.js
import { authRouter } from "./authRoute.js"; // Import authRouter from authRoutes.js
import { conversationRouter } from "./conversationRoute.js";
import { messageRouter } from "./messageRoute.js";

const Router = express.Router();

Router.get("/status", (req, res) => {
  res.status(StatusCodes.OK).json({
    status: StatusCodes.OK,
    message: "Welcome to the API",
  });
});

Router.use("/users", userRouter); // Use userRouter for /users endpoint

Router.use("/auth", authRouter); // Use authRouter for /auth endpoint

Router.use("/conversations", conversationRouter); // Use conversationRouter for /conversations endpoint

Router.use("/messages", messageRouter); // Use messageRouter for /messages endpoint

export const APIs_V1 = Router;
