import { Request, Response } from "express";

import catchAsync from "../utils/serverTools/catchAsync";
import sendResponse from "../utils/serverTools/sendResponse";
import { UserServiceReqService } from "../services/user_service.service";

const makeServiceReq = catchAsync(async (req: Request, res: Response) => {
  const result = await UserServiceReqService.makeServiceReq(
    req.body,
    req.user.user_id
  );

  sendResponse(res, {
    success: true,
    message: "A Service requiest successfully created.",
    status_code: 200,
    data: result,
  });
});
const getLatestRunningService = catchAsync(
  async (req: Request, res: Response) => {
    const result = await UserServiceReqService.getLatestRunningService(
      req.user.user_id,
      req.user.user_role
    );

    sendResponse(res, {
      success: true,
      message: "Users running service fetched successfully",
      status_code: 200,
      data: result,
    });
  }
);

//--------------------------for mechanics----------

const getAvailableServicesForMechanic = catchAsync(
  async (req: Request, res: Response) => {
    const result = await UserServiceReqService.getAvailableServicesForMechanic(
      req.user.user_id
    );

    sendResponse(res, {
      success: true,
      message: "Available service for bids fetched succesfully",
      status_code: 200,
      data: result,
    });
  }
);

const getServiceDetails = catchAsync(async (req: Request, res: Response) => {
  const result = await UserServiceReqService.getServiceDetails(req.params.s_id);

  sendResponse(res, {
    success: true,
    message: "Service details fetched succesfully",
    status_code: 200,
    data: result,
  });
});
//============ common=====
const getRunningServiceDetails = catchAsync(
  async (req: Request, res: Response) => {
    const result = await UserServiceReqService.getRunningServiceDetails(
      req.params.s_id
    );

    sendResponse(res, {
      success: true,
      message: "Running service details fetched succesfully",
      status_code: 200,
      data: result,
    });
  }
);
export const UserServiceController = {
  makeServiceReq,
  getLatestRunningService,
  getAvailableServicesForMechanic,
  getServiceDetails,
  getRunningServiceDetails,
};
