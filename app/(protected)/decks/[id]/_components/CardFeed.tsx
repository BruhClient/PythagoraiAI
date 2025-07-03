"use client";
import React, { useEffect, useRef } from "react";
import { useIntersection } from "@mantine/hooks";
import { MotionDiv } from "@/components/Motion";
import { containerVariants } from "@/lib/variants";
import { AnimatePresence } from "motion/react";
import { Upload } from "lucide-react";
import { useCards } from "@/hooks/use-cards";
import FlashCard from "@/components/cards/FlashCard";
import CreateCardButton from "./CreateCardButton";
import Masonry from "react-masonry-css";
import { breakpointColumnsObj } from "@/data/constants";
import FeedLoader from "@/components/FeedLoader";
const CardFeed = ({ deckId }: { deckId: string }) => {
  const { cards, fetchNextPage, hasNextPage, isFetching, isFetched } = useCards(
    {
      deckId,
    }
  );

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
        {cards.map((card, index) => {
          if (index >= cards.length - 1) {
            return (
              <AnimatePresence key={card.id}>
                <MotionDiv
                  initial="hidden"
                  variants={containerVariants}
                  animate="visible"
                  exit="exit"
                  ref={ref}
                >
                  <FlashCard {...card} />
                </MotionDiv>
              </AnimatePresence>
            );
          }
          return (
            <AnimatePresence key={card.id}>
              <MotionDiv
                initial="hidden"
                variants={containerVariants}
                animate="visible"
                exit="exit"
              >
                <FlashCard {...card} />
              </MotionDiv>
            </AnimatePresence>
          );
        })}
      </Masonry>
      {hasNextPage && <FeedLoader />}

      {isFetched && cards.length === 0 && (
        <div className="w-full flex justify-center items-center h-[70vh] flex-col gap-3">
          <Upload size={70} />
          <div className="text-2xl font-bold ">You have no cards</div>
          <div className="text-muted-foreground ">
            Create cards and get started
          </div>
          <CreateCardButton id={deckId} />
        </div>
      )}
    </>
  );
};

export default CardFeed;
