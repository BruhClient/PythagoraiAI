"use client";

import { BarChart, Bar, CartesianGrid, XAxis, Cell, LabelList } from "recharts";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";

// Map mastery level → color
const masteryColorMap: Record<string, string> = {
  "Very Weak": "#ef4444", // red-500
  Weak: "#f97316", // orange-500
  Okay: "#eab308", // yellow-500
  Good: "#3dff7e", // green-500
  Excellent: "#00e38c", // blue-500
};

export function ChartMasteryOverview({
  masteryData,
}: {
  masteryData: { mastery: string; count: number }[];
}) {
  // Chart config for shadcn ChartContainer
  const chartConfig = Object.fromEntries(
    masteryData.map((item) => [
      item.mastery,
      {
        label: item.mastery,
        color: masteryColorMap[item.mastery] || "#8884d8",
      },
    ])
  ) satisfies ChartConfig;

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Mastery Overview</CardTitle>
        <CardDescription>How well you've mastered the deck</CardDescription>
      </CardHeader>
      <CardContent className="w-full">
        <ChartContainer config={chartConfig}>
          <BarChart
            data={masteryData}
            margin={{ top: 30, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="mastery"
              tickLine={false}
              axisLine={false}
              tickMargin={10}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar dataKey="count" radius={8}>
              {masteryData.map((entry) => (
                <Cell
                  key={entry.mastery}
                  fill={masteryColorMap[entry.mastery]}
                />
              ))}
              <LabelList dataKey="count" position="top" />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
