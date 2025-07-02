"use client";

import { DEFAULT_FETCH_LIMIT } from "@/data/constants";
import { useInfiniteQuery } from "@tanstack/react-query";
import useSessionUser from "./use-session-user";

export const useFolders = () => {
  const user = useSessionUser();

  const query = useInfiniteQuery({
    queryKey: ["folders", user?.id],
    queryFn: async ({ pageParam = null }) => {
      const cursorParam = pageParam ? `&cursor=${pageParam}` : "";
      const res = await fetch(
        `/api/folders/query?take=${DEFAULT_FETCH_LIMIT}${cursorParam}`
      );

      if (!res.ok) {
        throw new Error("Failed to fetch Folders");
      }

      const data = await res.json();

      return {
        folders: data.data ?? [],
        nextCursor: data.nextCursor ?? null,
      };
    },
    getNextPageParam: (lastPage) => {
      if (!lastPage?.folders?.length || !lastPage?.nextCursor) {
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
    folders: query.data?.pages.flatMap((page) => page.folders) ?? [],
  };
};
