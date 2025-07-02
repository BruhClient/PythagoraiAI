"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Gem } from "lucide-react";
import React, { useState } from "react";
import { Card, CardContent } from "../ui/card";

const Pricing = () => {
  const [input, setInput] = useState<number[]>([50]);
  const discount = Math.floor(input[0] / 30) * 5;
  const price = (input[0] * 0.3).toFixed(2);

  return (
    <div
      className="flex flex-col items-center justify-center gap-8"
      id="pricing"
    >
      <div className="text-center space-y-1">
        <div className="text-3xl font-bold">Pricing</div>
        <div className="flex items-center gap-1 text-muted-foreground">
          Start out with 20 free <Gem size={15} /> !
        </div>
      </div>
      <Card>
        <CardContent>
          <div className="flex justify-center flex-col items-center gap-5 text-3xl font-bold">
            <div className="flex gap-2 items-center">
              {input} <Gem size={15} />{" "}
              {discount > 0 && (
                <div className="flex">
                  +
                  <span className="flex gap-2 items-center px-2">
                    {discount}

                    <Gem size={15} />
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
            <div className="text-sm text-muted-foreground">
              $0.4 for every PDF Generation . Buy 30 generations get 5 for free
              !
            </div>
            <Button variant={"outline"} className="w-[200px]">
              Pay ${price}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Pricing;
