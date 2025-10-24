import { Request, Response } from "express";
import catchAsync from "../utils/serverTools/catchAsync";
import sendResponse from "../utils/serverTools/sendResponse";
import { ChatService } from "../services/chat.service";

const getChatList = catchAsync(async (req: Request, res: Response) => {
  const result = await ChatService.getChatlist(
    req.user.user_id,
    req.user.user_role
  );
  sendResponse(res, {
    success: true,
    message: "Chat list successfully fetched.",
    status_code: 200,
    data: result,
  });
});

const getAllMessageOfChat = catchAsync(async (req: Request, res: Response) => {
  const result = await ChatService.getAllMessage(req.params.chat_room_id);
  sendResponse(res, {
    success: true,
    message: "All messagese successfully fetched.",
    status_code: 200,
    data: result,
  });
});

export const ChatController = {
  getChatList,
  getAllMessageOfChat,
};
