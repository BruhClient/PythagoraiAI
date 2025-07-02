"use client";

import React, { useEffect, useRef } from "react";
import { useIntersection } from "@mantine/hooks";
import { MotionDiv } from "@/components/Motion";
import { containerVariants } from "@/lib/variants";
import { AnimatePresence } from "motion/react";

import { Upload } from "lucide-react";
import CreateDeckButton from "./CreateDeckButton";
import { useDecks } from "@/hooks/use-decks";
import DeckCard from "@/components/cards/DeckCard";
import Masonry from "react-masonry-css";
import { breakpointColumnsObj } from "@/data/constants";
import FeedLoader from "@/components/FeedLoader";
const DeckFeed = ({ folderId }: { folderId: string }) => {
  const { decks, fetchNextPage, hasNextPage, isFetching } = useDecks({
    folderId,
  });

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
          if (index >= decks.length - 1) {
            return (
              <AnimatePresence key={deck.id}>
                <MotionDiv
                  initial="hidden"
                  variants={containerVariants}
                  animate="visible"
                  exit="exit"
                  className="break-inside-avoid"
                  ref={ref}
                >
                  <DeckCard {...deck} />
                </MotionDiv>
              </AnimatePresence>
            );
          }
          return (
            <AnimatePresence key={deck.id}>
              <MotionDiv
                initial="hidden"
                variants={containerVariants}
                animate="visible"
                exit="exit"
                className="break-inside-avoid"
                key={deck.id}
              >
                <DeckCard {...deck} />
              </MotionDiv>
            </AnimatePresence>
          );
        })}
      </Masonry>
      {hasNextPage && isFetching && <FeedLoader />}
      {!isFetching && decks.length === 0 && (
        <div className="w-full flex justify-center items-center h-[70vh] flex-col gap-3">
          <Upload size={70} />
          <div className="text-2xl font-bold ">You have no decks</div>
          <div className="text-muted-foreground ">
            Create decks and get started
          </div>
          <CreateDeckButton folderId={folderId} />
        </div>
      )}
    </>
  );
};

export default DeckFeed;
