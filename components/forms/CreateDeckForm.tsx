"use client";

import React, { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { LucideIcon } from "lucide-react";
import { showErrorToast, showSuccessToast } from "@/lib/toast";
import { colors, icons } from "@/data/constants";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardDescription } from "../ui/card";
import { format } from "date-fns";

import TextareaAutosize from "react-textarea-autosize";
import { useQueryClient } from "@tanstack/react-query";
import { CreateDeckPayload, CreateDeckSchema } from "@/schemas/create-deck";
import { createDeck } from "@/server/db/decks";
import { canCreateDeck } from "@/server/actions/permission";

const CreateDeckForm = ({ folderId }: { folderId: string }) => {
  const form = useForm<CreateDeckPayload>({
    resolver: zodResolver(CreateDeckSchema),
    defaultValues: {
      title: "",
      color: Object.keys(colors)[0],
      icon: Object.keys(icons)[0],
    },
  });

  const queryClient = useQueryClient();
  const [isPending, setIsPending] = useState(false);
  const onSubmit = async (values: CreateDeckPayload) => {
    setIsPending(true);
    const permission = await canCreateDeck(folderId);

    if (!permission) {
      showErrorToast("Folder can only contain a maximum of 20 decks");
      setIsPending(false);
    } else {
      await createDeck(folderId, values).then((data) => {
        if (!data) {
          showErrorToast();
        } else {
          showSuccessToast();

          queryClient.setQueryData(
            ["decks", data.userId, folderId],
            (oldData: any) => {
              if (!oldData) {
                return {
                  pages: [{ decks: [data], nextCursor: null }],
                  pageParams: [null],
                };
              }

              return {
                ...oldData,
                pages: [
                  {
                    ...oldData.pages[0],
                    decks: [
                      {
                        ...data,
                        cardCount: 0,
                      },
                      ...oldData.pages[0].decks,
                    ],
                  },
                  ...oldData.pages.slice(1),
                ],
              };
            }
          );
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
            render={({ field }) => {
              //@ts-ignore
              const Icon = icons[form.watch("icon")] as LucideIcon;
              return (
                <FormItem>
                  <FormControl>
                    <Card className="border-black   pt-0 overflow-hidden">
                      <div
                        style={{
                          //@ts-ignore
                          backgroundColor: colors[form.watch("color")],
                        }}
                        className="w-full h-[200px] flex justify-center items-center"
                      >
                        <Icon size={50} />
                      </div>
                      <CardContent>
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
                      </CardContent>
                    </Card>
                  </FormControl>
                </FormItem>
              );
            }}
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

          <FormField
            control={form.control}
            name="icon"
            render={({ field }) => (
              <FormItem className="space-y-1">
                <FormControl>
                  <div className="flex gap-2 flex-wrap">
                    {Object.keys(icons).map((icon) => {
                      //@ts-ignore
                      const Icon = icons[icon] as LucideIcon;
                      return (
                        <Button
                          key={icon}
                          onClick={() => field.onChange(icon)}
                          variant={field.value === icon ? "default" : "outline"}
                          type="button"
                          size={"icon"}
                        >
                          <Icon />
                        </Button>
                      );
                    })}
                  </div>
                </FormControl>
              </FormItem>
            )}
          />

          <Button className="w-full" size={"lg"} disabled={isPending}>
            Create Deck
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default CreateDeckForm;
