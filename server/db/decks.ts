"use server";

import { colors } from "@/data/constants";
import { db } from "@/db";
import { cards, decks, folders } from "@/db/schema";
import { auth } from "@/lib/auth";
import { CreateDeckPayload } from "@/schemas/create-deck";
import { CreateFolderPayload } from "@/schemas/create-folder";
import { and, eq, InferModel, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export const createDeck = async (
  folderId: string,
  values: CreateDeckPayload
) => {
  const session = await auth();

  if (!session) {
    return null;
  }
  try {
    const data = await db
      .insert(decks)
      .values({
        ...values,
        folderId,
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

export const updateDeck = async (
  id: string,
  title: string,
  color: string,
  icon: string
) => {
  const session = await auth();
  if (!session) {
    return null;
  }
  try {
    const data = await db
      .update(decks)
      .set({
        title,
        icon,
        //@ts-ignore
        color: colors[color],
      })
      .where(and(eq(decks.userId, session.user.id), eq(decks.id, id)))
      .returning();

    revalidatePath(`/decks/${id}`);
    return data[0];
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const deleteDeck = async (id: string) => {
  const session = await auth();

  if (!session) {
    return null;
  }
  try {
    const data = await db
      .delete(decks)
      .where(and(eq(decks.userId, session.user.id), eq(decks.id, id)))
      .returning();
    return data[0];
  } catch (error) {
    return null;
  }
};

export const getDeckById = async (id: string) => {
  const session = await auth();

  if (!session) {
    return null;
  }
  try {
    const deck = await db.query.decks.findFirst({
      where: and(eq(decks.id, id), eq(decks.userId, session.user.id)),
    });

    if (!deck) {
      return null;
    }

    const [{ count: cardCount }] = await db
      .select({ count: sql<number>`COUNT(*)` })
      .from(cards)
      .where(eq(cards.deckId, deck.id));
    return {
      ...deck,
      cardCount: cardCount.toString(),
    };
  } catch (error) {
    return null;
  }
};
