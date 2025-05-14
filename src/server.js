/**
 * Author: LÊ TRỌNG TÌNH, SUBO
 * Created: YYYY-MM-DD
 * Description: Brief description of the file or function.
 */

import express from "express";
import cors from "cors"; // Import cors
import http from "http";
import exitHook from "async-exit-hook";
import cookieParser from "cookie-parser";
import { CONNECT_DB, DISCONNECT_DB } from "~/config/mongodb.js";
import { env } from "~/config/environment.js";
import { APIs_V1 } from "~/routes/v1";
import { errorHandingMiddleware } from "./middlewares/errorHandlingMiddleware";
import { socket } from "./sockets/socket";

const START_SERVER = () => {
  const app = express();
  app.use(cookieParser()); // Thêm vào trước các middleware khác

  // Cấu hình CORS
  app.use(
    cors({
      // origin: "*", // Cho phép frontend từ localhost:3000 kết nối
      origin: "http://localhost:3000", // Đặt đúng domain frontend
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization"], // Thêm Authorization vào đây
      credentials: true, // Cho phép cookie nếu cần thiết
    })
  );
  const server = http.createServer(app);
  socket.initializeSocket(server);

  // Middleware to parse JSON request bodies
  app.use(express.json());

  // Use API v1
  app.use("/v1", APIs_V1);

  // Middleware to handling error
  app.use(errorHandingMiddleware);

  server.listen(8007, env.HOST, () => {
    // eslint-disable-next-line no-console
    console.log(`Hello ${env.AUTHOR}!. Socket is running at ${env.HOST}:8007`);
  });

  app.listen(env.PORT, env.HOST, () => {
    // eslint-disable-next-line no-console
    console.log(
      `Hello ${env.AUTHOR}!. Server is running at ${env.HOST}:${env.PORT}`
    );
  });

  exitHook(() => {
    console.log(`Exit application...`);
    DISCONNECT_DB();
    console.log(`Disconnected from MongoDB`);
  });
};

/**
 * This is an IIFE (Immediately Invoked Function Expression)
 * It allows us to use async/await at the top level
 * without needing to wrap it in a function
 * This is useful for connecting to the database before starting the server
 * Connect to MongoDB and start the server
 * This function is called when the script is run
 * to ensure that the database is connected before starting the server
 * @returns {Promise<void>} A promise that resolves when the server is started
 * @throws {Error} If there is an error connecting to the database
 */
(async () => {
  try {
    console.log("Connecting to MongoDB...");
    await CONNECT_DB(); // Connect to MongoDB
    console.log("Connected to MongoDB");

    console.log("Starting server...");
    START_SERVER(); // Start the server
    console.log("Server started");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(0); // Exit the process with a failure code
  }
})();

// Start the server and connect to MongoDB
// eslint-disable-next-line no-console
// CONNECT_DB()
//   .then(() => console.log("Connected to MongoDB"))
//   .then(() => START_SERVER())
//   .catch((error) => {
//     console.error("Error connecting to MongoDB:", error);
//     process.exit(0); // Exit the process with a failure code
//   });
