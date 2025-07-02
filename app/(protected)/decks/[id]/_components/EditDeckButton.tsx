"use client";

import React, { useTransition } from "react";
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
import ActionButton from "@/components/buttons/ActionButton";
import { showErrorToast, showSuccessToast } from "@/lib/toast";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { deleteDeck } from "@/server/db/decks";
import UpdateDeckForm from "@/components/forms/UpdateDeckForm";
const EditDeckButton = ({
  id,
  title,
  color,
  icon,
}: {
  id: string;
  title: string;
  color: string;
  icon: string;
}) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
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
                Update Deck
              </DialogTitle>
              <DialogDescription>
                Folders contains decks , which contains flash cards !
              </DialogDescription>
            </DialogHeader>
            <UpdateDeckForm id={id} title={title} color={color} icon={icon} />
          </DialogContent>
        </Dialog>
        <ActionButton
          actionLabel="Delete Folder"
          dialogTitle="Are you sure?"
          dialogDescription="This will permanently delete the folder and all decks/cards inside it."
          variant="destructive"
          onConfirm={() => {
            startTransition(() => {
              deleteDeck(id).then((data) => {
                if (!data) {
                  showErrorToast();
                } else {
                  queryClient.setQueryData(
                    ["most practiced", data.userId],
                    (oldData: any[]) => {
                      return oldData.filter((deck) => deck.id !== data.id);
                    }
                  );
                  queryClient.setQueryData(
                    ["decks", data.userId, data.folderId],
                    (oldData: any) => {
                      if (!oldData) {
                        return oldData;
                      }

                      return {
                        ...oldData,
                        pages: oldData.pages.map((page: any) => ({
                          ...page,
                          decks: page.decks.filter(
                            (item: any) => item.id !== id
                          ),
                        })),
                      };
                    }
                  );

                  showSuccessToast();
                  router.push(`/folders/${data.folderId}`);
                }
              });
            });
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

export default EditDeckButton;
