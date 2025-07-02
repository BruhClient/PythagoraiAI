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

// Map quality → color
const qualityColorMap: Record<string, string> = {
  "Very Hard": "#ef4444", // red-500
  Hard: "#f97316", // orange-500
  Okay: "#eab308", // yellow-500
  Good: "#3dff7e", // green-500
  Easy: "#00e38c", // blue-500
};
export function ChartReviewQuality({
  reviewData,
}: {
  reviewData: { quality: string; count: number }[];
}) {
  // Chart config for shadcn ChartContainer
  const chartConfig = Object.fromEntries(
    reviewData.map((item) => [
      item.quality,
      {
        label: item.quality,
        color: qualityColorMap[item.quality] || "#8884d8",
      },
    ])
  ) satisfies ChartConfig;
  return (
    <Card>
      <CardHeader>
        <CardTitle>Test Overview</CardTitle>
        <CardDescription>Distribution of your test scores</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart
            data={reviewData}
            margin={{ top: 30, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="quality"
              tickLine={false}
              axisLine={false}
              tickMargin={10}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar dataKey="count" radius={8}>
              {reviewData.map((entry) => (
                <Cell
                  key={entry.quality}
                  fill={qualityColorMap[entry.quality]}
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
