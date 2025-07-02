import { qualityIndicators } from "@/data/constants";
import { cards } from "@/db/schema";
import { clsx, type ClassValue } from "clsx";
import { InferModel } from "drizzle-orm";
import { twMerge } from "tailwind-merge";
// utils/reactQueryUtils.ts
import { QueryClient } from "@tanstack/react-query";
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function extractFileKey(fileUrl: string): string | null {
  const match = fileUrl.match(/\/f\/([^/]+)/);
  return match ? match[1] : null;
}

export function shortenNumber(num: number, decimals = 1) {
  if (num === null || num === undefined || isNaN(num)) return "0";

  const absNum = Math.abs(num);
  const sign = Math.sign(num);
  const units = ["", "K", "M", "B", "T", "Q"];
  let unitIndex = 0;

  while (absNum >= 1000 && unitIndex < units.length - 1) {
    num /= 1000;
    unitIndex++;
  }

  return `${(num * sign).toFixed(decimals)}${units[unitIndex]}`;
}

export function isStringInteger(str: string): boolean {
  return /^-?\d+$/.test(str);
}

export function transformRawScoresToChart(scores: number[]) {
  // Init counts from 1 to 5
  const counts: Record<number, number> = {
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
  };

  // Count occurrences
  for (const score of scores) {
    if (counts[score] !== undefined) {
      counts[score]++;
    }
  }

  // Format for chart
  return Object.entries(counts).map(([key, value]) => {
    const index = Number(key) - 1; // index for array access
    const name = qualityIndicators[index]?.name ?? "Unknown";
    return {
      quality: name,
      count: value,
    };
  });
}

export function calculateMastery(
  easeFactor: number,
  repetitions: number,
  totalQuality: number
): number {
  const avgQuality = totalQuality / Math.max(repetitions, 1);
  const normalizedEase = easeFactor / 3;
  const normalizedQuality = avgQuality / 5;

  const repetitionFactor = Math.log2(repetitions + 1) / Math.log2(10); // caps out at 1 around 9 reps

  return Math.min(
    1,
    Math.max(0, normalizedEase * normalizedQuality * repetitionFactor)
  );
}

export function removeCardFromPaginatedCache(
  queryClient: QueryClient,
  keys: any[],
  cardId: string
) {
  console.log(keys);
  queryClient.setQueryData(keys, (oldData: any) => {
    if (!oldData) return oldData;

    return {
      ...oldData,
      pages: oldData.pages.map((page: any) => ({
        ...page,
        cards: page.cards.filter((card: any) => card.id !== cardId),
      })),
    };
  });
}

export function addCardsToPaginatedCache(
  queryClient: QueryClient,
  keys: any[],
  data: InferModel<typeof cards>[]
) {
  queryClient.setQueryData(keys, (oldData: any) => {
    if (!oldData) {
      return oldData;
    }

    return {
      ...oldData,
      pages: [
        {
          ...oldData.pages[0],
          cards: [...data, ...oldData.pages[0].cards],
        },
        ...oldData.pages.slice(1),
      ],
    };
  });
}

export function updateCardFromPaginatedCache(
  queryClient: QueryClient,
  keys: any[],
  data: Partial<InferModel<typeof cards>>
) {
  queryClient.setQueryData(keys, (oldData: any) => {
    if (!oldData) {
      return oldData;
    }

    return {
      ...oldData,
      pages: oldData.pages.map((page: any) => {
        return {
          ...page,
          cards: page.cards.map((card: any) => {
            if (card.id === data.id) {
              return {
                ...card,
                ...data,
              }; // Replace with updated data
            }
            return card;
          }),
        };
      }),
    };
  });
}

export const formatMasteryData = (raw: Record<string, number>) =>
  Object.entries(raw).map(([mastery, count]) => ({ mastery, count }));

export function truncateText(text: string, maxLength: number) {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - 1) + "…";
}

export function formatNumberShort(value: number): string {
  if (value >= 1_000_000_000) {
    return (value / 1_000_000_000).toFixed(2).replace(/\.00$/, "") + "B";
  }
  if (value >= 1_000_000) {
    return (value / 1_000_000).toFixed(2).replace(/\.00$/, "") + "M";
  }
  if (value >= 1_000) {
    return (value / 1_000).toFixed(2).replace(/\.00$/, "") + "k";
  }
  return value.toString();
}
