import { ChartMasteryOverview } from "@/components/charts/ChartMasteryOverview";
import { db } from "@/db";
import { cards } from "@/db/schema";
import { formatMasteryData } from "@/lib/utils";
import { eq } from "drizzle-orm";
import React from "react";

const DeckAnalytics = async ({ deckId }: { deckId: string }) => {
  const masteries = {
    "Very Weak": 0,
    Weak: 0,
    Okay: 0,
    Good: 0,
    Excellent: 0,
  };

  const data = await db
    .select({ mastery: cards.mastery })
    .from(cards)
    .where(eq(cards.deckId, deckId));

  for (const { mastery } of data) {
    if (mastery >= 0.8) {
      masteries["Excellent"]++;
    } else if (mastery >= 0.6) {
      masteries["Good"]++;
    } else if (mastery >= 0.4) {
      masteries["Okay"]++;
    } else if (mastery >= 0.2) {
      masteries["Weak"]++;
    } else {
      masteries["Very Weak"]++;
    }
  }

  return <ChartMasteryOverview masteryData={formatMasteryData(masteries)} />;
};

export default DeckAnalytics;
