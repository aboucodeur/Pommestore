// import { type QueryType } from "~/server/queries";
import {
  ArrowLeftCircle,
  ShoppingBasketIcon,
  Smartphone,
  Users,
} from "lucide-react";

import { type DashboardType } from "~/server/queries";
import StatsCard from "./StatsCard";
import SalesChart from "./charts/SalesChart";

export default function Dashboard({ datas }: { datas: DashboardType }) {
  return (
    <div className="min-h-screenp-4 md:p-3">
      <div className="mx-auto max-w-7xl space-y-8">
        <div className="grid gap-4 md:grid-cols-2 md:gap-6 lg:grid-cols-4">
          <StatsCard
            title="Stocks d'iphones"
            value={datas.qNbIphones}
            icon={Smartphone}
            delay={3000}
          />
          <StatsCard
            title="Retours"
            value={datas.qNbRetours}
            icon={ArrowLeftCircle}
            delay={3000}
          />
          <StatsCard
            title="Clients"
            value={datas.qNbClients}
            icon={Users}
            delay={3000}
          />
          <StatsCard
            title="Ventes"
            value={datas.qNbVentes}
            icon={ShoppingBasketIcon}
            delay={3000}
          />
        </div>
        <div className="grid gap-4 md:gap-3 lg:grid-cols-2 xl:grid-cols-2">
          <SalesChart datas={datas.qTopModeles} />
        </div>
      </div>
    </div>
  );
}
