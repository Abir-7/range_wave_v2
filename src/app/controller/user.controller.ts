import { Request, Response } from "express";
import catchAsync from "../utils/serverTools/catchAsync";
import { UserService } from "../services/user.service";
import sendResponse from "../utils/serverTools/sendResponse";
import { getRelativePath } from "../utils/helper/getRelativeFilePath";
import { appConfig } from "../config/appConfig";

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

const updateUserCarData = catchAsync(async (req: Request, res: Response) => {
  const result = await UserService.updateUserCarInfo(
    req.user.user_id,
    req.body
  );

  sendResponse(res, {
    success: true,
    message: "User car data updated succesfully",
    status_code: 200,
    data: result,
  });
});

const updateUserProfile = catchAsync(async (req: Request, res: Response) => {
  const filePath = req.file?.path;
  console.log(filePath);
  const user_data = {
    ...req.body,
    ...(filePath && {
      image: `${appConfig.server.base_url}${getRelativePath(filePath)}`,
      image_id: getRelativePath(filePath),
    }),
  };

  const result = await UserService.updateUserProfile(
    req.user.user_id,
    user_data
  );

  sendResponse(res, {
    success: true,
    message: "User profile data updated succesfully",
    status_code: 200,
    data: result,
  });
});

const createAndConnectStripeAccount = catchAsync(
  async (req: Request, res: Response) => {
    const result = await UserService.createAndConnectStripeAccount(
      req.user.user_id,
      req.user.user_email
    );

    sendResponse(res, {
      success: true,
      message: "Connect link created.",
      status_code: 200,
      data: result,
    });
  }
);
export const UserController = {
  updateMechanicsWorkshopData,
  createAndConnectStripeAccount,
  updateUserCarData,
  updateUserProfile,
};
