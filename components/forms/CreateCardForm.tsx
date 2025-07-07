"use client";
import { useLocalStorage } from "@mantine/hooks";
import React, { useState, useTransition } from "react";
import TextEditor from "../text-editor/TextEditor";
import { Separator } from "../ui/separator";
import { useSearchParams } from "next/navigation";
import { Button } from "../ui/button";
import { ChevronLeft, Gem, Sparkles } from "lucide-react";
import Link from "next/link";
import { showErrorToast, showSuccessToast } from "@/lib/toast";
import { createCard } from "@/server/db/cards";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import PDFDropzone from "../PDFDropzone";
import { useQueryClient } from "@tanstack/react-query";
import { addCardsToPaginatedCache } from "@/lib/utils";

const CreateCardForm = () => {
  const searchParams = useSearchParams();
  const [front, setFront] = useLocalStorage({
    key: `front_${searchParams.get("deckId")}`,
    defaultValue: "",
  });
  const [back, setBack] = useLocalStorage({
    key: `back_${searchParams.get("deckId")}`,
    defaultValue: "",
  });
  const [isPending, setIsPending] = useState(false);

  const queryClient = useQueryClient();
  return (
    <div className="max-w-[900px] w-full space-y-4">
      <div className="flex items-center gap-2">
        <Button size={"icon"} asChild>
          <Link href={`/decks/${searchParams.get("deckId")}`}>
            <ChevronLeft />
          </Link>
        </Button>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant={"outline"}>
              <Sparkles />
              Generate from PDF
            </Button>
          </DialogTrigger>
          <DialogContent className="overflow-hidden">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-3">
                <Sparkles size={18} />
                AI PDF Generation {"("}{" "}
                <span className="flex items-center px-1 gap-2">
                  1 <Gem size={15} />
                </span>
                {")"}
              </DialogTitle>
              <DialogDescription>
                Leverage AI to generate cards for you
              </DialogDescription>
            </DialogHeader>
            <PDFDropzone deckId={searchParams.get("deckId")! ?? ""} />
          </DialogContent>
        </Dialog>
      </div>

      <TextEditor
        content={front}
        onChange={setFront}
        placeholder="Enter your front text.."
      />
      <Separator />
      <TextEditor
        content={back}
        onChange={setBack}
        placeholder="Enter your back text.."
      />
      <Button
        className="w-full"
        disabled={isPending}
        size={"lg"}
        onClick={() => {
          if (!front || !back) {
            showErrorToast("Both Front and Back must be filled ");
          } else {
            setIsPending(true);
            createCard(searchParams.get("deckId")!, [{ front, back }]).then(
              (data) => {
                if (!data) {
                  showErrorToast();
                } else {
                  const baseKey = ["cards", data.userId, data.deckId];
                  const variations = [
                    [...baseKey, null, null],
                    [...baseKey, data.isAi ? "ai" : "human", null],
                    [...baseKey, data.isAi ? "ai" : "human", "asc"],

                    [...baseKey, null, "asc"],
                  ];

                  for (const key of variations) {
                    addCardsToPaginatedCache(queryClient, key, [data]);
                  }
                  showSuccessToast();
                  setFront("");
                  setBack("");
                }
                setIsPending(false);
              }
            );
          }
        }}
      >
        Create Card
      </Button>
    </div>
  );
};

export default CreateCardForm;
