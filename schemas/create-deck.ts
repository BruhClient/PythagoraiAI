import { z } from "zod";

export const CreateDeckSchema = z.object({
  title: z.string().trim().min(1, { message: "Title is required." }),
  color: z.string(),
  icon: z.string(),
});

export type CreateDeckPayload = z.infer<typeof CreateDeckSchema>;
