import { type LucideIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

interface StatsCardProps {
  title: string;
  value: string;
  icon: LucideIcon;
  delay: number;
  //   trend: string;
}

export default function StatsCard({
  title,
  value,
  icon: Icon,
  //   delay = 0,
  //   trend,
}: StatsCardProps) {
  return (
    // <div
    //   className="duration-100 animate-in fade-in slide-in-from-bottom-3 fill-mode-both"
    //   style={{ animationDelay: `${delay}ms` }}
    // >
    <Card className="shadow-sm hover:shadow-lg">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg font-medium">{title}</CardTitle>
        <Icon className="h-8 w-8 text-primary" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-semibold text-primary">{value}</div>
      </CardContent>
    </Card>
    // </div>
  );
}
