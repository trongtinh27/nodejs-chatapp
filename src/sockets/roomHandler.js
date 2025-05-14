/**
 * Author: LÊ TRỌNG TÌNH, SUBO
 * Created: YYYY-MM-DD
 * Description: Handles socket events for room management.
 */

let userSocketMap = {}; // Map to store user socket IDs

const registerUserSocket = (userId, socketId) => {
  userSocketMap[userId] = socketId;
};

const getUserSocket = (userId) => {
  return userSocketMap[userId];
};

export const roomHandler = {
  registerUserSocket,
  getUserSocket,
};
