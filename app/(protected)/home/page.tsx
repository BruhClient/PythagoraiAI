import PageHeader from "@/components/PageHeader";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import React, { Suspense } from "react";
import DeckAmount from "./_components/DeckAmount";
import FolderAmount from "./_components/FolderAmount";
import CardAmount from "./_components/CardAmount";
import { Skeleton } from "@/components/ui/skeleton";
import { Folder, Home, LucideIcon } from "lucide-react";
import { TbCards } from "react-icons/tb";
import type { IconType } from "react-icons";
import { BsCardText } from "react-icons/bs";
import DecksOverview from "./_components/DecksOverview";
import CardsOverview from "./_components/CardsOverview";
import FolderFeed from "./_components/FolderFeed";
import ReviewsOverview from "./_components/ReviewsOverview";
const page = async () => {
  const session = await auth();

  if (!session) {
    redirect("/");
  }
  return (
    <div className="w-full space-y-4">
      <div className="flex items-center gap-4">
        <div className="bg-primary p-3 rounded-full sm:block hidden">
          <Home size={25} className="text-black" />
        </div>
        <PageHeader
          title="Dashboard"
          subtext="View your analytics and metrics"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 w-full gap-3 ">
        <Suspense
          fallback={<LoadingSkeleton Icon={TbCards} text="Total Decks" />}
        >
          <DeckAmount userId={session.user.id} />
        </Suspense>
        <Suspense
          fallback={<LoadingSkeleton Icon={Folder} text="Total Folders" />}
        >
          <FolderAmount userId={session.user.id} />
        </Suspense>
        <Suspense
          fallback={<LoadingSkeleton Icon={BsCardText} text="Total Cards" />}
        >
          <CardAmount userId={session.user.id} />
        </Suspense>
      </div>
      <div className="grid w-full gap-2  grid-cols-1 lg:grid-cols-[400px_1fr]">
        {/* DecksOverview – fixed at 300px on md+ */}
        <Suspense>
          <DecksOverview userId={session.user.id} />
        </Suspense>

        {/* CardsOverview – fills remaining space */}
        <Suspense>
          <CardsOverview userId={session.user.id} />
        </Suspense>
      </div>

      <div className="grid w-full gap-2  grid-cols-1 lg:grid-cols-[1fr_400px]">
        {/* DecksOverview – fixed at 300px on md+ */}
        <Suspense>
          <ReviewsOverview userId={session.user.id} />
        </Suspense>

        {/* CardsOverview – fills remaining space */}
        <Suspense>
          <FolderFeed />
        </Suspense>
      </div>
    </div>
  );
};

export default page;

const LoadingSkeleton = ({
  Icon,
  text,
}: {
  Icon: LucideIcon | IconType;
  text: string;
}) => {
  return (
    <div className="flex justify-between w-full items-center bg-card p-3 rounded-lg">
      <div>
        <div className="text-muted-foreground">{text}</div>
        <div className="font-serif">
          <Skeleton className="w-6 h-4" />
        </div>
      </div>

      <div className="bg-primary p-3 w-fit rounded-lg h-fit">
        <Icon className="text-black" size={20} />
      </div>
    </div>
  );
};
