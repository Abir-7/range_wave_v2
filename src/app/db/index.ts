import { Messages, MessagesRelations } from "../schema/message.schema";
// Make sure to install the 'pg' package
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { appConfig } from "../config/appConfig";

import { Bids, BidsRelations } from "../schema/bid.schema";
import { Services, ServicesRelations } from "../schema/service.schema";
import { Payments_for_workshop } from "../schema/payment_for_workshop";
import { Users, UsersRelations } from "../schema/user.schema";
import {
  UserProfiles,
  UserProfilesRelations,
} from "../schema/user_profiles.schema";
import {
  UserLocations,
  UserLocationsRelations,
} from "../schema/user_location.schema";
import {
  MechanicWorkshop,
  MechanicWorkshopRelations,
} from "../schema/mechanics_workshop.schema";
import {
  MechanicPaymentData,
  UserPaymentDataRelations,
} from "../schema/mechanic_payment_data.schema";
import { UserCars, UserCarsRelations } from "../schema/user_carinfo.schema";
import {
  UserAuthentications,
  UserAuthenticationsRelations,
} from "../schema/user_authentication.schema";
import { ChatRooms, ChatRoomsRelations } from "../schema/room.schema";
import {
  RatingByMechanic,
  RatingByMechanicRelations,
} from "../schema/given_by_mechanic.schema";
import {
  RatingByUser,
  RatingByUserRelations,
} from "../schema/given_by_user.schema";
import { Payments, PaymentsRelations } from "../schema/payment.schema";
import {
  ServiceProgress,
  ServiceProgressRelation,
} from "../schema/service_progress.schema";

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
