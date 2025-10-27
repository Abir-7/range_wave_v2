"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = exports.schema = void 0;
const message_schema_1 = require("../schema/chat/message/message.schema");
// Make sure to install the 'pg' package
const node_postgres_1 = require("drizzle-orm/node-postgres");
const pg_1 = require("pg");
const appConfig_1 = require("../config/appConfig");
const user_authentication_schema_1 = require("../schema/user/user_authentication.schema");
const user_profiles_schema_1 = require("../schema/user/user_profiles.schema");
const user_schema_1 = require("../schema/user/user.schema");
const mechanics_workshop_schema_1 = require("../schema/user/mechanics_workshop.schema");
const mechanic_payment_data_schema_1 = require("../schema/user/mechanic_payment_data.schema");
const user_carinfo_schema_1 = require("../schema/user/user_carinfo.schema");
const user_location_schema_1 = require("../schema/user/user_location.schema");
const room_schema_1 = require("../schema/chat/room/room.schema");
const message_schema_2 = require("../schema/chat/message/message.schema");
const given_by_mechanic_schema_1 = require("../schema/rating/given_by_mechanic/given_by_mechanic.schema");
const given_by_user_schema_1 = require("../schema/rating/given_by_user/given_by_user.schema");
const payment_schema_1 = require("../schema/payment/payment.schema");
const service_progress_schema_1 = require("../schema/service_flow/progress/service_progress.schema");
const bid_schema_1 = require("../schema/service_flow/bid/bid.schema");
const service_schema_1 = require("../schema/service_flow/service/service.schema");
const payment_for_workshop_1 = require("../schema/payment/payment_for_workshop");
const pool = new pg_1.Pool({
    connectionString: appConfig_1.appConfig.database.dataBase_uri,
});
exports.schema = {
    //user & mechanic
    Users: user_schema_1.Users,
    UserProfiles: user_profiles_schema_1.UserProfiles,
    UserLocations: user_location_schema_1.UserLocations,
    MechanicWorkshop: mechanics_workshop_schema_1.MechanicWorkshop,
    MechanicPaymentData: mechanic_payment_data_schema_1.MechanicPaymentData,
    UserCars: user_carinfo_schema_1.UserCars,
    UserAuthentications: user_authentication_schema_1.UserAuthentications,
    //
    UsersRelations: user_schema_1.UsersRelations,
    UserAuthenticationsRelations: user_authentication_schema_1.UserAuthenticationsRelations,
    MechanicWorkshopRelations: mechanics_workshop_schema_1.MechanicWorkshopRelations,
    UserPaymentDataRelations: mechanic_payment_data_schema_1.UserPaymentDataRelations,
    UserCarsRelations: user_carinfo_schema_1.UserCarsRelations,
    UserLocationsRelations: user_location_schema_1.UserLocationsRelations,
    UserProfilesRelations: user_profiles_schema_1.UserProfilesRelations,
    //chat
    ChatRooms: room_schema_1.ChatRooms,
    ChatRoomsRelations: room_schema_1.ChatRoomsRelations,
    Messages: message_schema_2.Messages,
    MessagesRelations: message_schema_1.MessagesRelations,
    //rating
    RatingByMechanic: given_by_mechanic_schema_1.RatingByMechanic,
    RatingByUser: given_by_user_schema_1.RatingByUser,
    RatingByMechanicRelations: given_by_mechanic_schema_1.RatingByMechanicRelations,
    RatingByUserRelations: given_by_user_schema_1.RatingByUserRelations,
    //payment
    Payments: payment_schema_1.Payments,
    PaymentsRelations: payment_schema_1.PaymentsRelations,
    Payments_for_workshop: payment_for_workshop_1.Payments_for_workshop,
    // service
    Services: service_schema_1.Services,
    ServicesRelations: service_schema_1.ServicesRelations,
    ServiceProgress: service_progress_schema_1.ServiceProgress,
    ServiceProgressRelation: service_progress_schema_1.ServiceProgressRelation,
    //Bid
    Bids: bid_schema_1.Bids,
    BidsRelations: bid_schema_1.BidsRelations,
};
exports.db = (0, node_postgres_1.drizzle)(pool, {
    schema: exports.schema,
});
