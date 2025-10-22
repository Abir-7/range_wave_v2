export interface IRating {
  rating: number; // 1–5 stars
  text: string; // review text
  service_progress_id: string; // UUID of the related service progress
}
