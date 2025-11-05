import { z } from "zod";

export const ZodIssueSchema = z.object({
  issue: z.string(),
  description: z.string(),
  scheduled_date: z.string().optional(),
  coordinates: z.array(z.string()),
  car_id: z.string(),
});

export type TIssue = z.infer<typeof ZodIssueSchema>;
