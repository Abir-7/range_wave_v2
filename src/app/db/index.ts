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
    // service
  },
});
