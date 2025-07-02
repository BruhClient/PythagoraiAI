"use server";

import { auth } from "@/lib/auth";
import { openai } from "@/lib/openai";
import { createCard } from "../db/cards";
import { SYSTEM_QUESTION_PROMPT } from "@/lib/prompt";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { updateUserById } from "../db/users";
import { db } from "@/db";
import { cards, users } from "@/db/schema";
import { calculateMastery } from "@/lib/utils";
import { eq, InferModel } from "drizzle-orm";

export async function generateFlashcards(
  deckId: string,
  pdfText: string,
  pdfUrl: string,
  numOfCards: number
) {
  const session = await auth();
  if (!session) return null;

  try {
    // 1. Chunk text using LangChain
    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 500,
      chunkOverlap: 50,
      separators: ["\n\n", "\n", " ", ""],
    });

    const chunks = (await splitter.splitText(pdfText)).slice(
      0,
      Math.floor(numOfCards / 2)
    );

    // 2. Get completions from OpenAI
    const completions = await Promise.all(
      chunks.map((chunk) =>
        openai.chat.completions.create({
          model: "gpt-3.5-turbo",
          messages: [
            { role: "system", content: SYSTEM_QUESTION_PROMPT },
            { role: "user", content: `Text:\n${chunk}` },
          ],
          temperature: 0.7,
          max_tokens: 300,
        })
      )
    );

    // 3. Parse and assemble flashcards
    const flashcards = completions.flatMap((res, i) => {
      const content = res.choices[0].message?.content ?? "[]";
      try {
        const parsed = JSON.parse(content);
        if (!Array.isArray(parsed)) return [];

        return parsed.map((card: any) => ({
          front: card.front,
          back: card.back,
          relevantText: card.relevantText ?? chunks[i],
          userId: session.user.id,
          deckId,
          pdfUrl,
          isAi: true,
        }));
      } catch {
        return [];
      }
    });

    return flashcards;
  } catch (err) {
    console.error("Flashcard generation error:", err);
    return null;
  }
}

export const addAiCards = async (flashcards: any[], deckId: string) => {
  const session = await auth();

  if (!session) {
    return null;
  }
  try {
    const mastery = calculateMastery(2.5, 0, 0);
    const updatedCards = flashcards.map((card) => {
      return {
        ...card,
        deckId,
        mastery,
      };
    }) as InferModel<typeof cards>[];
    const dbCards = await db.transaction(async (tx) => {
      const data = await tx.insert(cards).values(updatedCards).returning();
      await tx
        .update(users)
        .set({
          gems: session.user.gems,
        })
        .where(eq(users.id, session.user.id));

      return data;
    });

    return dbCards;
  } catch (error: any) {
    console.log(error);
    return null;
  }
};
