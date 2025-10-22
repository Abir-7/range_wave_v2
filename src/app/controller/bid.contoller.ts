import { Request, Response } from "express";
import catchAsync from "../utils/serverTools/catchAsync";
import sendResponse from "../utils/serverTools/sendResponse";
import { BidService } from "../services/bid.service";

const makeBid = catchAsync(async (req: Request, res: Response) => {
  const result = await BidService.makeBid(req.user.user_id, req.body);

  sendResponse(res, {
    success: true,
    message: "Bid added successfully",
    status_code: 200,
    data: result,
  });
});
const getMechanicBidHistory = catchAsync(
  async (req: Request, res: Response) => {
    const result = await BidService.getMechanicBidHistory(req.user.user_id);

    sendResponse(res, {
      success: true,
      message: "Bid history fetched successfully",
      status_code: 200,
      data: result,
    });
  }
);

const getBidListOfaService = catchAsync(async (req: Request, res: Response) => {
  const result = await BidService.getBidListOfaService(req.params.s_id);

  sendResponse(res, {
    success: true,
    message: "Bid list of a service fetched successfully",
    status_code: 200,
    data: result,
  });
});

const getBidDetails = catchAsync(async (req: Request, res: Response) => {
  const result = await BidService.getBidDetails(req.params.b_id);

  sendResponse(res, {
    success: true,
    message: "Bid details fetched successfully",
    status_code: 200,
    data: result,
  });
});

export const BidController = {
  makeBid,
  getMechanicBidHistory,
  getBidListOfaService,
  getBidDetails,
};
