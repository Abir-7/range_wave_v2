import { IMechanicWorkshopPayload } from "../interface/user_workshop.interface";
import { Repository } from "../repositories/helper.repository";
import { WorkshopPaymentRepository } from "../repositories/payment_for_workshop.repository";
import { UserRepository } from "../repositories/user.repo";
import { checkNearbyWorkshops } from "../utils/helper/checkDistanse";

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

export const UserService = { updateMechanicsWorkshopData };
