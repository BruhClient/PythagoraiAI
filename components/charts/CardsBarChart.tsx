"use client";

import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

export const description = "A multiple bar chart";

const chartConfig = {
  aiCardCount: {
    label: "Ai Generated",
    color: "var(--chart-1)",
  },
  humanCardCount: {
    label: "Human Generated",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig;

export function CardsBarChart({
  chartData,
}: {
  chartData: {
    deckName: string;
    aiCardCount: number;
    humanCardCount: number;
  }[];
}) {
  return (
    <ChartContainer
      config={chartConfig}
      className="max-h-[320px] w-full h-full "
    >
      <BarChart accessibilityLayer data={chartData}>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="deckName"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
          tickFormatter={(value) => ""}
        />
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent indicator="dashed" />}
        />
        <Bar
          dataKey="aiCardCount"
          fill="var(--color-aiCardCount)"
          radius={4}
          barSize={30}
        />
        <Bar
          dataKey="humanCardCount"
          fill="var(--color-humanCardCount)"
          radius={4}
          barSize={30}
        />
      </BarChart>
    </ChartContainer>
  );
}
