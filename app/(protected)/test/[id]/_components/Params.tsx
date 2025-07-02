"use client";

import { isStringInteger } from "@/lib/utils";
import { useSearchParams } from "next/navigation";
import React, { useMemo } from "react";
import Test from "./Test";

const Params = ({ deckId }: { deckId: string }) => {
  const searchParams = useSearchParams();

  const maxCards = useMemo(() => {
    const cardCount = searchParams.get("maxCards");
    if (!cardCount) return null;
    return isStringInteger(cardCount) ? parseInt(cardCount) : null;
  }, [searchParams]);

  const testType = useMemo(() => {
    const type = searchParams.get("type");
    return type ?? null;
  }, [searchParams]);

  if (!deckId || !maxCards || !testType) return null;

  return <Test deckId={deckId} testType={testType} maxCards={maxCards} />;
};

export default Params;
