"use client";

import * as React from "react";
import { PieChart, Pie, Cell, Label, Sector } from "recharts";

import { formatNumberShort, truncateText } from "@/lib/utils";
import { useRouter } from "next/navigation";

const chartColors = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
  "var(--chart-6)",
  "var(--chart-7)",
  "var(--chart-8)",
  "var(--chart-9)",
  "var(--chart-10)",
];

type ReviewData = {
  deckName: string;
  reviewCount: number;
  deckId: string;
};

interface ReviewPieChartProps {
  data: ReviewData[];
}

export function ReviewPieChart({ data }: ReviewPieChartProps) {
  const chartData = React.useMemo(() => {
    return data.slice(0, 10).map((item, index) => ({
      name: item.deckName,
      value: item.reviewCount,
      color: chartColors[index % chartColors.length],
      id: item.deckId,
    }));
  }, [data]);

  const total = chartData.reduce((sum, item) => sum + item.value, 0);

  const router = useRouter();
  const [activeIndex, setActiveIndex] = React.useState<number | null>(null);

  // Custom active slice shape with expansion effect
  const renderActiveShape = (props: any) => {
    const {
      cx,
      cy,
      midAngle,
      innerRadius,
      outerRadius,
      startAngle,
      endAngle,
      fill,
      payload,

      value,
    } = props;

    const RADIAN = Math.PI / 180;
    const sin = Math.sin(-RADIAN * midAngle);
    const cos = Math.cos(-RADIAN * midAngle);
    const sx = cx + (outerRadius + 10) * cos;
    const sy = cy + (outerRadius + 10) * sin;
    const mx = cx + (outerRadius + 30) * cos;
    const my = cy + (outerRadius + 30) * sin;
    const ex = mx + (cos >= 0 ? 1 : -1) * 22;
    const ey = my;
    const textAnchor = cos >= 0 ? "start" : "end";

    return (
      <g>
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius}
          outerRadius={outerRadius + 10}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
          stroke="var(--border)"
          strokeWidth={2}
        />
        <Sector
          cx={cx}
          cy={cy}
          startAngle={startAngle}
          endAngle={endAngle}
          innerRadius={outerRadius + 10}
          outerRadius={outerRadius + 15}
          fill={fill}
          opacity={0.2}
        />
        <path
          d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`}
          stroke={fill}
          fill="none"
        />
        <circle cx={ex} cy={ey} r={4} fill={fill} stroke="none" />
        <text
          x={ex + (cos >= 0 ? 1 : -1) * 12}
          y={ey}
          textAnchor={textAnchor}
          fill="var(--foreground)"
          dominantBaseline="middle"
          style={{ fontWeight: "bold", fontSize: 14 }}
        >
          {truncateText(payload.name, 10)}
        </text>
        <text
          x={ex + (cos >= 0 ? 1 : -1) * 12}
          y={ey + 18}
          textAnchor={textAnchor}
          fill="var(--muted-foreground)"
          dominantBaseline="middle"
          style={{ fontSize: 12 }}
        >
          {value.toLocaleString()} Reviews
        </text>
      </g>
    );
  };

  return (
    <>
      <PieChart width={320} height={320}>
        <Pie
          data={chartData}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          innerRadius={70}
          outerRadius={100}
          paddingAngle={3}
          activeShape={renderActiveShape}
          onMouseEnter={(_, index) => setActiveIndex(index)}
          onMouseLeave={() => setActiveIndex(null)}
        >
          {chartData.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={entry.color}
              style={{
                cursor: "pointer",
                opacity:
                  activeIndex === null || activeIndex === index ? 1 : 0.5,
                transition: "opacity 0.3s",
              }}
            />
          ))}
          <Label
            position="center"
            content={() => {
              if (activeIndex !== null && chartData[activeIndex]) {
                const active = chartData[activeIndex];
                return (
                  <text
                    x="50%"
                    y="50%"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    className="fill-foreground text-2xl font-semibold"
                  >
                    {formatNumberShort(active.value)}
                    <tspan
                      x="50%"
                      dy="1.4em"
                      className="fill-muted-foreground text-xs"
                    >
                      {truncateText(active.name, 10)}
                    </tspan>
                  </text>
                );
              }
              return (
                <text
                  x="50%"
                  y="50%"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="fill-foreground text-2xl font-semibold"
                >
                  {formatNumberShort(total)}
                  <tspan
                    x="50%"
                    dy="1.4em"
                    className="fill-muted-foreground text-xs"
                  >
                    Total Reviews
                  </tspan>
                </text>
              );
            }}
          />
        </Pie>
      </PieChart>

      {/* Legend */}
      <div className="grid w-full max-w-xs grid-cols-2 gap-2 text-sm text-muted-foreground select-none place-items-center">
        {chartData.map((item, index) => (
          <div
            key={index}
            className="flex items-center gap-2 cursor-pointer"
            onMouseEnter={() => setActiveIndex(index)}
            onMouseLeave={() => setActiveIndex(null)}
            style={{
              fontWeight: activeIndex === index ? "600" : "normal",
              color: activeIndex === index ? "var(--foreground)" : undefined,
            }}
            onClick={() => router.push(`/decks/${item.id}`)}
          >
            <span
              className="inline-block h-3 w-3 rounded-sm"
              style={{ backgroundColor: item.color }}
            />
            <span className="truncate">{truncateText(item.name, 10)}</span>
          </div>
        ))}
      </div>
    </>
  );
}
