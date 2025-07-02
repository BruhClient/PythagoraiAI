import { z } from "zod";

export const CreateTestSchema = z.object({
  numOfCards: z
    .number()
    .min(1, { message: "Flash card value must be greater than 0" }),
  type: z.string(),
});

export type CreateTestPayload = z.infer<typeof CreateTestSchema>;
