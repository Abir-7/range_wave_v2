import { IMechanicWorkshopPayload } from "../interface/user_workshop.interface";
import { Repository } from "../repositories/helper.repository";
import { UserRepository } from "../repositories/user.repo";
import { checkNearbyWorkshops } from "../utils/helper/checkDistanse";

const updateMechanicsWorkshopData = async (
  data: IMechanicWorkshopPayload,
  mechanic_id: string
) => {
  await checkNearbyWorkshops(data.workshop.coordinates, mechanic_id);

  return await Repository.transaction(async (tx) => {
    const update_profile = await UserRepository.updateUserProfile(
      mechanic_id,
      {
        ...data.profile,
        is_profile_completed: true,
      },
      tx
    );
    const update_workhop = await UserRepository.update_workshop_data(
      {
        user_id: update_profile.user_id,
        ...data.workshop,
        coordinates: [
          data.workshop.coordinates[0].toString(),
          data.workshop.coordinates[1].toString(),
        ],
      },
      mechanic_id,
      tx
    );
    return {
      ...update_workhop,
      is_profile_updated: update_profile.is_profile_completed,
    };
  });
};

export const UserService = { updateMechanicsWorkshopData };
