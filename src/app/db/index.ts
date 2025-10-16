import { MessagesRelations } from "./schema/chat/message/message.schema";
// Make sure to install the 'pg' package
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { appConfig } from "../config/appConfig";
import {
  UserAuthentications,
  UserAuthenticationsRelations,
} from "./schema/user/user_authentication.schema";
import {
  UserProfiles,
  UserProfilesRelations,
} from "./schema/user/user_profiles.schema";
import { Users, UsersRelations } from "./schema/user/user.schema";
import {
  MechanicWorkshop,
  MechanicWorkshopRelations,
} from "./schema/user/mechanics_workshop.schema";
import {
  MechanicPaymentData,
  UserPaymentDataRelations,
} from "./schema/user/mechanic_payment_data.schema";
import { UserCars, UserCarsRelations } from "./schema/user/user_carinfo.schema";
import {
  UserLocations,
  UserLocationsRelations,
} from "./schema/user/user_location.schema";
import { ChatRooms, ChatRoomsRelations } from "./schema/chat/room/room.schema";
import { Messages } from "./schema/chat/message/message.schema";
import {
  RatingByMechanic,
  RatingByMechanicRelations,
} from "./schema/rating/given_by_mechanic/given_by_mechanic.schema";
import {
  RatingByUser,
  RatingByUserRelations,
} from "./schema/rating/given_by_user/given_by_user.schema";
import { Payments, PaymentsRelations } from "./schema/payment/payment.schema";

const pool = new Pool({
  connectionString: appConfig.database.dataBase_uri,
});
export const db = drizzle(pool, {
  schema: {
    //user & mechanic
    UserAuthentications,
    UserProfilesRelations,
    Users,
    UserProfiles,
    UsersRelations,
    UserAuthenticationsRelations,
    MechanicWorkshopRelations,
    MechanicWorkshop,
    MechanicPaymentData,
    UserPaymentDataRelations,
    UserCars,
    UserCarsRelations,
    UserLocations,
    UserLocationsRelations,
    ChatRooms,
    ChatRoomsRelations,
    Messages,
    MessagesRelations,
    RatingByMechanic,
    RatingByUser,
    RatingByMechanicRelations,
    RatingByUserRelations,
    Payments,
    PaymentsRelations,
    // service
  },
});
