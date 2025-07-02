import { NextRequest } from "next/server";
import { db } from "@/db";
import { auth } from "@/lib/auth";
import { decks, cards } from "@/db/schema";
import { sql } from "drizzle-orm";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  const take = parseInt(searchParams.get("take") ?? "10");
  const folderId = searchParams.get("folderId");
  const cursor = searchParams.get("cursor");

  const session = await auth();
  if (!session) {
    return new Response("Unauthorized", { status: 401 });
  }

  try {
    const cursorFilter = cursor
      ? sql`AND d."createdAt" < ${new Date(cursor)}`
      : sql``;

    const folderFilter = folderId ? sql`AND d."folderId" = ${folderId}` : sql``;

    const result = await db.execute(sql`
      SELECT
        d.*,
        COUNT(c.id) AS "cardCount"
      FROM ${decks} d
      LEFT JOIN ${cards} c ON c."deckId" = d.id
      WHERE d."userId" = ${session.user.id} 
      ${folderFilter}
      ${cursorFilter}
      GROUP BY d.id
      ORDER BY d."createdAt" DESC
      LIMIT ${take}
    `);

    const rows = result.rows as Array<
      typeof decks.$inferSelect & { cardCount: number }
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
    console.error("Error fetching decks with card counts:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
