import { IPaymentType } from "../db/schema/payment/payment.schema";
import { TServiceStatus } from "../db/schema/service_flow/progress/service_progress.schema";
import { TUserRole } from "../middleware/auth/auth.interface";
import { ChatRepository } from "../repositories/chat.repository";
import { Repository } from "../repositories/helper.repository";
import { PaymentRepository } from "../repositories/payment.repository";
import { ServiceProgressRepository } from "../repositories/user_service_progress.repository";
import { AppError } from "../utils/serverTools/AppError";

const hireMechanic = async (
  data: {
    bid_id: string;
    mechanic_id: string;
    service_id: string;
  },
  user_id: string
) => {
  const service_progress_data =
    await ServiceProgressRepository.findServiceProgressData(data.service_id);

  if (
    service_progress_data &&
    (service_progress_data?.bid_id || service_progress_data.mechanic_id)
  ) {
    return service_progress_data;
  }
  const { bid_id, mechanic_id, service_id } = data;
  return await Repository.transaction(async (tx) => {
    await ChatRepository.makeNewChatRoom({
      mechanic_id: data.mechanic_id,
      user_id,
    });
    const updated_data = await ServiceProgressRepository.updateServiceProgress(
      {
        bid_id,
        mechanic_id,
        service_status: "ON_THE_WAY",
        updated_at: new Date(),
      },
      service_id
    );

    return updated_data;
  });
};

const changeServiceStatus = async (s_id: string, status: TServiceStatus) => {
  return await ServiceProgressRepository.updateServiceProgress(
    { service_status: status },
    s_id
  );
};

const markAsComplete = async (s_id: string, mode: IPaymentType) => {
  const service_progress_data =
    await ServiceProgressRepository.findServiceProgressData(s_id);

  if (!service_progress_data) {
    throw new AppError("Service data not found.", 404);
  }

  const saved_payment = await PaymentRepository.getPaymentByServiceProgresId(
    service_progress_data.id
  );

  if (saved_payment && saved_payment.status === "paid") {
    throw new AppError("Already paid for this service", 400);
  }
  const total_amount =
    Number(service_progress_data.extra_price) +
    Number(service_progress_data.bid_data?.price ?? 0);
  console.log(mode);
  if (mode === "offline") {
    const payment_data = {
      tx_id: `tx-${new Date()}`,
      service_progress_id: service_progress_data.id,

      payment_type: mode,
      total_amount: total_amount.toString(),
    };

    return await Repository.transaction(async (tx) => {
      const saved_payment = await PaymentRepository.savePament(
        { ...payment_data, status: "paid" },
        tx
      );

      await ServiceProgressRepository.updateServiceProgress(
        { service_status: "COMPLETED" },
        s_id
      );

      return saved_payment;
    });
  }
};

const getAllRunningServiceProgress = async (
  id: string,
  role: TUserRole,
  status: TServiceStatus
) => {
  if (role === "mechanic") {
    return await ServiceProgressRepository.getMechanicsAllRunningServiceProgress(
      status,
      id
    );
  }
  if (role === "user") {
    return await ServiceProgressRepository.getUsersAllRunningServiceProgress(
      status,
      id
    );
  }

  return [];
};

export const ServiceProgressService = {
  hireMechanic,
  changeServiceStatus,
  markAsComplete,
  getAllRunningServiceProgress,
};
