import CreateFolderForm from "@/components/forms/CreateFolderForm";
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

const CreateFolderButton = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant={"outline"}>
          <Plus />
          Create Folder
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Hammer size={20} />
            Create Folder
          </DialogTitle>
          <DialogDescription>
            Folders contains decks , which contains flash cards !
          </DialogDescription>
        </DialogHeader>
        <CreateFolderForm />
      </DialogContent>
    </Dialog>
  );
};

export default CreateFolderButton;
