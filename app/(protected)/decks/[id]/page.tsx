import PageHeader from "@/components/PageHeader";
import { getDeckById } from "@/server/db/decks";

import { redirect } from "next/navigation";
import React, { Suspense } from "react";
import EditDeckButton from "./_components/EditDeckButton";
import { ChevronLeft, LucideIcon } from "lucide-react";
import { icons } from "@/data/constants";
import CreateCardButton from "./_components/CreateCardButton";
import CardFeed from "./_components/CardFeed";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import TestButton from "./_components/TestButton";
import SearchFilters from "./_components/SearchFilters";
import DeckAnalytics from "./_components/DeckAnalytics";
import RecentReviews from "./_components/RecentReviews";

const DeckDetailsPage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;

  const deck = await getDeckById(id);

  if (!deck) {
    redirect("/folders");
  }

  //@ts-ignore
  const Icon = icons[deck.icon] as LucideIcon;
  return (
    <div className="space-y-3">
      <div className="flex justify-between w-full flex-wrap gap-3 ">
        <div className="flex items-center gap-4">
          <div
            className=" p-3 rounded-full sm:block hidden"
            style={{ backgroundColor: deck.color }}
          >
            <Icon size={25} />
          </div>
          <PageHeader title={deck.title} subtext={`${deck.cardCount} cards`} />
        </div>

        <EditDeckButton {...deck} />
      </div>

      <div className="flex gap-2 flex-wrap">
        <Button variant={"outline"} asChild>
          <Link href={`/folders/${deck.folderId}`}>
            <ChevronLeft />
            Back to Folder
          </Link>
        </Button>
        <CreateCardButton id={id} />
        <TestButton deckId={id} cardCount={deck.cardCount} />
      </div>

      <div className="flex flex-col xl:flex-row w-full gap-6">
        {/* Deck Analytics (Responsive & Stretching) */}
        <div className="flex-1 w-full">
          <Suspense
            fallback={
              <div className="h-[300px] w-full rounded-lg bg-muted animate-pulse" />
            }
          >
            <DeckAnalytics deckId={deck.id} />
          </Suspense>
        </div>

        {/* Recent Reviews */}
        <div className="flex-1 w-full max-w-full">
          <RecentReviews deckId={deck.id} />
        </div>
      </div>

      <SearchFilters />
      <CardFeed deckId={id} />
    </div>
  );
};

export default DeckDetailsPage;
