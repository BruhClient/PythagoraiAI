"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
export default function SearchFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const initialFilter = searchParams.get("filter") || "No Filter";

  const [filter, setFilter] = useState(initialFilter);

  const initialMastery = searchParams.get("mastery") || "none";

  const [mastery, setMastery] = useState(initialMastery);

  const handleFilter = (value: string) => {
    const params = new URLSearchParams(Array.from(searchParams.entries()));

    if (value && value !== "No Filter") {
      params.set("filter", value);
    } else {
      params.delete("filter");
    }
    router.replace(`?${params.toString()}`);
    setFilter(value);
  };

  const handleMasteryOrder = (value: string) => {
    const params = new URLSearchParams(Array.from(searchParams.entries()));

    if (value && value !== "none") {
      params.set("mastery", value);
    } else {
      params.delete("mastery");
    }
    router.replace(`?${params.toString()}`);
    setMastery(value);
  };

  return (
    <div className="w-full max-w-[800px] flex gap-1 flex-wrap">
      <Select value={filter} onValueChange={(value) => handleFilter(value)}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Filter" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="No Filter">No Filter</SelectItem>
          <SelectItem value="human">Human Generated</SelectItem>
          <SelectItem value="ai">AI Generated</SelectItem>
        </SelectContent>
      </Select>

      <Select
        value={mastery}
        onValueChange={(value) => handleMasteryOrder(value)}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Proficiency" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="none">Most Proficient</SelectItem>
          <SelectItem value="asc">Least Proficient</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
