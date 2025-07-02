import { ModeToggle } from "@/components/ModeToggle";
import PageHeader from "@/components/PageHeader";

import ProfilePicUploader from "@/components/auth/ProfilePicUploader";
import { Separator } from "@/components/ui/separator";
import { auth } from "@/lib/auth";
import { Settings } from "lucide-react";
import { redirect } from "next/navigation";
import React from "react";
import PricingSlider from "./_components/PricingSlider";
import SignOutButton from "@/components/buttons/SignOutButton";

const SettingsPage = async () => {
  const session = await auth();

  if (!session) {
    redirect("/");
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-4">
        <div className="bg-primary p-3 rounded-full sm:block hidden">
          <Settings size={25} className="text-black" />
        </div>
        <PageHeader
          title="Settings"
          subtext="Plan,priorise,and accomplish your tasks with ease."
        />
      </div>

      <div className="w-full flex justify-between flex-wrap">
        <div className="p-3">
          <div className="text-lg">Profile</div>
          <div className="text-muted-foreground text-sm">
            Set your account details
          </div>
        </div>

        <ProfilePicUploader
          initialImage={session.user.image}
          id={session.user.id}
        />
      </div>
      <Separator />

      <div className="w-full flex justify-between flex-wrap">
        <div className="p-3">
          <div className="text-lg">Appearance</div>
          <div className="text-muted-foreground text-sm">
            Configure themes to your liking
          </div>
        </div>

        <ModeToggle />
      </div>

      <Separator />

      <div className="w-full flex flex-col">
        <div className="p-3">
          <div className="text-lg">Billing</div>
          <div className="text-muted-foreground text-sm">
            Simple pricing to fit your needs
          </div>
        </div>

        <PricingSlider initialGems={session.user.gems} />
      </div>
      <div className="w-full flex justify-center items-center">
        <SignOutButton />
      </div>
    </div>
  );
};

export default SettingsPage;
