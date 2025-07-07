"use client";

import React, { useState, useTransition } from "react";
import { Ellipsis, Hammer } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import UpdateFolderForm from "@/components/forms/UpdateFolderForm";
import ActionButton from "@/components/buttons/ActionButton";
import { deleteFolder } from "@/server/db/folders";
import { showErrorToast, showSuccessToast } from "@/lib/toast";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
const EditFolderButton = ({
  id,
  title,
  color,
}: {
  id: string;
  title: string;
  color: string;
}) => {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);
  const queryClient = useQueryClient();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size={"icon"} variant={"ghost"}>
          <Ellipsis />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <Dialog>
          <DialogTrigger asChild>
            <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
              Update
            </DropdownMenuItem>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Hammer size={20} />
                Update Folder
              </DialogTitle>
              <DialogDescription>
                Folders contains decks , which contains flash cards !
              </DialogDescription>
            </DialogHeader>
            <UpdateFolderForm id={id} title={title} color={color} />
          </DialogContent>
        </Dialog>
        <ActionButton
          actionLabel="Delete Folder"
          dialogTitle="Are you sure?"
          dialogDescription="This will permanently delete the folder and all decks/cards inside it."
          variant="destructive"
          onConfirm={() => {
            setIsPending(true);
            deleteFolder(id).then((data) => {
              if (!data) {
                showErrorToast();
              } else {
                queryClient.setQueryData(
                  ["folders", data.userId],
                  (oldData: any) => {
                    if (!oldData) {
                      return oldData;
                    }

                    return {
                      ...oldData,
                      pages: oldData.pages.map((page: any) => ({
                        ...page,
                        folders: page.folders.filter(
                          (item: any) => item.id !== id
                        ),
                      })),
                    };
                  }
                );

                showSuccessToast();
                router.push("/folders");
              }
            });
            setIsPending(false);
          }}
        >
          <DropdownMenuItem
            variant="destructive"
            onSelect={(e) => {
              e.preventDefault();
            }}
          >
            Delete
          </DropdownMenuItem>
        </ActionButton>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default EditFolderButton;
