"use client";

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

export const description = "A multiple bar chart";

const chartConfig = {
  averageMastery: {
    label: "Average Mastery",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig;

// Convert mastery (0 → 1) to hue-based color (red → green)
const masteryToHue = (mastery: number) => {
  const hue = Math.round(mastery * 120); // 0 = red, 120 = green
  return `hsl(${hue}, 100%, 50%)`;
};

export function DeckMasteryOverview({
  chartData,
}: {
  chartData: {
    deckName: string;
    averageMastery: number;
  }[];
}) {
  return (
    <ChartContainer
      config={chartConfig}
      className="max-h-[320px] w-full h-full"
    >
      <BarChart data={chartData}>
        <CartesianGrid vertical={false} />

        <XAxis
          dataKey="deckName"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
          tickFormatter={() => ""}
        />

        <YAxis
          domain={[0, 1]}
          tickCount={5}
          tickFormatter={(value) => `${Math.round(value * 100)}%`}
          tickLine={false}
          axisLine={false}
        />

        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent indicator="dashed" />}
        />

        <Bar
          dataKey="averageMastery"
          barSize={30}
          radius={4}
          shape={({ x, y, width, height, payload }: any) => (
            <rect
              x={x}
              y={y}
              width={width}
              height={height}
              rx={4}
              fill={masteryToHue(payload.averageMastery)}
            />
          )}
        />
      </BarChart>
    </ChartContainer>
  );
}
