"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import clsx from "clsx";

interface RatingProps {
  value?: number;
  onChange?: (rating: number) => void;
  max?: number;
  readOnly?: boolean;
}

export function Rating({
  value = 0,
  onChange,
  max = 5,
  readOnly = false,
}: RatingProps) {
  const [hover, setHover] = useState<number | null>(null);

  const displayValue = hover !== null && !readOnly ? hover : value;

  return (
    <div className="flex gap-1">
      {Array.from({ length: max }).map((_, i) => {
        const filled = i < displayValue;

        return (
          <Star
            size={15}
            key={i}
            className={clsx(
              "transition-colors",
              readOnly ? "cursor-default" : "cursor-pointer",
              filled ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
            )}
            onMouseEnter={() => !readOnly && setHover(i + 1)}
            onMouseLeave={() => !readOnly && setHover(null)}
            onClick={() => !readOnly && onChange?.(i + 1)}
          />
        );
      })}
    </div>
  );
}
