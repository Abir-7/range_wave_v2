import { TUpdateUserCar } from "../interface/user_car.interface";
import { IUpdateUserProfile } from "../interface/user_profile.interface";
import { IMechanicWorkshopPayload } from "../interface/user_workshop.interface";
import { Repository } from "../repositories/helper.repository";
import { PaymentRepository } from "../repositories/payment.repository";
import { WorkshopPaymentRepository } from "../repositories/payment_for_workshop.repository";
import { StripeRepository } from "../repositories/stripe.repository";
import { UserRepository } from "../repositories/user.repository";
import { checkNearbyWorkshops } from "../utils/helper/checkDistanse";
import { splitUserData } from "../utils/helper/splitUserData";
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

const updateUserCarInfo = async (car_id: string, car_data: TUpdateUserCar) => {
  return await Repository.transaction(async (tx) => {
    const updated_car_info = await UserRepository.updateUserCarData(
      car_data,
      car_id
    );

    return {
      ...updated_car_info,
    };
  });
};

const updateUserProfile = async (
  user_id: string,
  user_data: Record<string, any>
) => {
  const { profile_data, location_data } = splitUserData(user_data);

  const user_profile_data = await UserRepository.getProfileData(user_id);
  if (!user_profile_data) throw new AppError("User not found.", 404);

  const old_image_id = user_profile_data.image_id;
  const new_image_id = profile_data.image_id;

  // declare to capture results
  let updated_data: any;
  let updated_location: any;

  await Repository.transaction(async (tx) => {
    updated_data = await UserRepository.updateUserProfile(
      user_id,
      profile_data,
      tx
    );

    updated_location = await UserRepository.updateLocationData(
      location_data,
      user_id,
      tx
    );
  });

  // after tx commit

  if (new_image_id && old_image_id) {
    unlinkFile(old_image_id);
  }

  // if profile update fails, clean uploaded new image
  if (!updated_data && new_image_id) {
    unlinkFile(new_image_id);
  }

  return { ...updated_data, ...updated_location };
};

const getMechanicsEarningData = async (mechanic_id: string) => {
  return await PaymentRepository.getMechanicsEarningData(mechanic_id);
};

const addNewUserCar = async (user_id: string, car_data: any) => {
  const user_data = await UserRepository.getProfileData(user_id);

  if (!user_data) {
    throw new AppError("User not found.", 404);
  }

  return await Repository.transaction(async (tx) => {
    if (!user_data?.is_profile_completed && user_data?.user?.role === "user") {
      await UserRepository.updateUserProfile(
        user_id,
        {
          is_profile_completed: true,
        },
        tx
      );
    }

    await UserRepository.createUserCarinfo({ ...car_data, user_id }, tx);
  });
};

const getAllCarOfUser = async (user_id: string) => {
  return await UserRepository.getAllCarOfaUser(user_id);
};

export const UserService = {
  updateMechanicsWorkshopData,
  createAndConnectStripeAccount,
  updateUserCarInfo,
  updateUserProfile,
  getMechanicsEarningData,
  addNewUserCar,
  getAllCarOfUser,
};
