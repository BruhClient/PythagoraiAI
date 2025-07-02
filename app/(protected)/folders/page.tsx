import PageHeader from "@/components/PageHeader";
import React from "react";
import CreateFolderButton from "./_components/CreateFolderButton";
import { Folder } from "lucide-react";
import FolderFeed from "./_components/FolderFeed";

const FolderPage = () => {
  return (
    <div className="w-full space-y-3">
      <div className="flex justify-between w-full flex-wrap gap-3 ">
        <div className="flex items-center gap-4">
          <div className="bg-primary p-3 rounded-full sm:block hidden">
            <Folder size={25} className="text-black" />
          </div>
          <PageHeader
            title="Folders"
            subtext="Plan,priorise,and accomplish your tasks with ease."
          />
        </div>

        <CreateFolderButton />
      </div>
      <FolderFeed />
    </div>
  );
};

export default FolderPage;
