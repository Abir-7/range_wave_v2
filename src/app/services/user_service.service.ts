import { Repository } from "../repositories/helper.repo";
import { ServiceRepository } from "../repositories/service.repo";
import { UserRepository } from "../repositories/user.repo";

const makeServiceReq = async (data: any, user_id: string) => {
  return await Repository.transaction(async (tx) => {
    const service_Data = {
      ...data,
      scheduled_date: data.scheduled_date
        ? new Date(data.scheduled_date)
        : null,
      user_id,
    };
    console.log("-----------", service_Data, "GG");
    const [created_service] = await ServiceRepository.makeServiceReq(
      service_Data,
      tx
    );

    let is_scheduled = false;

    if (created_service.scheduled_date) {
      is_scheduled = true;
    }

    const [created_service_progress] =
      await ServiceRepository.makeServiceProgres(
        {
          service_id: created_service.id,
          user_id,
          is_scheduled,
        },
        tx
      );

    return {
      ...created_service,
      service_progress_id: created_service_progress.id,
    };
  });
};
const getRunningProgress = async (user_id: string) => {
  const getRunningProgress = await ServiceRepository.getRunningProgress(
    user_id
  );
  return getRunningProgress;
};

//--------------------------For mechanics
const getAvailableServicesForMechanic = async (mechanic_id: string) => {
  const available_services =
    await ServiceRepository.getAvailableServicesForMechanic(mechanic_id);
  return available_services;
};

export const UserServiceReqService = {
  makeServiceReq,
  getRunningProgress,
  getAvailableServicesForMechanic,
};
