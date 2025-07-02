import React from "react";
import { sql } from "drizzle-orm";
import { decks, cards } from "@/db/schema";
import { db } from "@/db";
import { CardsBarChart } from "@/components/charts/CardsBarChart";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const CardsOverview = async ({ userId }: { userId: string }) => {
  const result = await db.execute(sql`
  SELECT
    d.id AS "deckId",
    d.title AS "deckName",
    COUNT(c.id) AS "totalCardCount",
    COUNT(c.id) FILTER (WHERE c."isAi" = true) AS "aiCardCount",
    COUNT(c.id) FILTER (WHERE c."isAi" = false) AS "humanCardCount"
  FROM ${decks} d
  LEFT JOIN ${cards} c ON d.id = c."deckId"
  WHERE d."userId" = ${userId}
  GROUP BY d.id, d.title
  ORDER BY "totalCardCount" DESC
`);

  const totals = result.rows as Array<{
    deckId: string;
    deckName: string;
    aiCardCount: string;
    totalCardCount: string;
    humanCardCount: string;
  }>;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Cards Overview</CardTitle>
        <CardDescription>Showing number of cards for each deck</CardDescription>
      </CardHeader>
      <CardContent className="justify-center items-center flex h-full"></CardContent>
      <CardsBarChart
        chartData={totals.map((data) => {
          return {
            deckName: data.deckName,
            aiCardCount: parseInt(data.aiCardCount),
            humanCardCount: parseInt(data.humanCardCount),
          };
        })}
      />
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="text-muted-foreground leading-none">
          Cards can be either AI or Human generated.
        </div>
      </CardFooter>
    </Card>
  );
};

export default CardsOverview;
