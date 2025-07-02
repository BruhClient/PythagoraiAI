"use server";

import { cards } from "@/db/schema";
import { InferModel } from "drizzle-orm";

type Card = InferModel<typeof cards>;
export function reviewFlashcard(card: Card, quality: number) {
  let { easeFactor, interval, repetitions } = card;

  if (!easeFactor || !interval || !repetitions) {
    return {
      easeFactor,
      interval,
      repetitions,
    };
  }
  if (quality < 3) {
    // Reset if answer was poor
    return {
      easeFactor: Math.max(1.3, easeFactor - 0.2),
      interval: 1,
      repetitions: 0,
    };
  }

  if (repetitions === 0) {
    interval = 1;
  } else if (repetitions === 1) {
    interval = 6;
  } else {
    interval = Math.round(interval * easeFactor);
  }

  easeFactor = Math.max(
    1.3,
    easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02))
  );
  repetitions += 1;

  const dueDate = new Date();
  dueDate.setDate(dueDate.getDate() + interval);

  return {
    easeFactor,
    interval,
    repetitions,
    dueDate,
  };
}
