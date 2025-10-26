import { BidRepository } from "../repositories/bid.repository";
import { UserRepository } from "../repositories/user.repository";
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

  if (
    workshop_data &&
    (!workshop_data.coordinates || workshop_data.coordinates.length !== 2)
  ) {
    throw new AppError("Workshop location not updated.", 404);
  }

  const mechanic_payment_info = await UserRepository.getMechanicsPaymentData(
    mechanic_id
  );

  if (
    !mechanic_payment_info ||
    !mechanic_payment_info.is_active ||
    !mechanic_payment_info.account_id
  ) {
    return {
      is_payment_profile_active: false,
      service_id: null,
      bid_id: null,
    };
  }

  const new_bid = await BidRepository.addBid({
    ...data,
    mechanic_id,
    status: "provided",
  });

  return {
    is_payment_profile_active: mechanic_payment_info.is_active,
    service_id: new_bid.service_id,
    bid_id: new_bid.id,
  };
};

const getMechanicBidHistory = async (mechanic_id: string) => {
  return await BidRepository.getMechanicBidHistory(mechanic_id);
};

// =========== USER ===============

const getBidListOfaService = async (service_id: string) => {
  return await BidRepository.getBidListOfaService(service_id);
};

const getBidDetails = async (bid_id: string) => {
  return await BidRepository.getBidDetails(bid_id);
};

export const BidService = {
  makeBid,
  getMechanicBidHistory,
  getBidListOfaService,
  getBidDetails,
};
