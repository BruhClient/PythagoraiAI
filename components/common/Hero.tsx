"use client";
import React from "react";
import { Button } from "../ui/button";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { motion } from "motion/react";

const Highlight = ({ children }: { children: React.ReactNode }) => {
  return (
    <span className="relative inline-block">
      {/* Word */}
      <span className="relative z-10">{children}</span>

      {/* Animated path underline */}
      <svg
        className="absolute bottom-0 left-0 w-full h-[0.45em] z-0"
        viewBox="0 0 100 10"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <motion.path
          d="M0 8 H100"
          className={"stroke-primary"} // Tailwind yellow-400
          strokeWidth="6"
          strokeLinecap="round"
          fill="none"
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          transition={{ duration: 0.7, ease: "easeInOut" }}
        />
      </svg>
    </span>
  );
};

const Hero = () => {
  return (
    <nav className="flex flex-col items-center justify-center gap-3 h-[60vh] relative overflow-hidden">
      <div className="absolute top-6 w-[400px] h-[400px] bg-primary rounded-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))]  opacity-20 blur-3xl z-[-1] " />

      <div className="flex flex-col text-center justify-center items-center gap-4">
        <div className="md:text-6xl text-3xl font-bold max-w-[1200px] text-center text-balance">
          Master Anything Faster with <Highlight>AI-Powered</Highlight>{" "}
          Flashcards
        </div>

        <div className="font-serif font-normal lg:text-xl max-w-[900px] text-lg">
          Upload lecture notes, textbooks, or study guides — our AI instantly
          transforms your PDFs into powerful flashcards tailored for active
          recall. Learn faster, test smarter, and retain more.
        </div>
      </div>
      <div className="mt-3 space-x-3">
        <Button asChild>
          <Link href="/signup">Get Started</Link>
        </Button>
        <Button variant={"ghost"} asChild>
          <Link href="/signin">
            Have an Account ? <ChevronRight />
          </Link>
        </Button>
      </div>
    </nav>
  );
};

export default Hero;
