"use client";
import React from "react";
import { Card, CardContent, CardDescription, CardTitle } from "../ui/card";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import { TbCards } from "react-icons/tb";
import { BsCardText } from "react-icons/bs";
const FolderCard = ({
  title,
  createdAt,
  color,
  id,
  deckCount,
  cardCount,
}: {
  title: string;
  createdAt: number | Date;
  color: string;
  id: string;
  deckCount: number;
  cardCount: number;
}) => {
  const router = useRouter();
  return (
    <Card
      className="border-black relative overflow-hidden hover:bg-muted cursor-pointer transition-colors ease-in-out duration-200"
      onClick={() => {
        router.push(`/folders/${id}`);
      }}
    >
      <CardContent className="flex justify-between">
        <div className="flex justify-between items-start gap-1 pb-5 w-full">
          <div className="space-y-1">
            <CardTitle className="break-all line-clamp-3">{title}</CardTitle>

            <CardDescription>
              {format(createdAt, "dd MMM yyyy")}
            </CardDescription>
          </div>

          <div className="flex gap-2">
            <div className="flex items-center text-muted-foreground gap-1 text-xs">
              {deckCount} <TbCards />
            </div>
            <div className="flex items-center text-muted-foreground gap-1 text-xs ">
              {cardCount} <BsCardText />
            </div>
          </div>
        </div>
      </CardContent>
      <div
        className="w-full h-5 absolute bottom-0"
        //@ts-ignore
        style={{ background: color }}
      />
    </Card>
  );
};

export default FolderCard;
