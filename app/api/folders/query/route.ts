import { NextRequest } from "next/server";
import { db } from "@/db";
import { auth } from "@/lib/auth";
import { folders, decks, cards } from "@/db/schema";
import { sql } from "drizzle-orm";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  const take = parseInt(searchParams.get("take") ?? "10");
  const cursor = searchParams.get("cursor"); // ISO string expected

  const session = await auth();
  if (!session) {
    return new Response("Unauthorized", { status: 401 });
  }

  try {
    const cursorFilter = cursor
      ? sql`AND f."createdAt" < ${new Date(cursor)}`
      : sql``;

    const result = await db.execute(sql`
      SELECT
        f.*,
        COUNT(DISTINCT d.id) AS "deckCount",
        COUNT(c.id) AS "cardCount"
      FROM ${folders} f
      LEFT JOIN ${decks} d ON d."folderId" = f.id
      LEFT JOIN ${cards} c ON c."deckId" = d.id
      WHERE f."userId" = ${session.user.id}
      ${cursorFilter}
      GROUP BY f.id
      ORDER BY f."createdAt" DESC
      LIMIT ${take}
    `);

    const rows = result.rows as Array<
      typeof folders.$inferSelect & {
        deckCount: number;
        cardCount: number;
      }
    >;

    const nextCursor =
      rows.length > 0
        ? new Date(rows[rows.length - 1].createdAt).toISOString()
        : null;

    return Response.json({
      data: rows,
      nextCursor,
    });
  } catch (error) {
    console.error("Error fetching folders with counts:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
