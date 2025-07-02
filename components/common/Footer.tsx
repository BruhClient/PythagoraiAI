import { Instagram, Linkedin, LucideIcon } from "lucide-react";
import React from "react";
import { SiTelegram, SiWhatsapp } from "react-icons/si";
import { Button } from "../ui/button";
import Link from "next/link";

const socialLinks = [
  {
    name: "Instagram",
    icon: Instagram,
    href: "#",
  },
  {
    name: "LinkedIn",
    icon: Linkedin,
    href: "#",
  },
  {
    name: "Whatswapp",
    icon: SiWhatsapp,
    href: "#",
  },
  {
    name: "Telegram",
    icon: SiTelegram,
    href: "#",
  },
];
const Footer = () => {
  return (
    <div className="py-4 w-full flex flex-col justify-center items-center gap-3">
      <div className="max-w-[1400px]  flex justify-between w-full">
        <div className="font-bold text-xl">NoteFinity</div>
        <div className="flex gap-1">
          {socialLinks.map((link) => {
            const Icon = link.icon as LucideIcon;
            return (
              <Button size={"icon"} variant={"ghost"} key={link.name} asChild>
                <Link href={link.href}>
                  <Icon />
                </Link>
              </Button>
            );
          })}
        </div>
      </div>
      <div className="max-w-[1400px]  flex justify-between w-full">
        <div className="space-x-3">
          <Link href={"#features"}>Features</Link>
          <Link href={"#pricing"}>Pricing</Link>
        </div>

        <div>All rights reserved.</div>
      </div>
    </div>
  );
};

export default Footer;
