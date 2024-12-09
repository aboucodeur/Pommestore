"use client";

import { type ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "~/_components/ui/checkbox";
import { cn } from "~/_lib/utils";
// import { type  unknows } from "~/server/db/schema";

export const columns: ColumnDef<{
  createdAt: Date;
  updatedAt: Date | null;
  m_id: number;
  deletedAt: Date | null;
  i_id: number;
  i_barcode: string;
  i_instock: 0 | 1;
  modele: {
    en_id: number;
    m_nom: string;
    m_type: string;
    m_memoire: number;
  };
}>[] = [
  {
    id: "select",
    accessorFn: (row) => row.i_id,
    header: ({ table }) => {
      return (
        <Checkbox
          className="h-5 w-5"
          checked={table.getIsAllPageRowsSelected()}
          onCheckedChange={(value) => {
            table.toggleAllPageRowsSelected(!!value);
          }}
        ></Checkbox>
      );
    },
    cell: ({ row }) => {
      return (
        <Checkbox
          className="h-5 w-5"
          checked={row.getIsSelected()}
          onCheckedChange={(value) => {
            row.toggleSelected(!!value);
          }}
        ></Checkbox>
      );
    },
    enableHiding: false,
    enableSorting: false,
    enableColumnFilter: false,
  },
  {
    id: "imei",
    header: "iPhone",
    accessorFn: (row) => row.i_barcode,
    cell: ({ row }) => {
      const { original } = row;
      return (
        <div className="font-semibold">
          <span className="text-muted-foreground">{row.getValue("imei")}</span>{" "}
          / {original.modele.m_nom} {original.modele.m_type}{" "}
          {original.modele.m_memoire} (GO)
        </div>
      );
    },
    enableHiding: false,
  },
  {
    id: "etat",
    header: "Etat",
    accessorFn: (row) => row.i_instock,
    enableHiding: false,
    enableColumnFilter: false,
    // enableSorting: false,
    cell: (row) => {
      return (
        <span
          className={cn(
            "badge badge-md p-3 font-bold text-white",
            row.getValue<number>() === 1 ? "badge-success" : "badge-error",
          )}
        >
          {row.getValue<number>() === 1 ? "Disponible" : "Non disponible"}
        </span>
      );
    },
  },
  // {
  //   id: "actions",
  //   enableHiding: false,
  //   enableColumnFilter: false,
  //   enableSorting: false,
  //   header: () => {
  //     return (
  //       <Link href="/retours/add">
  //         <Button size="default" className="h-7 rounded-full">
  //           <CircleFadingPlusIcon className="mr-2 h-4 w-4" /> Ajouter
  //         </Button>
  //       </Link>
  //     );
  //   },
  //   cell: ({ row }) => {
  //     return (
  //       <DropdownMenu>
  //         <DropdownMenuTrigger asChild>
  //           <Button variant="ghost" className="h-1 w-8 p-0">
  //             <span className="sr-only">Ouvrir le menu</span>
  //             <MoreHorizontal className="h-4 w-4 text-center" />
  //           </Button>
  //         </DropdownMenuTrigger>
  //         <DropdownMenuContent align="end">
  //           <DropdownMenuLabel>Actions</DropdownMenuLabel>
  //           <Link href={`/retours/edit/${row.original.m_id}`}>
  //             <DropdownMenuItem className="text-orange-400">
  //               <EditIcon className="mr-1 h-4 w-4" /> Modifier
  //             </DropdownMenuItem>
  //           </Link>
  //           <Link href={`/retours/delete/${row.original.m_id}`}>
  //             <DropdownMenuItem className="text-red-400">
  //               <TrashIcon className="mr-1 h-4 w-4" /> Supprimer
  //             </DropdownMenuItem>
  //           </Link>
  //         </DropdownMenuContent>
  //       </DropdownMenu>
  //     );
  //   },
  // },
];
