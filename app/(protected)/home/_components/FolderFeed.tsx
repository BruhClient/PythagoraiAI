"use client";
import { useFolders } from "@/hooks/use-folders";
import React from "react";
import { ChevronDown } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { TbCards } from "react-icons/tb";
import { BsCardText } from "react-icons/bs";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
const FolderFeed = () => {
  const { folders, fetchNextPage, hasNextPage, isFetching } = useFolders();
  const router = useRouter();
  return (
    <Card>
      <CardHeader>
        <CardTitle>Folders</CardTitle>
        <CardDescription>
          Folders contain decks which contains cards !
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3 h-[350px] overflow-y-auto">
        {folders.map(({ id, title, cardCount, deckCount }) => {
          return (
            <div
              key={id}
              className="hover:bg-muted p-2 cursor-pointer transition-colors ease-in-out rounded-lg space-y-1"
              onClick={() => router.push(`/folders/${id}`)}
            >
              <div className="line-clamp-2">{title}</div>

              <div className="flex gap-2">
                <div className="flex items-center text-muted-foreground gap-1 text-xs">
                  {deckCount} <TbCards />
                </div>
                <div className="flex items-center text-muted-foreground gap-1 text-xs ">
                  {cardCount} <BsCardText />
                </div>
              </div>
            </div>
          );
        })}
        {hasNextPage && !isFetching && (
          <Button
            variant={"ghost"}
            className="w-full"
            onClick={() => fetchNextPage()}
          >
            View more
            <ChevronDown size={15} />
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default FolderFeed;
