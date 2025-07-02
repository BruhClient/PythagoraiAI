"use server";

import { db } from "@/db";
import { decks, folders } from "@/db/schema";
import { auth } from "@/lib/auth";
import { and, count, eq } from "drizzle-orm";
import { getDeckById } from "../db/decks";

export const canCreateGeneration = async (deckId: string) => {
  const session = await auth();
  if (!session)
    return {
      permission: false,
      reason: "Unauthorized",
    };

  const data = await getDeckById(deckId);

  if (!data) {
    return {
      permission: false,
      reason: "DeckId cant be found",
    };
  }
  if (session.user.gems > 0)
    return {
      permission: true,
    };
  return {
    permission: false,
    reason: "You have ran out of gems . Please purchase some . ",
  };
};

export const canCreateFolder = async () => {
  const session = await auth();
  if (!session) return false;

  const result = await db
    .select({ count: count() })
    .from(folders)
    .where(eq(folders.userId, session.user.id));

  // Extract count value (some DBs return BigInt)
  const folderCount = Number(result[0].count);

  if (folderCount < 20) return true;
  return false;
};

export const canCreateDeck = async (folderId: string) => {
  const session = await auth();
  if (!session) return false;

  const result = await db
    .select({ count: count() })
    .from(decks)
    .where(
      and(eq(decks.userId, session.user.id), eq(decks.folderId, folderId))
    );

  // Extract count value (some DBs return BigInt)
  const deckCount = Number(result[0].count);

  if (deckCount < 20) return true;
  return false;
};
