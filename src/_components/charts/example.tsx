// "use client";

// import { CartesianGrid, Line, LineChart, XAxis } from "recharts";

// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@components/ui/card";
// import {
//   type ChartConfig,
//   ChartContainer,
//   ChartTooltip,
//   ChartTooltipContent,
// } from "@components/ui/chart";
// const chartConfig = {
//   desktop: {
//     label: "Desktop",
//     color: "hsl(198.6 88.7% 48.4%)",
//   },
//   mobile: {
//     label: "Mobile",
//     color: "hsl(198.6 88.7% 48.4%)",}
// } satisfies ChartConfig;

// const months = [
//   "Jan",
//   "Fev",
//   "Mar",
//   "Avr",
//   "Mai",
//   "Jun",
//   "Jul",
//   "Aou",
//   "Sep",
//   "Oct",
//   "Nov",
//   "Dec",
// ];

// export function TransfertPerMonth({ datas }: { datas: any[] }) {
//   return (
//     <Card>
//       <CardHeader>
//         <CardTitle>Nombres de transfert par mois</CardTitle>
//         <CardDescription>Consulter vos transferts par mois</CardDescription>
//       </CardHeader>
//       <CardContent>
//         <ChartContainer config={chartConfig}>
//           <LineChart
//             accessibilityLayer
//             data={datas}
//             margin={{
//               left: 12,
//               right: 12,
//             }}
//           >
//             <CartesianGrid vertical={false} />
//             <XAxis
//               dataKey="month"
//               tickLine={false}
//               axisLine={false}
//               tickMargin={5}
//               tickFormatter={(value) => months[value - 1]}
//             />
//             <ChartTooltip
//               cursor={false}
//               content={<ChartTooltipContent hideLabel />}
//             />
//             <Line
//               dataKey="transfer_count"
//               type="natural"
//               stroke="var(--color-desktop)"
//               strokeWidth={2}
//               dot={{
//                 fill: "var(--color-desktop)",
//               }}
//               activeDot={{
//                 r: 6,
//               }}
//             />
//           </LineChart>
//         </ChartContainer>
//       </CardContent>
//     </Card>
//   );
// }
