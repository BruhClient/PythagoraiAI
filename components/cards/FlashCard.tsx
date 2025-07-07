"use client";
import React, { useState, useTransition } from "react";
import { Card, CardContent, CardDescription } from "../ui/card";
import { Separator } from "../ui/separator";
import TextRenderer from "../text-editor/TextRenderer";
import { format } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import ActionButton from "../buttons/ActionButton";
import { Button } from "../ui/button";
import { Bot, Edit, Hammer, Redo, Trash, Undo } from "lucide-react";
import { deleteCard } from "@/server/db/cards";
import { showErrorToast, showSuccessToast } from "@/lib/toast";
import { useQueryClient } from "@tanstack/react-query";
import EditCardForm from "../forms/EditCardForm";
import { MasteryBar } from "../MasteryBar";
import { removeCardFromPaginatedCache } from "@/lib/utils";

const FlashCard = ({
  front,
  back,
  userId,
  deckId,
  isAi,
  id,
  createdAt,
  mastery,
}: {
  front: string;
  back: string;

  id: string;
  userId: string;
  deckId: string;
  isAi: boolean;
  createdAt: Date;
  mastery: number;
}) => {
  const queryClient = useQueryClient();
  const [flipped, setFlipped] = useState(false);
  return (
    <Card>
      <CardContent className="space-y-2">
        <div className="flex justify-between items-center ">
          <CardDescription>{format(createdAt, "dd MMM yyyy")}</CardDescription>
          {isAi && (
            <div className=" bg-primary p-2  rounded-full">
              <Bot size={13} className="text-black" />
            </div>
          )}
        </div>
        <div className="py-2">
          <MasteryBar mastery={mastery} />
        </div>

        <TextRenderer html={flipped ? back : front} />

        <Separator />

        <div className="w-full justify-between flex gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant={"outline"} size={"icon"}>
                <Edit />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Hammer size={20} />
                  Edit Card
                </DialogTitle>
                <DialogDescription>
                  View both front and back sides !
                </DialogDescription>
              </DialogHeader>

              <EditCardForm
                front={front}
                back={back}
                id={id}
                deckId={deckId}
                userId={userId}
                isAi={isAi}
              />
            </DialogContent>
          </Dialog>

          <Button
            className="flex-1"
            variant={"ghost"}
            onClick={() => setFlipped((prev) => !prev)}
          >
            {flipped ? <Undo /> : <Redo />}
          </Button>
          <ActionButton
            actionLabel="Delete Card"
            dialogTitle="Are you sure?"
            dialogDescription="This will permanently delete the folder and all decks/cards inside it."
            onConfirm={() => {
              const baseKey = ["cards", userId, deckId];
              const variations = [
                [...baseKey, null, null],
                [...baseKey, isAi ? "ai" : "human", null],
                [...baseKey, isAi ? "ai" : "human", "asc"],

                [...baseKey, null, "asc"],
              ];

              for (const key of variations) {
                removeCardFromPaginatedCache(queryClient, key, id);
              }

              deleteCard(id).then((data) => {
                if (!data) {
                  showErrorToast();
                }
              });
            }}
            variant="destructive"
          >
            <Button size={"icon"} variant={"outline"}>
              <Trash />
            </Button>
          </ActionButton>
        </div>
      </CardContent>
    </Card>
  );
};

export default FlashCard;
