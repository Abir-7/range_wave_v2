import { Request, Response } from "express";
import catchAsync from "../utils/serverTools/catchAsync";
import sendResponse from "../utils/serverTools/sendResponse";
import { RatingService } from "../services/rating.service";

const ratingGivenByMechanic = catchAsync(
  async (req: Request, res: Response) => {
    const result = await RatingService.ratingGivenByMechanic(
      req.body,
      req.user.user_id
    );

    sendResponse(res, {
      success: true,
      message: "Rating successfully provided.",
      status_code: 200,
      data: result,
    });
  }
);

const ratingGivenByUser = catchAsync(async (req: Request, res: Response) => {
  const result = await RatingService.ratingGivenByUser(
    req.body,
    req.user.user_id
  );

  sendResponse(res, {
    success: true,
    message: "Rating successfully provided.",
    status_code: 200,
    data: result,
  });
});

const getUserRatingData = catchAsync(async (req: Request, res: Response) => {
  const result = await RatingService.getUserRatingData(req.params.user_id);

  sendResponse(res, {
    success: true,
    message: "Rating data of a user successfully fetched.",
    status_code: 200,
    data: result,
  });
});
const getMechanicRatingData = catchAsync(
  async (req: Request, res: Response) => {
    const result = await RatingService.getMechanicRatingData(
      req.params.mechanic_id
    );

    sendResponse(res, {
      success: true,
      message: "Rating data of a user successfully fetched.",
      status_code: 200,
      data: result,
    });
  }
);

export const RatingController = {
  ratingGivenByMechanic,
  ratingGivenByUser,
  getUserRatingData,
  getMechanicRatingData,
};
