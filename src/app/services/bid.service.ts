import { BidRepository } from "../repositories/bid.repo";
import { UserRepository } from "../repositories/user.repo";
import { AppError } from "../utils/serverTools/AppError";

const makeBid = async (
  mechanic_id: string,
  data: { service_id: string; price: string }
) => {
  const workshop_data = await UserRepository.getMechanicsWorkshopData(
    mechanic_id
  );
  console.log(workshop_data);
  if (!workshop_data) {
    throw new AppError("Workshop location not updated.", 404);
  }
  if (workshop_data && workshop_data.coordinates.length < 2) {
    throw new AppError("Workshop location not updated.", 404);
  }

  return await BidRepository.addBid({
    ...data,
    mechanic_id,
    status: "provided",
  });
};

const getMechanicBidHistory = async (mechanic_id: string) => {
  return await BidRepository.getMechanicBidHistory(mechanic_id);
};

export const BidService = {
  makeBid,
  getMechanicBidHistory,
};
