"use client";

import React, { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { showErrorToast, showSuccessToast } from "@/lib/toast";
import {
  CreateFolderPayload,
  CreateFolderSchema,
} from "@/schemas/create-folder";
import { colors } from "@/data/constants";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardDescription } from "../ui/card";
import { format } from "date-fns";

import TextareaAutosize from "react-textarea-autosize";
import { createFolder } from "@/server/db/folders";
import { useQueryClient } from "@tanstack/react-query";
import { canCreateFolder } from "@/server/actions/permission";

const CreateFolderForm = () => {
  const form = useForm<CreateFolderPayload>({
    resolver: zodResolver(CreateFolderSchema),
    defaultValues: {
      title: "",
      color: Object.keys(colors)[0],
    },
  });

  const queryClient = useQueryClient();
  const [isPending, setIsPending] = useState(false);
  const onSubmit = async (values: CreateFolderPayload) => {
    setIsPending(true);
    const permission = await canCreateFolder();

    if (!permission) {
      showErrorToast("Total folders must not exceed 20");
      setIsPending(false);
    } else {
      await createFolder(values).then((data) => {
        if (!data) {
          showErrorToast();
        } else {
          showSuccessToast();

          queryClient.setQueryData(["folders", data.userId], (oldData: any) => {
            if (!oldData) {
              return {
                pages: [{ folders: [data], nextCursor: null }],
                pageParams: [null],
              };
            }

            return {
              ...oldData,
              pages: [
                {
                  ...oldData.pages[0],
                  folders: [
                    {
                      ...data,
                      cardCount: 0,
                      deckCount: 0,
                    },
                    ...oldData.pages[0].folders,
                  ],
                },
                ...oldData.pages.slice(1),
              ],
            };
          });
          form.reset();
        }
        setIsPending(false);
      });
    }
  };

  return (
    <div className="space-y-3">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem className="space-y-1">
                <FormControl>
                  <Card className="border-black relative overflow-hidden ">
                    <CardContent>
                      <div className="flex justify-between gap-2 items-start min-h-[100px] pb-2">
                        <div className="flex flex-col gap-1 w-full">
                          <TextareaAutosize
                            {...field}
                            maxRows={5}
                            className="w-full text-lg font-semibold border-none shadow-none hover:border-none hover:shadow-none hover:outline-none outline-none max-h-[100px]"
                            placeholder="Title"
                          />
                          <CardDescription>
                            {format(Date.now(), "dd MMM yyyy")}
                          </CardDescription>
                        </div>
                      </div>
                    </CardContent>
                    <div
                      className="w-full h-5 absolute bottom-0"
                      //@ts-ignore
                      style={{ background: colors[form.watch("color")] }}
                    />
                  </Card>
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="color"
            render={({ field }) => (
              <FormItem className="space-y-1">
                <FormControl>
                  <div className="flex gap-2 flex-wrap">
                    {Object.keys(colors).map((color) => {
                      return (
                        <Button
                          key={color}
                          onClick={() => field.onChange(color)}
                          variant={"outline"}
                          type="button"
                          //@ts-ignore
                          style={{ backgroundColor: colors[color] }}
                          className={cn(
                            "rounded-full cursor-pointer",
                            field.value === color && "border-2 border-black"
                          )}
                        ></Button>
                      );
                    })}
                  </div>
                </FormControl>
              </FormItem>
            )}
          />

          <Button className="w-full" size={"lg"} disabled={isPending}>
            Create Folder
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default CreateFolderForm;
