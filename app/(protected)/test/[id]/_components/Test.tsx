"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState, useTransition } from "react";
import { reviewCards } from "@/server/actions/review";
import { showErrorToast } from "@/lib/toast";
import { ChartReviewQuality } from "@/components/charts/ChartReviewQuality";
import TextRenderer from "@/components/text-editor/TextRenderer";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card";
import { qualityIndicators } from "@/data/constants";
import { MasteryBar } from "@/components/MasteryBar";
import { ChevronLeft, RotateCcw, Redo, Undo, Bot } from "lucide-react";
import Link from "next/link";
import {
  transformRawScoresToChart,
  updateCardFromPaginatedCache,
} from "@/lib/utils";
import { format } from "date-fns";
import { createReview } from "@/server/db/review";

const Test = ({
  deckId,
  testType,
  maxCards,
}: {
  deckId: string;
  testType: string;
  maxCards: number;
}) => {
  const queryClient = useQueryClient();
  const [index, setIndex] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [flipped, setFlipped] = useState(false);
  const [isPending, startTransition] = useTransition();

  const { data: questions = [], isFetching } = useQuery({
    queryKey: ["test", deckId, testType, maxCards],
    queryFn: async () => {
      const res = await fetch(
        `/api/test/query?deckId=${deckId}&type=${testType}&max=${maxCards}`
      );
      if (!res.ok) throw new Error("Failed to fetch questions");
      return res.json();
    },
    enabled: !!deckId && !!testType && !!maxCards,
    staleTime: 0,
  });

  const [qualities, setQualities] = useState<number[]>([]);

  const card = questions[index];

  if (isFetching || !card) {
    return (
      <div className="flex items-center justify-center h-[85vh] text-muted-foreground">
        loading...
      </div>
    );
  }

  if (isFinished) {
    return (
      <div className="flex justify-center flex-col items-center gap-3 h-[85vh] py-3">
        <div className="text-center space-y-2">
          <div className="text-4xl font-bold">Well done! 🎉</div>
          <div className="text-muted-foreground">Test completed</div>
        </div>
        <div className="max-w-[800px] w-full">
          <ChartReviewQuality
            reviewData={transformRawScoresToChart(qualities)}
          />
        </div>
        <div className="flex items-center gap-3">
          <Button asChild>
            <Link href={`/decks/${deckId}`}>
              <ChevronLeft />
              Back to Deck
            </Link>
          </Button>
          <Button
            variant="outline"
            disabled={isPending}
            onClick={() => {
              setIndex(0);
              setIsFinished(false);
              setFlipped(false);
              setQualities([]);
            }}
          >
            <RotateCcw /> Retake Test
          </Button>
        </div>
      </div>
    );
  }

  const handleReview = (quality: number) => {
    setQualities((prev) => [...prev, quality]);

    reviewCards({
      cardIds: [questions[index].id],
      qualities: [quality],
    }).then((data) => {
      if (!data) {
        showErrorToast();
      } else {
        const baseKey = ["cards", data.userId, deckId];

        const variations = [
          [...baseKey, null, null],
          [...baseKey, "human", null],
          [...baseKey, "human", "asc"],
          [...baseKey, "ai", null],
          [...baseKey, "ai", "asc"],

          [...baseKey, null, "asc"],
        ];

        for (const key of variations) {
          for (let card of data.cards) {
            console.log(card);
            updateCardFromPaginatedCache(queryClient, key, {
              id: card!.id,
              mastery: card!.mastery,
            });
          }
        }
      }
    });
    if (index >= questions.length - 1) {
      createReview(
        transformRawScoresToChart([...qualities, quality]),
        deckId,
        maxCards
      ).then((data) => {
        if (!data) {
          showErrorToast();
        } else {
          queryClient.setQueriesData(
            { queryKey: ["reviews", data.userId, data.deckId] },
            (oldData: any) => {
              if (!oldData) {
                return oldData;
              }

              return {
                ...oldData,
                pages: [
                  {
                    ...oldData.pages[0],
                    reviews: [data, ...oldData.pages[0].reviews],
                  },
                  ...oldData.pages.slice(1),
                ],
              };
            }
          );
        }
      });

      setIsFinished(true);
    } else {
      setIndex((prev) => prev + 1);
      setFlipped(false);
    }
  };

  return (
    <div className="flex w-full justify-center items-center h-[70vh] flex-col gap-3">
      <div>
        {index + 1} / {questions.length}
      </div>
      <div className="border-2 w-full max-w-[500px] rounded-lg h-3">
        <div
          className="bg-primary h-full transition-all duration-300"
          style={{ width: `${((index + 1) / questions.length) * 100}%` }}
        />
      </div>

      <Card className="max-w-[800px] w-full">
        {flipped && (
          <div className="px-5">
            <MasteryBar mastery={card.mastery} />
          </div>
        )}
        <CardHeader>
          <div className="flex justify-between w-full">
            <CardDescription>
              {format(card.createdAt, "dd MMM yyyy")}
            </CardDescription>
            {card.isAi && (
              <div className="bg-primary w-fit h-fit p-2 rounded-full">
                <Bot size={13} />
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <TextRenderer html={flipped ? card.back : card.front} />
        </CardContent>
      </Card>

      {flipped ? (
        <div className="w-full max-w-[800px] space-y-3">
          <div className="flex w-full gap-2 flex-wrap">
            {qualityIndicators.map(({ name, quality, icon }) => (
              <Button
                variant="outline"
                className="flex-1"
                key={name}
                onClick={() => handleReview(quality)}
              >
                {icon} {name}
              </Button>
            ))}
          </div>
          <Button
            className="w-full"
            variant="ghost"
            onClick={() => setFlipped(false)}
          >
            <Undo /> Back to Front
          </Button>
        </div>
      ) : (
        <Button
          className="w-full max-w-[800px]"
          variant="outline"
          onClick={() => setFlipped(true)}
        >
          <Redo /> Flip Card
        </Button>
      )}
    </div>
  );
};

export default Test;
