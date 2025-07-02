import { DeckMasteryOverview } from "@/components/charts/DeckMasteryOverview";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { db } from "@/db";
import { cards, decks } from "@/db/schema";
import { avg, eq } from "drizzle-orm";
import React from "react";

const ReviewsOverview = async ({ userId }: { userId: string }) => {
  const result = await db
    .select({
      deckId: decks.id,
      deckName: decks.title,
      averageMastery: avg(cards.mastery).as("averageMastery"),
    })
    .from(decks)
    .leftJoin(cards, eq(cards.deckId, decks.id))
    .where(eq(decks.userId, userId))
    .groupBy(decks.id, decks.title);

  const data = result.map((r) => ({
    ...r,
    averageMastery: r.averageMastery === null ? 0 : Number(r.averageMastery),
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Average Deck Mastery</CardTitle>
        <CardDescription>
          Showing the average mastery of each deck
        </CardDescription>
      </CardHeader>
      <CardContent className="h-full flex justify-center items-center">
        <DeckMasteryOverview chartData={data} />
      </CardContent>
    </Card>
  );
};

export default ReviewsOverview;
