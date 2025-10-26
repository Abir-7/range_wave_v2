export interface IUpdateUserProfile {
  full_name: string;
  user_name?: string;
  mobile?: string;
  address?: string;
  gender?: "male" | "female" | "other";
  image_id: string;
  image: string;
}
