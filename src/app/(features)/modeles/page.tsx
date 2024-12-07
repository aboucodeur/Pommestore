import { headers } from "next/headers";
import { Shell } from "~/_components/shell";
import { getModeles } from "~/server/queries";
import { columns } from "./column";
import { columnsDeleted } from "./column_deleted";
import { DataTable } from "./data-table";

export default async function page() {
  const headersList = headers();
  const search = headersList.get("x-query")!; // passing as string not class
  const searchParams = new URLSearchParams(search);
  const modeles = await getModeles(searchParams.get("f")!);

  return (
    <Shell variant="default">
      <h4 className="flex flex-wrap items-center justify-between text-xl font-semibold tracking-tight">
        Modèles
      </h4>
      <div className="w-full overflow-x-auto">
        <div className="w-full overflow-auto">
          <DataTable
            columns={
              searchParams.get("f") === "deleted" ? columnsDeleted : columns
            }
            data={modeles}
            search={search}
          />
        </div>
      </div>
    </Shell>
  );
}
