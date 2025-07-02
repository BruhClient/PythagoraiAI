import { NextRequest } from "next/server";
import { db } from "@/db";
import { auth } from "@/lib/auth";
import { decks, cards, folders } from "@/db/schema";
import { sql } from "drizzle-orm";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session) {
    return new Response("Unauthorized", { status: 401 });
  }

  try {
    const result = await db.execute(sql`
      SELECT
        d.*,
        COUNT(c.id) AS "cardCount",
        f.title AS "folderName"
      FROM ${decks} d
      LEFT JOIN ${cards} c ON c."deckId" = d.id
      LEFT JOIN ${folders} f ON f.id = d."folderId"
      WHERE d."userId" = ${session.user.id}
      GROUP BY d.id, f.title
      ORDER BY d."createdAt" DESC
    `);

    const rows = result.rows as Array<
      typeof decks.$inferSelect & {
        cardCount: number;
        folderName: string | null;
      }
    >;

    return Response.json({
      data: rows,
    });
  } catch (error) {
    console.error("Error fetching decks:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
