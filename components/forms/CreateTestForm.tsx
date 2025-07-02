"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";

import { CreateTestPayload, CreateTestSchema } from "@/schemas/create-test";
import { BookOpen, ChevronLeft, ChevronRight } from "lucide-react";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter } from "next/navigation";
const CreateTestForm = ({
  maxCards,
  deckId,
}: {
  maxCards: string;
  deckId: string;
}) => {
  const form = useForm<CreateTestPayload>({
    resolver: zodResolver(CreateTestSchema),
    defaultValues: {
      numOfCards: parseInt(maxCards),
      type: "default",
    },
  });

  const router = useRouter();

  const onSubmit = (values: CreateTestPayload) => {
    router.push(
      `/test/${deckId}?maxCards=${values.numOfCards}&type=${values.type}`
    );
  };

  return (
    <div className="space-y-3">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          <FormField
            control={form.control}
            name="numOfCards"
            render={({ field }) => (
              <FormItem className="space-y-1">
                <FormLabel>Number of Flash Cards</FormLabel>
                <FormControl>
                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      variant={"ghost"}
                      size={"icon"}
                      onClick={() => {
                        if (field.value > 0) {
                          field.onChange(field.value - 1);
                        }
                      }}
                    >
                      <ChevronLeft />
                    </Button>
                    <Input
                      {...field}
                      onChange={(e) => {
                        console.log(e.target.value);
                        if (!e.target.value || field.value < 0) {
                          field.onChange(0);
                        }

                        const cardCount = parseInt(e.target.value);
                        if (cardCount > parseInt(maxCards)) {
                          field.onChange(maxCards);
                        } else {
                          field.onChange(cardCount);
                        }
                      }}
                      type="number"
                      className="text-center"
                    />
                    <Button
                      type="button"
                      variant={"ghost"}
                      size={"icon"}
                      onClick={() => {
                        if (field.value < parseInt(maxCards)) {
                          field.onChange(field.value + 1);
                        }
                      }}
                    >
                      <ChevronRight />
                    </Button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem className="space-y-1">
                <FormControl>
                  <Select
                    value={field.value}
                    onValueChange={(value) => field.onChange(value)}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder={"Select a Test Type"} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Type Types</SelectLabel>
                        <SelectItem value="default">Default</SelectItem>
                        <SelectItem value="low-mastery">
                          Prioritise Low Mastery
                        </SelectItem>
                        <SelectItem value="new">
                          Prioritize New Cards
                        </SelectItem>
                        <SelectItem value="difficulty">
                          Prioritize Difficulty
                        </SelectItem>
                        <SelectItem value="random">Random</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </FormControl>
              </FormItem>
            )}
          />

          <Button className="w-full" size={"lg"}>
            <BookOpen />
            Start Test
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default CreateTestForm;
