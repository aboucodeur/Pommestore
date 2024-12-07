import { Shell } from "~/_components/shell";
import { getAchats } from "~/server/queries";
import { columns } from "./columns";
import { DataTable } from "./data-table";

export default async function AchatsPage() {
  const achats = await getAchats();

  return (
    <Shell variant="default">
      <h4 className="flex flex-wrap items-center justify-between text-xl font-semibold tracking-tight">
        Achats
      </h4>
      <div className="w-full overflow-x-auto">
        <div className="w-full overflow-auto">
          <DataTable columns={columns} data={achats} />
        </div>
      </div>
    </Shell>
  );
}
