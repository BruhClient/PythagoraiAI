import { z } from "zod";

export const CreateReviewSchema = z.object({
  name: z.string().trim().min(1, { message: "Name is required." }),
  rating: z.number(),
  comment: z.string().trim().min(1, { message: "Review is required." }),
});

export type CreateReviewPayload = z.infer<typeof CreateReviewSchema>;
