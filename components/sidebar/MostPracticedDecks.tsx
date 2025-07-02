import React from "react";
import {
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useQuery } from "@tanstack/react-query";
import useSessionUser from "@/hooks/use-session-user";
import { useRouter } from "next/navigation";
import { icons } from "@/data/constants";
import { InferModel } from "drizzle-orm";
import { decks } from "@/db/schema";

const MostPracticedDecks = () => {
  const user = useSessionUser();
  const { data } = useQuery({
    queryKey: ["most practiced", user?.id],
    queryFn: async () => {
      const res = await fetch(`/api/decks/most-practiced`);
      if (!res.ok) throw new Error("Failed to fetch questions");
      return res.json();
    },
    staleTime: 0,
    enabled: !!user,
  });

  const router = useRouter();

  return (
    <SidebarContent>
      <SidebarGroup>
        <SidebarGroupLabel>Most Practiced</SidebarGroupLabel>

        <SidebarMenu>
          {data &&
            data.map((item: InferModel<typeof decks>) => {
              //@ts-ignore
              const Icon = icons[item.icon];
              return (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    tooltip={item.title}
                    onClick={() => router.push(`/decks/${item.id}`)}
                  >
                    {item.icon && <Icon />}
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
        </SidebarMenu>
      </SidebarGroup>
    </SidebarContent>
  );
};

export default MostPracticedDecks;
