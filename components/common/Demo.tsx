"use client";

import React from "react";
import { Safari } from "@/components/magicui/safari";
import Iphone15Pro from "../magicui/iphone-15-pro";
import { useTheme } from "next-themes";

const Demo = () => {
  const { theme } = useTheme();
  return (
    <div className="max-w-[1200px] ">
      <div className="relative lg:block hidden">
        <Safari
          url="CoachAI.com"
          className="size-full"
          imageSrc={
            theme === "dark"
              ? "/demo/desktop-dark.png"
              : "/demo/desktop-light.png"
          }
        />
      </div>
      <div className="relative block lg:hidden">
        <Iphone15Pro
          className="size-full  self-center"
          src={
            theme === "dark"
              ? "/demo/mobile-dark.png"
              : "/demo/mobile-light.png"
          }
        />
      </div>
    </div>
  );
};

export default Demo;
