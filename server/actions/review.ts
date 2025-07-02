"use server";

import { db } from "@/db";
import { cards, decks } from "@/db/schema";
import { calculateMastery } from "@/lib/utils";
import { and, eq } from "drizzle-orm";
import { updateCard } from "../db/cards";
import { auth } from "@/lib/auth";

const MIN_EASE_FACTOR = 1.0;
const DEFAULT_EASE_FACTOR = 2.5;
const INITIAL_INTERVALS = [1, 6];
const MAX_INTERVAL = 365;

type ReviewInput = {
  cardIds: string[];
  qualities: number[]; // array of scores from 1 to 5
};

export async function reviewCards({ cardIds, qualities }: ReviewInput) {
  if (cardIds.length !== qualities.length) {
    throw new Error("cardIds and qualities arrays must have the same length");
  }

  const session = await auth();
  if (!session) return null;

  try {
    const updates = await Promise.all(
      cardIds.map(async (cardId, idx) => {
        const quality = qualities[idx];

        if (quality < 1 || quality > 5) {
          throw new Error(
            `Quality score must be between 1 and 5 (card: ${cardId})`
          );
        }

        const [card] = await db
          .select()
          .from(cards)
          .where(eq(cards.id, cardId));
        if (!card) throw new Error(`Card with ID ${cardId} not found`);

        let {
          easeFactor = DEFAULT_EASE_FACTOR,
          interval = 1,
          repetitions = 0,
          totalQuality = 0,
        } = card;

        easeFactor = Math.max(
          MIN_EASE_FACTOR,
          easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02))
        );

        if (quality < 3) {
          repetitions = Math.max(repetitions - 1, 0);
          interval = 1;
        } else {
          repetitions += 1;

          if (repetitions === 1) {
            interval = INITIAL_INTERVALS[0];
          } else if (repetitions === 2) {
            interval = INITIAL_INTERVALS[1];
          } else {
            interval = Math.min(
              Math.round(interval * easeFactor),
              MAX_INTERVAL
            );
          }

          totalQuality += quality;
        }

        const dueDate = new Date();
        dueDate.setDate(dueDate.getDate() + interval);

        const mastery = calculateMastery(easeFactor, repetitions, totalQuality);

        const updated = await updateCard(cardId, {
          easeFactor,
          interval,
          repetitions,
          totalQuality,
          dueDate,
          mastery,
        });

        if (!updated) return null;

        return updated;
      })
    );

    const cardUpdates = updates.filter((card) => card !== null);

    if (!cardUpdates || cardUpdates.length === 0)
      throw Error("Something went wrong");

    const existingDeck = await db.query.decks.findFirst({
      where: and(
        eq(decks.id, cardUpdates[0].deckId),
        eq(decks.userId, cardUpdates[0].userId)
      ),
    });

    if (!existingDeck) return null;
    await db
      .update(decks)
      .set({
        totalReviewedCards:
          existingDeck.totalReviewedCards + cardUpdates.length,
      })
      .where(eq(decks.id, existingDeck.id));

    console.log({ cards: updates.filter(Boolean), userId: session.user.id });

    return { cards: updates.filter(Boolean), userId: session.user.id }; // filter out any failed ones
  } catch (error) {
    console.error("Failed to review cards:", error);
    return null;
  }
}
