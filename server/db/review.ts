"use server";

import { db } from "@/db";
import { decks, reviews } from "@/db/schema";
import { auth } from "@/lib/auth";
import { and, eq } from "drizzle-orm";
import { updateDeck } from "./decks";

export const createReview = async (
  results: { quality: string; count: number }[],
  deckId: string,
  maxCards: number
) => {
  const session = await auth();

  if (!session) {
    return null;
  }
  try {
    const data = await db
      .insert(reviews)
      .values({
        userId: session.user.id,
        results,
        deckId,
        maxCards,
      })
      .returning();

    return data[0];
  } catch (error) {
    console.log(error);
    return null;
  }
};
