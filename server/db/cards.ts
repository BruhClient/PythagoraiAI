"use server";

import { colors } from "@/data/constants";
import { db } from "@/db";
import { cards, decks, folders } from "@/db/schema";
import { auth } from "@/lib/auth";
import { calculateMastery } from "@/lib/utils";
import { CreateFolderPayload } from "@/schemas/create-folder";
import { and, eq, InferModel } from "drizzle-orm";
import { revalidatePath } from "next/cache";

type Card = Partial<InferModel<typeof cards>>;

export const createCard = async (
  deckId: string,
  inputs: {
    front: string;
    back: string;
  }[]
) => {
  const session = await auth();

  if (!session) {
    return null;
  }
  try {
    const existingDeck = await db.query.decks.findFirst({
      where: and(eq(decks.id, deckId), eq(decks.userId, session.user.id)),
    });

    if (!existingDeck) {
      return null;
    }

    const mastery = calculateMastery(2.5, 0, 0);

    const updatedCards = inputs.map((card) => {
      return {
        ...card,
        deckId,
        userId: session.user.id,
        mastery,
      };
    });
    const data = await db.insert(cards).values(updatedCards).returning();

    revalidatePath(`/decks/${data[0].deckId}`);
    return data[0];
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const deleteCard = async (id: string) => {
  const session = await auth();

  if (!session) {
    return null;
  }
  try {
    const data = await db
      .delete(cards)
      .where(and(eq(cards.userId, session.user.id), eq(cards.id, id)))
      .returning();
    revalidatePath(`/decks/${data[0].deckId}`);
    return data[0];
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const updateCard = async (id: string, values: Card) => {
  const session = await auth();

  if (!session) {
    return null;
  }
  try {
    const data = await db
      .update(cards)
      .set({
        ...values,
      })
      .where(and(eq(cards.userId, session.user.id), eq(cards.id, id)))
      .returning();

    return data[0];
  } catch (error) {
    console.log(error);
    return null;
  }
};
