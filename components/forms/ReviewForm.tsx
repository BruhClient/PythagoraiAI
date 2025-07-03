"use client";
import {
  CreateReviewPayload,
  CreateReviewSchema,
} from "@/schemas/create-review";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Rating } from "../common/Ratings";
import { Textarea } from "../ui/textarea";

const CreateReviewForm = () => {
  const form = useForm<CreateReviewPayload>({
    resolver: zodResolver(CreateReviewSchema),
    defaultValues: {
      name: "",
      comment: "",
      rating: 5,
    },
  });

  const onSubmit = (values: CreateReviewPayload) => {};
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className="space-y-1">
              <FormControl>
                <Input
                  {...field}
                  placeholder="Name"
                  className="max-w-[300px]"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="rating"
          render={({ field }) => (
            <FormItem className="space-y-1">
              <FormControl>
                <Rating
                  onChange={(value) => field.onChange(value)}
                  value={field.value}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="comment"
          render={({ field }) => (
            <FormItem className="space-y-1 ">
              <FormControl>
                <Textarea
                  {...field}
                  placeholder="Leave us a review!"
                  className="min-h-[300px] max-h-[400px]"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button className="w-full">Send Review</Button>
      </form>
    </Form>
  );
};

export default CreateReviewForm;
