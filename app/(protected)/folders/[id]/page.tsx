import PageHeader from "@/components/PageHeader";
import { getFolderById } from "@/server/db/folders";
import { Layers } from "lucide-react";
import { redirect } from "next/navigation";
import React from "react";
import CreateDeckButton from "./_components/CreateDeckButton";
import DeckFeed from "./_components/DeckFeed";
import EditFolderButton from "./_components/EditFolderButton";

const FolderDetailsPage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;

  const folder = await getFolderById(id);

  if (!folder) {
    redirect("/folders");
  }
  return (
    <div className="space-y-3 w-full">
      <div className="flex justify-between w-full flex-wrap gap-3 ">
        <div className="flex items-center gap-4">
          <div className="bg-primary p-3 rounded-full sm:block hidden">
            <Layers size={25} className="text-black" />
          </div>
          <PageHeader
            title={folder.title}
            subtext={"View your decks and create cards"}
          />
        </div>
        <div className="space-x-2">
          <CreateDeckButton folderId={folder.id} />
          <EditFolderButton {...folder} />
        </div>
      </div>
      <DeckFeed folderId={folder.id} />
    </div>
  );
};

export default FolderDetailsPage;
