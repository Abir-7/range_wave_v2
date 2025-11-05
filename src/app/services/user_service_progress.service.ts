import { IPaymentType } from "../schema/payment.schema";

import { TUserRole } from "../middleware/auth/auth.interface";
import { ChatRepository } from "../repositories/chat.repository";
import { Repository } from "../repositories/helper.repository";
import { PaymentRepository } from "../repositories/payment.repository";
import { UserRepository } from "../repositories/user.repository";
import { ServiceProgressRepository } from "../repositories/user_service_progress.repository";
import { AppError } from "../utils/serverTools/AppError";
import { StripeService } from "./stripe.service";
import {
  TExtraWorkAcceptStatus,
  TServiceStatus,
} from "../schema/service_progress.schema";

const hireMechanic = async (
  data: {
    bid_id: string;
    mechanic_id: string;
    service_id: string;
  },
  user_id: string
) => {
  const service_progress_data =
    await ServiceProgressRepository.findServiceProgressData(
      data.service_id,
      null
    );

  if (
    service_progress_data &&
    (service_progress_data?.bid_id || service_progress_data.mechanic_id)
  ) {
    return service_progress_data;
  }
  const { bid_id, mechanic_id, service_id } = data;
  return await Repository.transaction(async (tx) => {
    await ChatRepository.makeNewChatRoom(
      {
        mechanic_id: data.mechanic_id,
        user_id,
      },
      tx
    );
    const updated_data = await ServiceProgressRepository.updateServiceProgress(
      {
        bid_id,
        mechanic_id,
        service_status: "ON_THE_WAY",
        updated_at: new Date(),
      },
      service_id,
      null,
      tx
    );

    return updated_data;
  });
};

const markAsComplete = async (s_id: string, mode: IPaymentType) => {
  const service_progress_data =
    await ServiceProgressRepository.findServiceProgressData(s_id, null);

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
    (service_progress_data.extra_work_accept_status === "accepted"
      ? Number(service_progress_data.extra_price)
      : 0) + Number(service_progress_data.bid_data?.price ?? 0);

  if (total_amount <= 0) {
    throw new AppError("Total ammount can't be Zero");
  }

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
        s_id,
        null
      );

      return {
        payment_id: saved_payment.id,
        client_secret: null,
        service_progress_id: payment_data.service_progress_id,
      };
    });
  }

  if (mode === "online") {
    const mechanic_id = service_progress_data?.bid_data?.mechanic_id;
    if (!mechanic_id) {
      throw new AppError("Mechanic data not found.");
    }

    const mechanic_payment_info = await UserRepository.getMechanicsPaymentData(
      mechanic_id
    );

    if (!mechanic_payment_info || !mechanic_payment_info.account_id) {
      throw new AppError("Mechanic Account id not found.", 400);
    }

    const data = await StripeService.createPaymentIntentForUser(
      {
        payment_type: "online",
        service_progress_id: service_progress_data.id,
        total_amount: String(total_amount),
        type: "service_complete",
        user_id: service_progress_data.user_id!,
      },
      mechanic_payment_info.account_id
      //  if need then add  curency here
    );

    // return { paymentIntent: data.client_secret };
    return data;
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

const acceptOrRejectExtraWork = async (
  status: TExtraWorkAcceptStatus,
  service_id: string
) => {
  return ServiceProgressRepository.updateServiceProgress(
    { extra_work_accept_status: status },
    service_id,
    null
  );
};

// mechanic
const addExtraWorkData = async (
  data: {
    extra_issue: string;
    extra_issue_description: string;
    extra_price: string;
  },
  service_id: string
) => {
  const updated_data = await ServiceProgressRepository.updateServiceProgress(
    { ...data, extra_work_accept_status: "pending" },
    service_id,
    null
  );
  return updated_data;
};
const changeServiceStatus = async (s_id: string, status: TServiceStatus) => {
  const data = await ServiceProgressRepository.updateServiceProgress(
    { service_status: status },
    s_id,
    null
  );

  return {
    service_progress_id: data.id,
    service_id: data.service_id,
    status: data.service_status,
  };
};

const cancelSerivce = async (user_id: string, s_id: string, reason: string) => {
  const user_data = await UserRepository.findById(user_id);
  if (!user_data) {
    throw new AppError("User not found.", 404);
  }
  return await ServiceProgressRepository.cancelService(
    s_id,
    reason,
    user_data.role
  );
};

export const ServiceProgressService = {
  hireMechanic,
  changeServiceStatus,
  markAsComplete,
  getAllRunningServiceProgress,
  addExtraWorkData,
  acceptOrRejectExtraWork,
  cancelSerivce,
};
