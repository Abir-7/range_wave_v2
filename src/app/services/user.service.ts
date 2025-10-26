import { TUpdateUserCar } from "../interface/user_car.interface";
import { IUpdateUserProfile } from "../interface/user_profile.interface";
import { IMechanicWorkshopPayload } from "../interface/user_workshop.interface";
import { Repository } from "../repositories/helper.repository";
import { WorkshopPaymentRepository } from "../repositories/payment_for_workshop.repository";
import { StripeRepository } from "../repositories/stripe.repository";
import { UserRepository } from "../repositories/user.repository";
import { checkNearbyWorkshops } from "../utils/helper/checkDistanse";
import unlinkFile from "../utils/helper/unlinkFile";
import { AppError } from "../utils/serverTools/AppError";

const updateMechanicsWorkshopData = async (
  data: IMechanicWorkshopPayload,
  mechanic_id: string
) => {
  const is_payment_done =
    await WorkshopPaymentRepository.findWorkshopPaymentByMechanicId(
      mechanic_id
    );

  return await Repository.transaction(async (tx) => {
    // 1) Update user profile
    const update_profile = await UserRepository.updateUserProfile(
      mechanic_id,
      {
        ...data.profile,
        is_profile_completed: true,
      },
      tx
    );

    // 2) Prepare workshop update
    const coordinates = data.workshop.coordinates.map((c) => c.toString());
    let is_conflict: boolean;

    if (is_payment_done?.status === "paid") {
      is_conflict = true;
    } else if (data.workshop.coordinates.length >= 2) {
      const coords: [number, number] = [
        Number(data.workshop.coordinates[0]),
        Number(data.workshop.coordinates[1]),
      ];
      is_conflict = await checkNearbyWorkshops(coords, mechanic_id);
    } else {
      is_conflict = false;
    }

    // 3) Update workshop
    const update_workshop = await UserRepository.update_workshop_data(
      {
        user_id: update_profile.user_id,
        ...data.workshop,
        coordinates,
        is_conflict,
      },
      mechanic_id,
      tx
    );

    return {
      ...update_workshop,
      is_profile_updated: update_profile.is_profile_completed,
    };
  });
};

const createAndConnectStripeAccount = async (
  mechanicUserId: string,
  mechanicEmail: string
) => {
  return await StripeRepository.createStripeConnectAccountLink(
    mechanicUserId,
    mechanicEmail
  );
};

const updateUserCarInfo = async (user_id: string, car_data: TUpdateUserCar) => {
  return await UserRepository.updateUserCarData(car_data, user_id);
};

const updateUserProfile = async (
  user_id: string,
  profile_data: IUpdateUserProfile
) => {
  const user_profile_data = await UserRepository.getProfileData(user_id);

  if (!user_profile_data) {
    throw new AppError("User not found.", 404);
  }

  const old_image_id = user_profile_data.image_id;
  const new_iamge_id = profile_data.image_id;

  console.log(profile_data);

  const updated_data = await UserRepository.updateUserProfile(
    user_id,
    profile_data
  );

  if (new_iamge_id && old_image_id) {
    unlinkFile(old_image_id);
  }
  if (!updated_data) {
    unlinkFile(new_iamge_id);
  }
  return updated_data;
};

export const UserService = {
  updateMechanicsWorkshopData,
  createAndConnectStripeAccount,
  updateUserCarInfo,
  updateUserProfile,
};
