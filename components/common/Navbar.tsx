import React from "react";
import Logo from "./Logo";
import { Button } from "../ui/button";
import Link from "next/link";
import { Github } from "lucide-react";
import { ModeToggle2 } from "./ModeToggle2";

const navLinks = [
  {
    name: "Features",
    href: "#features",
  },
  {
    name: "Reviews",
    href: "#reviews",
  },
  {
    name: "Pricing",
    href: "#pricing",
  },
];
const Navbar = () => {
  return (
    <nav className=" py-3 flex w-full justify-between items-center flex-wrap gap-3">
      <div className="flex items-center gap-2 font-bold text-xl  ">
        <Logo /> Pythagorai
      </div>
      <div className="flex gap-2 items-center flex-wrap ">
        {navLinks.map((link) => {
          return (
            <Button variant={"ghost"} key={link.name} asChild>
              <Link href={link.href}>{link.name}</Link>
            </Button>
          );
        })}
        <Button size={"icon"} variant={"outline"} asChild>
          <Link href={"https://github.com/BruhClient/PythagoraiAI"}>
            <Github />
          </Link>
        </Button>
        <ModeToggle2 />
      </div>
    </nav>
  );
};

export default Navbar;
