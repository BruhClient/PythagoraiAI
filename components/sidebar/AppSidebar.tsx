"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Folder, Home, Settings } from "lucide-react";
import SidebarHead from "./SidebarHead";
import SidebarFoot from "./SidebarFoot";
import { useRouter } from "next/navigation";
import { TbCards } from "react-icons/tb";
import MostPracticedDecks from "./MostPracticedDecks";

const items = [
  {
    title: "Home",
    url: "/home",
    icon: Home,
  },
  {
    title: "Folders",
    url: "/folders",
    icon: Folder,
  },
  {
    title: "Decks",
    url: "/decks",
    icon: TbCards,
  },

  {
    title: "Settings",
    url: "/settings",
    icon: Settings,
  },
];

export function AppSidebar() {
  const router = useRouter();
  return (
    <Sidebar collapsible="icon">
      <SidebarHead />
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenu>
                {items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      tooltip={item.title}
                      onClick={() => router.push(item.url)}
                    >
                      {item.icon && <item.icon />}
                      <span>{item.title}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <MostPracticedDecks />
      </SidebarContent>
      <SidebarFoot />
    </Sidebar>
  );
}
