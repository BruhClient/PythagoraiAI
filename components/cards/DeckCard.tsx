"use client";

import { icons } from "@/data/constants";
import { LucideIcon } from "lucide-react";
import React from "react";
import { Card, CardContent, CardDescription } from "../ui/card";
import { format } from "date-fns";
import { BsCardText } from "react-icons/bs";
import { useRouter } from "next/navigation";

const DeckCard = ({
  id,
  icon,
  title,
  createdAt,
  color,
  cardCount,
  folderName,
  demo = false,
}: {
  id: string;
  icon: string;
  title: string;
  createdAt: string;
  color: string;
  cardCount: number;
  folderName?: string;
  demo?: boolean;
}) => {
  //@ts-ignore
  const Icon = icons[icon] as LucideIcon;
  const router = useRouter();
  return (
    <Card
      className="border-black  pt-0 overflow-hidden hover:bg-muted transition-colors ease-in-out duration-200 cursor-pointer"
      onClick={() => {
        if (!demo) {
          router.push(`/decks/${id}`);
        }
      }}
    >
      <div
        style={{
          backgroundColor: color,
        }}
        className="w-full h-[200px] flex justify-center items-center"
      >
        <Icon size={50} />
      </div>
      <CardContent>
        <div className="flex flex-col gap-1 w-full">
          <div className="flex justify-between items-start">
            <div className="font-semibold">{title}</div>
            <div className="flex items-center text-muted-foreground gap-2">
              {cardCount} <BsCardText />
            </div>
          </div>

          <CardDescription>{format(createdAt, "dd MMM yyyy")}</CardDescription>
          {folderName && (
            <div className="text-muted-foreground text-xs">
              Folder name : {folderName}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default DeckCard;
