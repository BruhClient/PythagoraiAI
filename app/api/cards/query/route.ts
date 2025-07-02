import { NextRequest } from "next/server";
import { db } from "@/db";
import { auth } from "@/lib/auth";
import { cards } from "@/db/schema";
import { and, eq, asc, desc, gt, lt, or } from "drizzle-orm";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  const take = parseInt(searchParams.get("take") ?? "10");
  const deckId = searchParams.get("deckId") ?? "";
  const cursorFront = searchParams.get("cursorFront");
  const cursorMasteryRaw = searchParams.get("cursorMastery");
  const cursorId = searchParams.get("cursorId");
  const filter = searchParams.get("filter"); // "ai", "human", or undefined
  const masteryOrder = searchParams.get("masteryOrder"); // "asc" or "desc"

  const session = await auth();
  if (!session) {
    return new Response("Unauthorized", { status: 401 });
  }

  try {
    const filters = [
      eq(cards.userId, session.user.id),
      eq(cards.deckId, deckId),
    ];

    const cursorMastery =
      cursorMasteryRaw !== null && !isNaN(parseFloat(cursorMasteryRaw))
        ? parseFloat(cursorMasteryRaw)
        : null;

    // Add AI/human filter if applicable
    if (filter === "human") {
      filters.push(eq(cards.isAi, false));
    } else if (filter === "ai") {
      filters.push(eq(cards.isAi, true));
    }

    // Composite cursor logic
    if (cursorFront && cursorMastery !== null && cursorId) {
      const cursorCondition =
        masteryOrder === "asc"
          ? or(
              gt(cards.mastery, cursorMastery),
              and(
                eq(cards.mastery, cursorMastery),
                gt(cards.front, cursorFront)
              ),
              and(
                eq(cards.mastery, cursorMastery),
                eq(cards.front, cursorFront),
                gt(cards.id, cursorId)
              )
            )
          : or(
              lt(cards.mastery, cursorMastery),
              and(
                eq(cards.mastery, cursorMastery),
                lt(cards.front, cursorFront)
              ),
              and(
                eq(cards.mastery, cursorMastery),
                eq(cards.front, cursorFront),
                lt(cards.id, cursorId)
              )
            );
      //@ts-ignore
      filters.push(cursorCondition);
    }

    const orderBy =
      masteryOrder === "asc"
        ? [asc(cards.mastery), asc(cards.front), asc(cards.id)]
        : [desc(cards.mastery), desc(cards.front), desc(cards.id)];

    const data = await db.query.cards.findMany({
      where: and(...filters),
      limit: take,
      orderBy,
    });

    const last = data.at(-1);
    const nextCursor = last
      ? {
          mastery: last.mastery,
          front: last.front,
          id: last.id,
        }
      : null;

    return Response.json({ data, nextCursor });
  } catch (error) {
    console.error("Error fetching cards:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
