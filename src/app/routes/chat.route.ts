import { Router } from "express";
import { auth } from "../middleware/auth/auth";
import { ChatController } from "../controller/chat.controller";

const router = Router();
router.get(
  "/get_chat_list",
  auth(["mechanic", "user"]),
  ChatController.getChatList
);
router.get(
  "/get_message_of_a_chat/:chat_room_id",
  auth(["mechanic", "user"]),
  ChatController.getAllMessageOfChat
);
export const ChatRoute = router;
