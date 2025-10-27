const profileKeys = [
  "full_name",
  "user_name",
  "mobile",
  "address",
  "image_id",
  "image",
] as const;

const locationKeys = [
  "apartment_no",
  "road_no",
  "state",
  "city",
  "zip_code",
  "address", // <-- note: same as in profile
  "country",
] as const;

export function splitUserData(data: Record<string, any>) {
  const profile_data: any = {};
  const location_data: any = {};

  for (const key in data) {
    if (profileKeys.includes(key as any)) {
      profile_data[key] = data[key];
    }
    if (locationKeys.includes(key as any)) {
      location_data[key] = data[key];
    }
  }

  return { profile_data, location_data };
}
