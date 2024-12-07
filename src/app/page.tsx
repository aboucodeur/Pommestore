// export const dynamic = "force-dynamic";
// export const revalidate = 30000;

import Dashboard from "~/_components/dashboard";
import { type DashboardType, getDashboard } from "~/server/queries";

export default async function page() {
  const dashs = (await getDashboard()) as DashboardType;
  return <Dashboard datas={dashs} />;
}
