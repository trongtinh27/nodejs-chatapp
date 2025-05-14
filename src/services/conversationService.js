/**
 * Author: LÊ TRỌNG TÌNH, SUBO
 * Created: YYYY-MM-DD
 * Description: Brief description of the file or function.
 */
import ConversationModel from "~/models/conversationModel";
import { jwtUtil } from "~/utils/jwtUltil";
import UserModel from "~/models/userModel";

const getConversation = async (reqBody) => {
  const participants = reqBody;

  return await ConversationModel.getConversation(
    participants[0],
    participants[1]
  );
};

const createGroup = async (reqBody, reqHeader) => {
  const { participants, groupName, groupAvatar } = reqBody;

  const admin = jwtUtil.getUserIdFromHeader(reqHeader);
  const newParticipants = [...participants, admin];

  const group = new ConversationModel({
    participants: newParticipants, // Mảng các userId
    isGroup: true,
    groupName,
    groupAvatar,
    admin,
  });
  return await ConversationModel.createConversation(group);
};

const getConversationDetail = async (req) => {
  try {
    const { id } = req.params;
    const participantId = await jwtUtil.getUserIdFromHeader(req.headers);

    const conversation = await ConversationModel.findByIdAndParticipant(
      id,
      participantId
    );

    let adminInfo = null;
    if (conversation.isGroup) {
      adminInfo = await UserModel.findAdminInConversation(conversation.admin);
    }

    return conversation;
  } catch (error) {
    throw error;
  }
};

const getUserConversations = async (req) => {
  const { page, pageSize } = req.query;

  const userId = jwtUtil.getUserIdFromHeader(req.headers);

  const converstaions = await ConversationModel.getUserConversations(
    userId,
    page,
    pageSize
  );

  return converstaions;
};

const updateConversationLastMessage = async (
  conversationId,
  newMessageId,
  senderId,
  content,
  type
) => {
  try {
    return await ConversationModel.updateLastMessage(
      conversationId,
      newMessageId,
      senderId,
      content,
      type
    );
  } catch (error) {
    throw error;
  }
};

const addParticipants = async (id, participants) => {
  try {
    return await ConversationModel.addParticipants(id, participants);
  } catch (error) {
    throw error;
  }
};

const leaveConversation = async (req) => {
  try {
    const participantId = jwtUtil.getUserIdFromHeader(req.headers);
    const { id } = req.params;

    return await ConversationModel.leaveConversation(id, participantId);
  } catch (error) {
    throw error;
  }
};

const removeParticipants = async (req) => {
  try {
    const { id } = req.params;
    const participants = req.body.participants;
    const admin = jwtUtil.getUserIdFromHeader(req.headers);
    return await ConversationModel.removeParticipants(id, participants, admin);
  } catch (error) {
    throw error;
  }
};

export const conversationService = {
  getConversation,
  getConversationDetail,
  createGroup,
  getUserConversations,
  updateConversationLastMessage,
  addParticipants,
  removeParticipants,
  leaveConversation,
};
