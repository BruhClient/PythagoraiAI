"use client";

import FeedLoader from "@/components/FeedLoader";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { qualityIndicators } from "@/data/constants";
import { useReviews } from "@/hooks/use-reviews";
import { format } from "date-fns";
import { ChevronDown } from "lucide-react";
import React from "react";
import { TbCards } from "react-icons/tb";

const RecentReviews = ({ deckId }: { deckId: string }) => {
  const { reviews, fetchNextPage, hasNextPage, isFetching } = useReviews({
    deckId,
  });

  return (
    <Card className="w-full h-full">
      <CardHeader>
        <CardTitle>Reviews</CardTitle>
        <CardDescription>View all your past test attempts</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 overflow-y-auto h-full max-h-[400px]">
        {reviews.map((review) => {
          const { id, results, maxCards, createdAt } = review as {
            results: {
              quality: string;
              count: number;
            }[];
            id: string;
            maxCards: number;
            createdAt: Date;
          };

          return (
            <div key={id} className="flex justify-between w-full">
              <div>
                <div className="text-sm text-muted-foreground">
                  {format(createdAt, "dd MMM yyyy HH:mm")}
                </div>
                <div className="flex gap-2">
                  {results.map((data) => {
                    //@ts-ignore
                    const Icon = qualityIndicators.find(
                      (indicator) => indicator.name === data.quality
                    ).icon;

                    return (
                      <div key={`${id}_${data.quality}`}>
                        {Icon}
                        {data.count}
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="flex items-center gap-1">
                {maxCards} <TbCards />
              </div>
            </div>
          );
        })}
        {isFetching && <FeedLoader />}
        {hasNextPage && !isFetching && (
          <Button
            className="w-full"
            variant={"ghost"}
            onClick={() => fetchNextPage()}
          >
            See More <ChevronDown />
          </Button>
        )}
        {!hasNextPage && reviews.length === 0 && (
          <div className="w-full h-full flex justify-center items-center text-sm text-muted-foreground">
            No reviews so far...
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RecentReviews;
