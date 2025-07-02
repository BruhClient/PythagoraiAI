"use client";
import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import UserAvatar from "./UserAvatar";
import { Rating } from "./Ratings";
import Masonry from "react-masonry-css";
import { reviewBreakpointColumnsObj } from "@/data/constants";
const reviews = [
  {
    name: "Alice T.",
    rating: 5,
    comment:
      "This app saved me hours of study time! I just uploaded my lecture PDF and had instant flashcards. Super clean interface too.",
  },
  {
    name: "Brian K.",
    rating: 4,
    comment:
      "Great tool for revision. The AI-generated cards were surprisingly accurate. Some minor tweaks needed, but overall solid.",
  },
  {
    name: "Charlotte M.",
    rating: 5,
    comment:
      "PDF to flashcards in under a minute? Yes please. This is a must-have for students who procrastinate (like me).",
  },
  {
    name: "Daniel F.",
    rating: 3,
    comment:
      "It works well, but the flashcards could be more customizable. Still better than making them manually.",
  },
  {
    name: "Ella J.",
    rating: 5,
    comment:
      "Absolutely love it! The PDF parsing is scarily good. I even used it on a scanned book chapter and it worked.",
  },
  {
    name: "Felix N.",
    rating: 4,
    comment:
      "Slick design, fast performance, and exports to PDF. Would be perfect if it had spaced repetition built in.",
  },
  {
    name: "Grace W.",
    rating: 5,
    comment:
      "This is my new secret weapon for exams. I’ve recommended it to everyone in my study group.",
  },
  {
    name: "Harvey C.",
    rating: 2,
    comment:
      "Not bad, but didn’t handle my handwritten notes well. Would be awesome with OCR support.",
  },
  {
    name: "Isla P.",
    rating: 5,
    comment:
      "Flashcards look beautiful and are actually relevant to the content. The AI gets the context right most of the time.",
  },
];

const Reviews = () => {
  return (
    <div
      className="w-full justify-center flex flex-col items-center gap-5"
      id="reviews"
    >
      <div className="text-center space-y-1">
        <div className="text-3xl font-bold">Reviews</div>
        <div className="flex items-center gap-1 text-muted-foreground">
          Simple to understand . Simple to use . We make AI aid your learning ,
          not take over it .
        </div>
      </div>

      <Masonry
        breakpointCols={reviewBreakpointColumnsObj}
        className="my-masonry-grid max-w-[1200px]"
        columnClassName="my-masonry-grid_column"
      >
        {reviews.map((review) => {
          return (
            <Card key={review.name}>
              <CardHeader>
                <div className="flex gap-2 items-center">
                  <UserAvatar imageUrl="/default.png" />
                  <div className="space-y-1">
                    <CardTitle>{review.name}</CardTitle>
                    <CardDescription>
                      <Rating value={review.rating} readOnly />
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>{review.comment}</CardContent>
            </Card>
          );
        })}
      </Masonry>
    </div>
  );
};

export default Reviews;
