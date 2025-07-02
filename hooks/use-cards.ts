"use client";

import { DEFAULT_FETCH_LIMIT } from "@/data/constants";
import { useInfiniteQuery } from "@tanstack/react-query";
import useSessionUser from "./use-session-user";
import { useSearchParams } from "next/navigation";

export const useCards = ({ deckId }: { deckId: string }) => {
  const user = useSessionUser();
  const searchParams = useSearchParams();

  const filter = searchParams.get("filter");
  const masteryOrder = searchParams.get("mastery");
  const query = useInfiniteQuery({
    queryKey: ["cards", user?.id, deckId, filter, masteryOrder],
    queryFn: async ({ pageParam = null }: { pageParam: any }) => {
      const cursorParams = pageParam
        ? `&cursorMastery=${pageParam.mastery}&cursorFront=${encodeURIComponent(
            pageParam.front
          )}&cursorId=${pageParam.id}`
        : "";

      const filterParam = filter ? `&filter=${filter}` : "";

      const masteryOrderParam = masteryOrder
        ? `&masteryOrder=${masteryOrder}`
        : "";

      const res = await fetch(
        `/api/cards/query?take=20&deckId=${deckId}${cursorParams}${filterParam}${masteryOrderParam}`
      );

      if (!res.ok) {
        throw new Error("Failed to fetch cards");
      }

      const data = await res.json();

      return {
        cards: data.data ?? [],
        nextCursor: data.nextCursor ?? null,
      };
    },
    getNextPageParam: (lastPage) => {
      if (!lastPage?.cards?.length || !lastPage?.nextCursor) {
        return undefined;
      }
      return lastPage.nextCursor;
    },
    staleTime: 5 * 60_000,
    enabled: !!user,
    initialPageParam: null,
  });

  return {
    ...query,
    cards: query.data?.pages.flatMap((page) => page.cards) ?? [],
  };
};
