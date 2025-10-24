import { TUserRole } from "../middleware/auth/auth.interface";
import { Repository } from "../repositories/helper.repository";
import { ServiceRepository } from "../repositories/user_service.repository";
import { ServiceProgressRepository } from "../repositories/user_service_progress.repository";

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

const getLatestRunningService = async (
  user_id: string,
  user_role: TUserRole
) => {
  if (user_role === "user") {
    const getRunningProgress =
      await ServiceProgressRepository.getUsersRunningProgress(user_id);
    return getRunningProgress;
  }
  if (user_role === "mechanic") {
    const getRunningProgress =
      await ServiceProgressRepository.getMechanicsRunningProgress(user_id);
    return getRunningProgress;
  }
  return {};
};

//--------------------------For mechanics
const getAvailableServicesForMechanic = async (mechanic_id: string) => {
  const available_services =
    await ServiceRepository.getAvailableServicesForMechanic(mechanic_id);
  return available_services;
};

const getServiceDetails = async (s_id: string) => {
  return await ServiceRepository.getServiceDetails(s_id);
};

//============ common============

const getRunningServiceDetails = async (s_id: string) => {
  return await ServiceRepository.runningServiceDetails(s_id);
};

export const UserServiceReqService = {
  makeServiceReq,
  getLatestRunningService,
  getAvailableServicesForMechanic,
  getServiceDetails,
  getRunningServiceDetails,
};
