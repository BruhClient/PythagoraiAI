"use client";

import { useDropzone } from "react-dropzone";
import { useEffect, useState, useTransition } from "react";
import { addCardsToPaginatedCache, cn } from "@/lib/utils";
import { Bot, FileText } from "lucide-react";
import { Button } from "./ui/button";
import { useUploadThing } from "@/lib/uploadthing";
import {
  showErrorToast,
  showLoadingToast,
  showSuccessToast,
} from "@/lib/toast";
import { deleteFileFromUploadthing } from "@/server/actions/uploadthing";
import { addAiCards, generateFlashcards } from "@/server/actions/openai";
import { useQueryClient } from "@tanstack/react-query";
import FeedLoader from "./FeedLoader";
import { canCreateGeneration } from "@/server/actions/permission";
import { Slider } from "./ui/slider";
import { toast } from "sonner";

const PDFDropzone = ({ deckId }: { deckId: string }) => {
  const [file, setFile] = useState<File | null>(null);

  const onDrop = (acceptedFiles: File[]) => {
    const pdfFile = acceptedFiles[0];
    if (pdfFile) {
      setFile(pdfFile);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "application/pdf": [] },
    multiple: false,
    maxFiles: 1,
  });
  const { startUpload } = useUploadThing("pdfUploader");
  const [isPending, setIsPending] = useState(false);

  const [input, setInput] = useState<number[]>([50]);
  const queryClient = useQueryClient();
  const createCards = async () => {
    let fileKey: string | null = null;
    const toastId = showLoadingToast("Generating Cards");
    try {
      // Upload File

      setIsPending(true);
      const data = await canCreateGeneration(deckId);
      if (!data.permission) {
        throw Error(data.reason);
      }
      const res = await startUpload([file!]);

      if (!res) {
        throw Error("Faild to upload file");
      }
      const { ufsUrl, key } = res[0];
      fileKey = key;
      localStorage.setItem(`pdf_key_${key}`, key);

      // Extract PDF Text

      const resp = await fetch("/api/pdf/extract", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: ufsUrl }),
      });

      const extracted = await resp.json();

      if (!extracted) {
        throw Error("Failed to extract PDF Text");
      }

      // Generate Flash Cards

      const cards = await generateFlashcards(
        deckId,
        extracted.text,
        ufsUrl,
        input[0]
      );

      if (!cards) {
        throw Error("Failed to generate cards");
      }

      const updatedCards = await addAiCards(cards, deckId);

      if (!updatedCards) {
        throw Error("Could not add cards to database");
      }

      const { userId } = cards[0];
      const baseKey = ["cards", userId, deckId];
      const variations = [
        [...baseKey, null, null],
        [...baseKey, "ai", null],
        [...baseKey, "ai", "asc"],

        [...baseKey, null, "asc"],
      ];
      for (const key of variations) {
        addCardsToPaginatedCache(queryClient, key, updatedCards);
      }

      showSuccessToast("Cards Created");
    } catch (error: any) {
      if (fileKey) {
        deleteFileFromUploadthing(fileKey).then(() => {
          localStorage.removeItem("pdfKey");
        });
      }

      showErrorToast(error.message);
    } finally {
      setFile(null);
      setIsPending(false);

      toast.dismiss(toastId);
    }
  };

  useEffect(() => {
    const previous_key = localStorage.getItem("pdfKey");

    const deleteFileKey = async (previous_key: string) => {
      await deleteFileFromUploadthing(previous_key).then(() => {
        localStorage.removeItem("pdfKey");
      });
    };
    if (previous_key) {
      deleteFileKey(previous_key);
    }
  }, []);

  return (
    <div className="space-y-4">
      <div className="space-y-3">
        <div className="text-xs">Number of Cards : {input[0]}</div>
        <Slider
          max={100}
          step={1}
          min={10}
          value={input}
          className="max-w-[500px]"
          onValueChange={(value) => setInput(value)}
        />
      </div>

      <div className="w-full max-w-md space-y-4">
        <div
          {...getRootProps()}
          className={cn(
            "border border-input bg-background rounded-md p-6 text-center transition-colors",
            "hover:bg-muted/50 cursor-pointer",
            isDragActive && "border-primary bg-muted"
          )}
        >
          <input {...getInputProps()} disabled={isPending} />
          <p className="text-sm text-muted-foreground">
            {isDragActive
              ? "Drop your PDF file here..."
              : "Click or drag a PDF file to upload"}
          </p>
        </div>

        {file && (
          <div className="flex items-center gap-2 text-sm text-foreground bg-muted rounded-md px-4 py-2">
            <FileText className="h-4 w-4 text-primary" />
            <span>{file.name}</span>
            <span className="ml-auto text-muted-foreground">
              {(file.size / 1024).toFixed(1)} KB
            </span>
          </div>
        )}
        {file && (
          <Button className="w-full" onClick={createCards} disabled={isPending}>
            <Bot />
            Create Flash Cards
          </Button>
        )}
      </div>
    </div>
  );
};

export default PDFDropzone;
