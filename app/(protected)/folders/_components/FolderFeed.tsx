"use client";
import { useFolders } from "@/hooks/use-folders";
import React, { useEffect, useRef } from "react";
import { useIntersection } from "@mantine/hooks";
import FolderCard from "@/components/cards/FolderCard";
import { MotionDiv } from "@/components/Motion";
import { containerVariants } from "@/lib/variants";
import { AnimatePresence } from "motion/react";
import CreateFolderButton from "./CreateFolderButton";
import { Upload } from "lucide-react";
import Masonry from "react-masonry-css";
import { breakpointColumnsObj } from "@/data/constants";
import FeedLoader from "@/components/FeedLoader";
const FolderFeed = () => {
  const { folders, fetchNextPage, hasNextPage, isFetching } = useFolders();

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
        {folders.map((folder, index) => {
          if (index >= folders.length - 1) {
            return (
              <AnimatePresence key={folder.id}>
                <MotionDiv
                  initial="hidden"
                  variants={containerVariants}
                  animate="visible"
                  exit="exit"
                  className="break-inside-avoid"
                  ref={ref}
                >
                  <FolderCard key={folder.id} {...folder} />
                </MotionDiv>
              </AnimatePresence>
            );
          }
          return (
            <AnimatePresence key={folder.id}>
              <MotionDiv
                initial="hidden"
                variants={containerVariants}
                animate="visible"
                exit="exit"
                className="break-inside-avoid"
              >
                <FolderCard key={folder.id} {...folder} />
              </MotionDiv>
            </AnimatePresence>
          );
        })}
      </Masonry>

      {hasNextPage && <FeedLoader />}
      {!isFetching && folders.length === 0 && (
        <div className="w-full flex justify-center items-center h-[70vh] flex-col gap-3">
          <Upload size={70} />
          <div className="text-2xl font-bold ">You have no folders</div>
          <div className="text-muted-foreground ">
            Create folders and get started
          </div>
          <CreateFolderButton />
        </div>
      )}
    </>
  );
};

export default FolderFeed;
