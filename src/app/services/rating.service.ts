import { IRating } from "../interface/rating.interface";
import { RatingRepository } from "../repositories/rating.repository";
import { ServiceRepository } from "../repositories/user_service.repository";
import { AppError } from "../utils/serverTools/AppError";

const ratingGivenByMechanic = async (data: IRating, mechanic_id: string) => {
  const service_progress_data = await ServiceRepository.getServiceProgressById(
    data.service_progress_id
  );
  if (!service_progress_data) {
    throw new AppError("Service data not found.", 404);
  }
  return await RatingRepository.ratingGivenByMechanic({
    ...data,
    mechanic_id,
    user_id: service_progress_data?.user_id!,
  });
};

const ratingGivenByUser = async (data: IRating, user_id: string) => {
  const service_progress_data = await ServiceRepository.getServiceProgressById(
    data.service_progress_id
  );
  if (!service_progress_data) {
    throw new AppError("Service data not found.", 404);
  }
  if (!service_progress_data.mechanic_id) {
    throw new AppError("Mechanic id not found.", 404);
  }
  return await RatingRepository.ratingGivenByUser({
    ...data,
    mechanic_id: service_progress_data.mechanic_id,
    user_id: user_id,
  });
};

const getUserRatingData = async (user_id: string) => {
  return await RatingRepository.getUserRatingData(user_id);
};
const getMechanicRatingData = async (mechanic_id: string) => {
  return await RatingRepository.getMechanicRatingData(mechanic_id);
};

export const RatingService = {
  ratingGivenByMechanic,
  ratingGivenByUser,
  getUserRatingData,
  getMechanicRatingData,
};
