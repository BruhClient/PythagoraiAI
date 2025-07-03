"use client";
import React, { useEffect, useRef } from "react";
import { useIntersection } from "@mantine/hooks";
import { ChevronRight, Upload } from "lucide-react";
import Masonry from "react-masonry-css";
import { breakpointColumnsObj } from "@/data/constants";
import FeedLoader from "@/components/FeedLoader";
import { useAllDecks } from "@/hooks/use-all-decks";
import DeckCard from "@/components/cards/DeckCard";
import { Button } from "@/components/ui/button";
import Link from "next/link";
const GeneralDeckFeed = () => {
  const { decks, fetchNextPage, hasNextPage, isFetching, isFetched } =
    useAllDecks();

  const lastFolderRef = useRef(null);
  const { ref, entry } = useIntersection({
    root: lastFolderRef.current,
    threshold: 1,
  });

  useEffect(() => {
    if (entry?.isIntersecting && hasNextPage && !isFetching) {
      fetchNextPage();
    }
  }, [entry]);

  return (
    <>
      <Masonry
        breakpointCols={breakpointColumnsObj}
        className="my-masonry-grid"
        columnClassName="my-masonry-grid_column"
      >
        {decks.map((deck, index) => {
          if (index >= deck.length - 1) {
            return (
              <div key={deck.id} ref={ref}>
                <DeckCard {...deck} />
              </div>
            );
          }
          return (
            <div key={deck.id}>
              <DeckCard {...deck} />
            </div>
          );
        })}
      </Masonry>

      {hasNextPage && isFetching && <FeedLoader />}
      {isFetched && decks.length === 0 && (
        <div className="w-full flex justify-center items-center h-[70vh] flex-col gap-3">
          <Upload size={70} />
          <div className="text-2xl font-bold ">You have no decks</div>
          <div className="text-muted-foreground ">
            Create a folder and get started
          </div>
          <Button asChild variant={"ghost"}>
            <Link href={"/folders"}>
              Create Folder <ChevronRight />
            </Link>
          </Button>
        </div>
      )}
    </>
  );
};

export default GeneralDeckFeed;
