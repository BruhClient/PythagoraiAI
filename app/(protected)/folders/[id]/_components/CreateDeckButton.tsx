import CreateDeckForm from "@/components/forms/CreateDeckForm";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Hammer, Plus } from "lucide-react";
import React from "react";

const CreateDeckButton = ({ folderId }: { folderId: string }) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant={"outline"}>
          <Plus />
          Create Deck
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Hammer size={20} />
            Create Deck
          </DialogTitle>
          <DialogDescription>
            Folders contains decks , which contains flash cards !
          </DialogDescription>
        </DialogHeader>
        <CreateDeckForm folderId={folderId} />
      </DialogContent>
    </Dialog>
  );
};

export default CreateDeckButton;
