import { NextRequest } from "next/server";
import { db } from "@/db";
import { auth } from "@/lib/auth";
import { cards } from "@/db/schema";
import { asc, sql } from "drizzle-orm";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const max = parseInt(searchParams.get("max") ?? "10");
  const type = searchParams.get("type") ?? "default";
  const deckId = searchParams.get("deckId") ?? "";

  const session = await auth();
  if (!session) {
    return new Response("Unauthorized", { status: 401 });
  }

  if (!deckId) {
    return new Response("Missing deckId", { status: 400 });
  }

  try {
    const now = new Date();
    let primaryCards: (typeof cards.$inferSelect)[] = [];

    switch (type) {
      case "default": {
        primaryCards = await db.query.cards.findMany({
          where: (fields, { and, eq, lte }) =>
            and(eq(fields.deckId, deckId), lte(fields.dueDate, now)),
          orderBy: (fields) => [asc(fields.dueDate), sql`RANDOM()`],
          limit: max,
        });

        break;
      }

      case "new": {
        primaryCards = await db.query.cards.findMany({
          where: (fields, { and, eq }) =>
            and(eq(fields.deckId, deckId), eq(fields.repetitions, 0)),
          orderBy: () => [sql`RANDOM()`],
          limit: max,
        });

        break;
      }

      case "difficulty": {
        primaryCards = await db.query.cards.findMany({
          where: (fields, { eq }) => eq(fields.deckId, deckId),
          orderBy: (fields) => [asc(fields.easeFactor), sql`RANDOM()`],
          limit: max,
        });

        break;
      }

      case "low-mastery": {
        primaryCards = await db.query.cards.findMany({
          where: (fields, { and, eq, lt }) =>
            and(eq(fields.deckId, deckId), lt(fields.mastery, 0.5)),
          orderBy: (fields) => [asc(fields.mastery), sql`RANDOM()`],
          limit: max,
        });

        break;
      }

      case "random": {
        primaryCards = await db.query.cards.findMany({
          where: (fields, { eq }) => eq(fields.deckId, deckId),
          orderBy: () => [sql`RANDOM()`],
          limit: max,
        });

        break;
      }

      default: {
        return new Response("Invalid query type", { status: 400 });
      }
    }

    const remaining = max - primaryCards.length;
    let fillerCards: (typeof cards.$inferSelect)[] = [];
    const primaryIds = primaryCards.map((card) => card.id);

    if (remaining > 0) {
      fillerCards = await db.query.cards.findMany({
        where: (fields, { and, eq, notInArray }) =>
          and(eq(fields.deckId, deckId), notInArray(fields.id, primaryIds)),
        orderBy: (fields) => [asc(fields.dueDate)],
        limit: remaining,
      });
    }

    return Response.json([...primaryCards, ...fillerCards]);
  } catch (error) {
    console.error("Error fetching cards:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
