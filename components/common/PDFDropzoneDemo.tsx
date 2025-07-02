"use client";

import { useDropzone } from "react-dropzone";
import { Slider } from "../ui/slider";
import { Button } from "../ui/button";
import { Bot, FileText } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
const PDFDropzoneDemo = () => {
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
  const [input, setInput] = useState<number[]>([50]);

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
          <input {...getInputProps()} />
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
          <Button className="w-full">
            <Bot />
            Create Flash Cards
          </Button>
        )}
      </div>
    </div>
  );
};

export default PDFDropzoneDemo;
