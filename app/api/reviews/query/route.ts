// app/api/reviews/route.ts
import { NextRequest } from "next/server";
import { db } from "@/db";
import { auth } from "@/lib/auth";
import { reviews } from "@/db/schema";
import { sql } from "drizzle-orm";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  const take = parseInt(searchParams.get("take") ?? "10");
  const cursor = searchParams.get("cursor");
  const deckId = searchParams.get("deckId");

  const session = await auth();
  if (!session) return new Response("Unauthorized", { status: 401 });

  try {
    const cursorFilter = cursor
      ? sql`AND r."createdAt" < ${new Date(cursor)}`
      : sql``;

    const deckFilter = deckId ? sql`AND r."deckId" = ${deckId}` : sql``;

    const result = await db.execute(sql`
      SELECT r.*
      FROM ${reviews} r
      WHERE r."userId" = ${session.user.id}
      ${deckFilter}
      ${cursorFilter}
      ORDER BY r."createdAt" DESC
      LIMIT ${take}
    `);

    const rows = result.rows as (typeof reviews.$inferSelect)[];

    const nextCursor =
      rows.length === take
        ? new Date(rows[rows.length - 1].createdAt).toISOString()
        : null;

    return Response.json({ data: rows, nextCursor });
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
