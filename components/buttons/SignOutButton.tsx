"use client";

import React from "react";
import { Button } from "../ui/button";
import { LogOut } from "lucide-react";
import { signOut } from "next-auth/react";
import ActionButton from "./ActionButton";

const SignOutButton = () => {
  return (
    <ActionButton
      actionLabel="signout"
      dialogTitle="Are you sure ? "
      dialogDescription="You will be redirected to the sign in page"
      onConfirm={() => {
        signOut({ callbackUrl: "/signin" });
      }}
    >
      <Button variant={"destructive"} className="w-full max-w-[600px]">
        <LogOut />
        Sign Out
      </Button>
    </ActionButton>
  );
};

export default SignOutButton;
