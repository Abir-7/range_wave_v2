import { TUserRole } from "../middleware/auth/auth.interface";
import { ChatRepository } from "../repositories/chat.repository";

const getChatlist = async (id: string, role: TUserRole) => {
  if (role === "mechanic") {
    return (await ChatRepository.getMechanicsChatList(id)) || [];
  }

  if (role === "user") {
    return (await ChatRepository.getUsersChatList(id)) || [];
  }

  return [];
};

const getAllMessage = async (chat_room_id: string) => {
  return await ChatRepository.getAllMessage(chat_room_id);
};

export const ChatService = { getChatlist, getAllMessage };
