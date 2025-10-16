/* eslint-disable @typescript-eslint/no-unused-vars */
export interface IAuthData {
  user_email: string;
  user_id: string;
  user_role: TUserRole;
}

export interface IDecodedData extends IAuthData {
  iat: number;
  exp: number;
}

export const user_roles = ["super_admin", "user", "mechanic"] as const;

export type TUserRole = (typeof user_roles)[number];

export const user_status = [
  "active",
  "pending_verification",
  "blocked",
  "disabled",
  "deleted",
] as const;
export type TUserStatus = (typeof user_status)[number];
