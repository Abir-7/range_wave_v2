import { Request, Response } from "express";
import catchAsync from "../utils/serverTools/catchAsync";

import sendResponse from "../utils/serverTools/sendResponse";
import { ServiceProgressService } from "../services/user_service_progress.service";

const hireMechanic = catchAsync(async (req: Request, res: Response) => {
  const result = await ServiceProgressService.hireMechanic(
    req.body,
    req.user.user_id
  );

  sendResponse(res, {
    success: true,
    message: "Mechanic successfully hired for your service.",
    status_code: 200,
    data: result,
  });
});

const markAsComplete = catchAsync(async (req: Request, res: Response) => {
  const result = await ServiceProgressService.markAsComplete(
    req.params.s_id,
    req.body.payment_mode
  );

  sendResponse(res, {
    success: true,
    message: "Service mark as completed.",
    status_code: 200,
    data: result,
  });
});

// ====== mechanic =======
const changeServiveStatus = catchAsync(async (req: Request, res: Response) => {
  const result = await ServiceProgressService.changeServiceStatus(
    req.params.s_id,
    req.body.status
  );

  sendResponse(res, {
    success: true,
    message: "Service Status changed successfully.",
    status_code: 200,
    data: result,
  });
});

export const ServiceProgressController = {
  hireMechanic,
  changeServiveStatus,
  markAsComplete,
};
