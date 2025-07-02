import { NextRequest } from "next/server";
import { db } from "@/db";
import { auth } from "@/lib/auth";
import { decks } from "@/db/schema";
import { desc, eq } from "drizzle-orm";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session) {
    return new Response("Unauthorized", { status: 401 });
  }

  try {
    const rows = await db.query.decks.findMany({
      where: eq(decks.userId, session.user.id),
      orderBy: desc(decks.totalReviewedCards),
      limit: 5,
    });

    return Response.json(rows);
  } catch (error) {
    console.error("Error fetching decks:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
