import { Shell } from "~/_components/shell";
import { getVentes } from "~/server/queries";
import { columns } from "./columns";
import { DataTable } from "./data-table";

export default async function VentesPage() {
  const ventes = await getVentes();

  return (
    <Shell variant="default">
      <h4 className="flex flex-wrap items-center justify-between text-xl font-semibold tracking-tight">
        Ventes
      </h4>
      <div className="w-full overflow-x-auto">
        <div className="w-full overflow-auto">
          <DataTable columns={columns} data={ventes} />
        </div>
      </div>
    </Shell>
  );
}
