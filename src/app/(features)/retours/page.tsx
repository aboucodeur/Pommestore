import { Shell } from "~/_components/shell";
import { getAllIphones } from "~/server/queries";
import { columns } from "./columns";
import { DataTable } from "./data-table";

export default async function page() {
  const iphs = await getAllIphones();

  return (
    <Shell variant="default">
      <h4 className="flex flex-wrap items-center justify-between text-xl font-semibold tracking-tight">
        Retours grouper
      </h4>
      <div className="w-full overflow-x-auto">
        <div className="w-full overflow-auto">
          <DataTable columns={columns} data={iphs} />
        </div>
      </div>
    </Shell>
  );
}