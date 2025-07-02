"use client";

import { DEFAULT_FETCH_LIMIT } from "@/data/constants";
import { useInfiniteQuery } from "@tanstack/react-query";
import useSessionUser from "./use-session-user";

export const useReviews = ({ deckId }: { deckId: string }) => {
  const user = useSessionUser();

  const query = useInfiniteQuery({
    queryKey: ["reviews", user?.id, deckId],
    queryFn: async ({ pageParam = null }) => {
      const cursorParam = pageParam ? `&cursor=${pageParam}` : "";
      const res = await fetch(
        `/api/reviews/query?take=${DEFAULT_FETCH_LIMIT}${cursorParam}&deckId=${deckId}`
      );

      if (!res.ok) {
        throw new Error("Failed to fetch Decks");
      }

      const data = await res.json();

      return {
        reviews: data.data ?? [],
        nextCursor: data.nextCursor ?? null,
      };
    },
    getNextPageParam: (lastPage) => {
      console.log(lastPage);
      if (!lastPage?.reviews?.length || !lastPage?.nextCursor) {
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
    reviews: query.data?.pages.flatMap((page) => page.reviews) ?? [],
  };
};
