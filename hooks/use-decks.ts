"use client";

import { DEFAULT_FETCH_LIMIT } from "@/data/constants";
import { useInfiniteQuery } from "@tanstack/react-query";
import useSessionUser from "./use-session-user";

export const useDecks = ({ folderId }: { folderId: string }) => {
  const user = useSessionUser();

  const query = useInfiniteQuery({
    queryKey: ["decks", user?.id, folderId],
    queryFn: async ({ pageParam = null }) => {
      const cursorParam = pageParam ? `&cursor=${pageParam}` : "";
      const res = await fetch(
        `/api/decks/query?take=${DEFAULT_FETCH_LIMIT}${cursorParam}&folderId=${folderId}`
      );

      if (!res.ok) {
        throw new Error("Failed to fetch Decks");
      }

      const data = await res.json();

      return {
        decks: data.data ?? [],
        nextCursor: data.nextCursor ?? null,
      };
    },
    getNextPageParam: (lastPage) => {
      if (!lastPage?.decks?.length || !lastPage?.nextCursor) {
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
    decks: query.data?.pages.flatMap((page) => page.decks) ?? [],
  };
};
