/**
 * Author: LÊ TRỌNG TÌNH, SUBO
 * Created: YYYY-MM-DD
 * Description: Environment configuration for the application
 */

import "dotenv/config";

export const env = {
  AUTHOR: process.env.AUTHOR || "LÊ TRỌNG TÌNH",
  PORT: process.env.PORT || 8027,
  HOST: process.env.HOST || "localhost",
  MONGODB_URI: process.env.MONGODB_URI || "mongodb://localhost:27017",
  DB_NAME: process.env.DB_NAME || "chat-app",
  ACCESS_SECRET: process.env.ACCESS_SECRET,
  REFRESH_SECRET: process.env.REFRESH_SECRET,
  ACCESS_EXPIRES_IN: process.env.ACCESS_EXPIRES_IN,
  REFRESH_EXPIRES_IN: process.env.REFRESH_EXPIRES_IN,
};
