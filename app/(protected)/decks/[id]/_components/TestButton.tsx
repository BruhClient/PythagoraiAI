"use client";

import CreateTestForm from "@/components/forms/CreateTestForm";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { BookOpen } from "lucide-react";
import React from "react";

const TestButton = ({
  deckId,
  cardCount,
}: {
  deckId: string;
  cardCount: string;
}) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <BookOpen />
          Start Test
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Test Options</DialogTitle>
        </DialogHeader>
        <CreateTestForm maxCards={cardCount} deckId={deckId} />
      </DialogContent>
    </Dialog>
  );
};

export default TestButton;
