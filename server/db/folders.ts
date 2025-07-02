"use server";

import { colors } from "@/data/constants";
import { db } from "@/db";
import { folders } from "@/db/schema";
import { auth } from "@/lib/auth";
import { CreateFolderPayload } from "@/schemas/create-folder";
import { and, eq, InferModel } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export const createFolder = async (values: CreateFolderPayload) => {
  const session = await auth();

  if (!session) {
    return null;
  }
  try {
    const data = await db
      .insert(folders)
      .values({
        title: values.title,
        //@ts-ignore
        color: colors[values.color],
        userId: session.user.id,
      })
      .returning();
    return data[0];
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const updateFolder = async (
  id: string,
  title: string,
  color: string
) => {
  const session = await auth();
  if (!session) {
    return null;
  }
  try {
    const data = await db
      .update(folders)
      .set({
        title,
        //@ts-ignore
        color: colors[color],
      })
      .where(and(eq(folders.userId, session.user.id), eq(folders.id, id)))
      .returning();
    revalidatePath(`/folders/${id}`);
    return data[0];
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const deleteFolder = async (id: string) => {
  const session = await auth();

  if (!session) {
    return null;
  }
  try {
    const data = await db
      .delete(folders)
      .where(and(eq(folders.userId, session.user.id), eq(folders.id, id)))
      .returning();
    return data[0];
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const getFolderById = async (id: string) => {
  const session = await auth();

  if (!session) {
    return null;
  }
  try {
    const data = await db.query.folders.findFirst({
      where: and(eq(folders.id, id), eq(folders.userId, session.user.id)),
    });
    return data;
  } catch (error) {
    return null;
  }
};
