import { MessagesRelations } from "../schema/chat/message/message.schema";
// Make sure to install the 'pg' package
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { appConfig } from "../config/appConfig";
import {
  UserAuthentications,
  UserAuthenticationsRelations,
} from "../schema/user/user_authentication.schema";
import {
  UserProfiles,
  UserProfilesRelations,
} from "../schema/user/user_profiles.schema";
import { Users, UsersRelations } from "../schema/user/user.schema";
import {
  MechanicWorkshop,
  MechanicWorkshopRelations,
} from "../schema/user/mechanics_workshop.schema";
import {
  MechanicPaymentData,
  UserPaymentDataRelations,
} from "../schema/user/mechanic_payment_data.schema";
import {
  UserCars,
  UserCarsRelations,
} from "../schema/user/user_carinfo.schema";
import {
  UserLocations,
  UserLocationsRelations,
} from "../schema/user/user_location.schema";
import { ChatRooms, ChatRoomsRelations } from "../schema/chat/room/room.schema";
import { Messages } from "../schema/chat/message/message.schema";
import {
  RatingByMechanic,
  RatingByMechanicRelations,
} from "../schema/rating/given_by_mechanic/given_by_mechanic.schema";
import {
  RatingByUser,
  RatingByUserRelations,
} from "../schema/rating/given_by_user/given_by_user.schema";
import { Payments, PaymentsRelations } from "../schema/payment/payment.schema";
import {
  ServiceProgress,
  ServiceProgressRelation,
  serviceStatusEnum,
} from "../schema/service_flow/progress/service_progress.schema";
import { Bids, BidsRelations } from "../schema/service_flow/bid/bid.schema";
import {
  Services,
  ServicesRelations,
} from "../schema/service_flow/service/service.schema";
import { Payments_for_workshop } from "../schema/payment/payment_for_workshop";

const pool = new Pool({
  connectionString: appConfig.database.dataBase_uri,
});

export const schema = {
  //user & mechanic
  Users,
  UserProfiles,
  UserLocations,
  MechanicWorkshop,
  MechanicPaymentData,
  UserCars,
  UserAuthentications,
  //
  UsersRelations,
  UserAuthenticationsRelations,
  MechanicWorkshopRelations,
  UserPaymentDataRelations,
  UserCarsRelations,
  UserLocationsRelations,
  UserProfilesRelations,
  //chat
  ChatRooms,
  ChatRoomsRelations,
  Messages,
  MessagesRelations,
  //rating
  RatingByMechanic,
  RatingByUser,
  RatingByMechanicRelations,
  RatingByUserRelations,
  //payment
  Payments,
  PaymentsRelations,
  Payments_for_workshop,
  // service
  Services,

  ServicesRelations,
  ServiceProgress,
  ServiceProgressRelation,
  //Bid
  Bids,
  BidsRelations,
};

export const db = drizzle(pool, {
  schema: schema,
});
