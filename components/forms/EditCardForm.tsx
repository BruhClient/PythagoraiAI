import React, { useState, useTransition } from "react";
import TextEditor from "../text-editor/TextEditor";
import { Button } from "../ui/button";
import { Redo, Undo } from "lucide-react";
import { updateCard } from "@/server/db/cards";
import { showErrorToast, showSuccessToast } from "@/lib/toast";
import { useQueryClient } from "@tanstack/react-query";
import { updateCardFromPaginatedCache } from "@/lib/utils";

const EditCardForm = ({
  id,
  front,
  back,
  userId,
  deckId,
  isAi,
}: {
  front: string;
  back: string;
  id: string;
  userId: string;
  deckId: string;
  isAi: boolean;
}) => {
  const [flipped, setFlipped] = useState(false);
  const [updatedFront, setUpdatedFront] = useState(front);
  const [updatedBack, setUpdatedBack] = useState(back);
  const queryClient = useQueryClient();

  const editCard = () => {
    if (!front || !back) {
      showErrorToast("Both Front and Back must be filled");
      return;
    }

    if (flipped) {
      const baseKey = ["cards", userId, deckId];
      const variations = [
        [...baseKey, null, null],
        [...baseKey, isAi ? "ai" : "human", null],
        [...baseKey, isAi ? "ai" : "human", "asc"],

        [...baseKey, null, "asc"],
      ];

      for (const key of variations) {
        updateCardFromPaginatedCache(queryClient, key, {
          id,
          back: updatedBack,
        });
      }
      showSuccessToast();
      updateCard(id, { back: updatedBack }).then((data) => {
        if (!data) {
          showErrorToast();
        }
      });
    } else {
      const baseKey = ["cards", userId, deckId];
      const variations = [
        [...baseKey, null, null],
        [...baseKey, isAi ? "ai" : "human", null],
        [...baseKey, isAi ? "ai" : "human", "asc"],

        [...baseKey, null, "asc"],
      ];

      for (const key of variations) {
        updateCardFromPaginatedCache(queryClient, key, {
          id,
          front: updatedFront,
        });
      }
      showSuccessToast();

      updateCard(id, { front: updatedFront }).then((data) => {
        if (!data) {
          showErrorToast();
        }
      });
    }
  };
  return (
    <div className="space-y-3">
      <Button
        className="w-full"
        variant={"ghost"}
        onClick={() => setFlipped((prev) => !prev)}
      >
        {flipped ? (
          <>
            <Undo />
            Flip to Front
          </>
        ) : (
          <>
            <Redo />
            Flip to Back
          </>
        )}
      </Button>
      <TextEditor
        content={flipped ? updatedBack : updatedFront}
        onChange={flipped ? setUpdatedBack : setUpdatedFront}
        placeholder="Enter Text"
      />
      <Button className="w-full" onClick={editCard}>
        Save Changes
      </Button>
    </div>
  );
};

export default EditCardForm;
