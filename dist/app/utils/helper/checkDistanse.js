"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkNearbyWorkshops = void 0;
const drizzle_orm_1 = require("drizzle-orm");
const db_1 = require("../../db");
const checkNearbyWorkshops = (coordinates, mechanic_id // mechanic's user_id
) => __awaiter(void 0, void 0, void 0, function* () {
    const [longitude, latitude] = coordinates;
    const result = yield db_1.db.execute((0, drizzle_orm_1.sql) `
    SELECT *
    FROM (
      SELECT id, workshop_name, location_name, user_id,
        6371 * 2 * ASIN(
          SQRT(
            POWER(SIN(RADIANS((coordinates[2] - ${latitude})) / 2), 2) +
            COS(RADIANS(${latitude})) * COS(RADIANS(coordinates[2])) *
            POWER(SIN(RADIANS((coordinates[1] - ${longitude})) / 2), 2)
          )
        ) AS distance_km
      FROM mechanic_workshops
      WHERE coordinates[2] BETWEEN ${latitude} - 0.045 AND ${latitude} + 0.045
        AND coordinates[1] BETWEEN ${longitude} - 0.045 AND ${longitude} + 0.045
        ${mechanic_id ? (0, drizzle_orm_1.sql) `AND user_id != ${mechanic_id}` : (0, drizzle_orm_1.sql) ``}
    ) AS subquery
    WHERE distance_km <= 5
    ORDER BY distance_km ASC
    LIMIT 1;
  `);
    if (result.rows.length > 0) {
        return true;
    }
    console.log("✅ No nearby workshops found");
    return false;
});
exports.checkNearbyWorkshops = checkNearbyWorkshops;
