import React from "react";
import DeckFeed from "../folders/[id]/_components/DeckFeed";
import PageHeader from "@/components/PageHeader";
import { TbCards } from "react-icons/tb";
import GeneralDeckFeed from "./_components/GeneralDeckFeed";

const DeckPage = () => {
  return (
    <div className="w-full space-y-3">
      <div className="flex items-center gap-4">
        <div className="bg-primary p-3 rounded-full sm:block hidden">
          <TbCards size={25} className="text-black" />
        </div>
        <PageHeader
          title="Decks"
          subtext="Plan,priorise,and accomplish your tasks with ease."
        />
      </div>
      <GeneralDeckFeed />
    </div>
  );
};

export default DeckPage;
