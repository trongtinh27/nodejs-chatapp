/**
 * Author: LÊ TRỌNG TÌNH, SUBO
 * Created: YYYY-MM-DD
 * Description: Config Mongodb Cloud Atlas
 */

import { MongoClient, ServerApiVersion } from "mongodb";
import { env } from "~/config/environment.js";

let chatDatabaseInstance = null;

const mongoClientInstance = new MongoClient(env.MONGODB_URI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

// Connect to MongoDB
export const CONNECT_DB = async () => {
  await mongoClientInstance.connect(); // Connect to the MongoDB atlas wiwh the URI
  chatDatabaseInstance = mongoClientInstance.db(env.DB_NAME); // Select the database
};

/**
 * Get the database instance
 * This function should be called after CONNECT_DB
 * to ensure that the database is connected
 * @returns {MongoClient} The MongoDB database instance
 * @throws {Error} If the database is not connected
 */
export const GET_DB = () => {
  if (!chatDatabaseInstance) {
    throw new Error("Database not connected");
  }
  return chatDatabaseInstance;
};

/**
 * Disconnect from MongoDB
 * This function should be called when the application is shutting down
 * to ensure that the database connection is closed
 * @returns {Promise<void>} A promise that resolves when the connection is closed
 * @throws {Error} If there is an error closing the connection
 */
export const DISCONNECT_DB = async () => {
  if (mongoClientInstance) {
    await mongoClientInstance.close(); // Close the MongoDB connection
    chatDatabaseInstance = null; // Reset the database instance
  }
};
