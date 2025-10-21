import { Request, Response } from "express";
import catchAsync from "../utils/serverTools/catchAsync";
import { UserService } from "../services/user.service";
import sendResponse from "../utils/serverTools/sendResponse";

const updateMechanicsWorkshopData = catchAsync(
  async (req: Request, res: Response) => {
    const result = await UserService.updateMechanicsWorkshopData(
      req.body,
      req.user.user_id
    );

    sendResponse(res, {
      success: true,
      message: "Workshop data updated succesfully",
      status_code: 200,
      data: result,
    });
  }
);

export const UserController = {
  updateMechanicsWorkshopData,
};
