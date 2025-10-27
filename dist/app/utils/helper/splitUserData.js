"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.splitUserData = splitUserData;
const profileKeys = [
    "full_name",
    "user_name",
    "mobile",
    "address",
    "image_id",
    "image",
];
const locationKeys = [
    "apartment_no",
    "road_no",
    "state",
    "city",
    "zip_code",
    "address", // <-- note: same as in profile
    "country",
];
function splitUserData(data) {
    const profile_data = {};
    const location_data = {};
    for (const key in data) {
        if (profileKeys.includes(key)) {
            profile_data[key] = data[key];
        }
        if (locationKeys.includes(key)) {
            location_data[key] = data[key];
        }
    }
    return { profile_data, location_data };
}
