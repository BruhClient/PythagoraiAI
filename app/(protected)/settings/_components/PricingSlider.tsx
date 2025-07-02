"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { usePaymentSheet } from "@/context/payment-sheet-context";
import { Gem } from "lucide-react";
import React, { useState } from "react";

const PricingSlider = ({ initialGems }: { initialGems: number }) => {
  const [input, setInput] = useState<number[]>([50]);
  const discount = Math.floor(input[0] / 30) * 5;
  const price = (input[0] * 0.3).toFixed(2);
  const { open } = usePaymentSheet();
  const handleClick = () => {
    open(parseFloat(price), discount + input[0]);
  };
  return (
    <div className="flex justify-center flex-col items-center gap-5">
      <div className="flex gap-1 items-center text-sm text-muted-foreground">
        You have {initialGems} <Gem size={12} />
      </div>
      <div className="flex gap-2 items-center font-bold text-3xl">
        {input} <Gem size={20} />{" "}
        {discount > 0 && (
          <div className="flex">
            +
            <span className="flex gap-2 items-center px-2">
              {discount}

              <Gem size={20} />
              <Badge variant={"outline"}>Free</Badge>
            </span>
          </div>
        )}
      </div>
      <Slider
        max={100}
        step={1}
        min={10}
        value={input}
        className="max-w-[500px]"
        onValueChange={(value) => setInput(value)}
      />
      <div className="text-xs text-muted-foreground">
        $0.4 for every PDF Generation . Buy 30 generations get 5 for free !
      </div>
      <Button variant={"outline"} className="w-[200px]" onClick={handleClick}>
        Pay ${price}
      </Button>
    </div>
  );
};

export default PricingSlider;
