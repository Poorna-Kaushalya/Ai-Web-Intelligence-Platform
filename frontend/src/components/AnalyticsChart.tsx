"use client";

import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface AnalyticsChartProps {
  data: {
    name: string;
    value: number;
    fill: string;
  }[];
}

export default function AnalyticsChart({ data }: AnalyticsChartProps) {
  return (
    <div className="h-64 w-full rounded-3xl border border-surface bg-surface p-4">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 8, left: 0, bottom: 0 }}>
          <XAxis
            dataKey="name"
            tick={{ fill: "#94a3b8", fontSize: 12 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: "#94a3b8", fontSize: 12 }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            wrapperStyle={{
              background: "var(--surface)",
              color: "var(--foreground)",
              borderRadius: 12,
              border: "1px solid var(--border)",
            }}
          />
          <Bar dataKey="value" radius={[12, 12, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}