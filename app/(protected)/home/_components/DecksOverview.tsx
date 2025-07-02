import React from "react";
import { eq } from "drizzle-orm";
import { decks } from "@/db/schema";
import { db } from "@/db";
import { ReviewPieChart } from "@/components/charts/ReviewPieChart";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
const DecksOverview = async ({ userId }: { userId: string }) => {
  const data = (await db
    .select({
      deckId: decks.id,
      deckName: decks.title,
      reviewCount: decks.totalReviewedCards,
    })
    .from(decks)
    .where(eq(decks.userId, userId))) as {
    reviewCount: number;
    deckName: string;
    deckId: string;
  }[];

  return (
    <Card className="h-full ">
      <CardHeader>
        <CardTitle>Deck Review Breakdown</CardTitle>
        <CardDescription>
          Top 10 decks with the most cards practiced
        </CardDescription>
      </CardHeader>
      <CardContent className="flex justify-center flex-col h-full items-center">
        <ReviewPieChart data={data} />
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm"></CardFooter>
    </Card>
  );
};

export default DecksOverview;
