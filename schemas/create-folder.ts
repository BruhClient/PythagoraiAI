import { z } from "zod";

export const CreateFolderSchema = z.object({
  title: z.string().trim().min(1, { message: "Title is required." }),
  color: z.string(),
});

export type CreateFolderPayload = z.infer<typeof CreateFolderSchema>;
