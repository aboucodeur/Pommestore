"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@components/ui/card";
import { Suspense } from "react";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "../ui/chart";

export default function SalesChart({
  datas,
}: {
  datas: { nom: string; total_ventes: string }[];
}) {
  return (
    // Donner recuperer depuis le serveur
    <Suspense
      fallback={<div className="loading loading-spinner loading-sm"></div>}
    >
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-md">Top 10 des modeles</CardTitle>
        </CardHeader>
        <CardContent>
          {/* <ResponsiveContainer height="60%" aspect={2}> */}
          <ChartContainer
            config={{
              revenus: {
                label: "Revenus",
                color: "hsl(var(--chart-2))",
              },
            }}
          >
            <LineChart
              data={datas}
              // accessibilityLayer
              margin={{
                left: 3,
                right: 12,
                top: 5,
              }}
            >
              <CartesianGrid />
              <XAxis
                dataKey="nom"
                axisLine={false}
                tickLine={false}
                tickMargin={8}
                tickFormatter={(value: string) => value}
              />

              <YAxis
                allowDecimals={false}
                tickFormatter={(value: string) => value}
                axisLine={false}
                tickLine={false}
                tickMargin={8}
                tickSize={8}
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent />}
                // formatter={(value: string) => value + " Fois"}
              />

              <Line
                dataKey="total_ventes"
                type="linear"
                stroke="var(--color-revenus)"
                strokeWidth={2}
                activeDot={{
                  r: 6,
                }}
              />
            </LineChart>
          </ChartContainer>
          {/* </ResponsiveContainer> */}
        </CardContent>
      </Card>
    </Suspense>
  );
}
