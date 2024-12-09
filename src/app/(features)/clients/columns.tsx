"use client";

import { type ColumnDef } from "@tanstack/react-table";
import {
  CircleFadingPlusIcon,
  EditIcon,
  MoreHorizontal,
  TrashIcon,
} from "lucide-react";
import Link from "next/link";
import { Button } from "~/_components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "~/_components/ui/dropdown-menu";
import { deleteClient } from "~/_lib/actions";
import { urlsParams } from "~/_lib/utils";

export const columns: ColumnDef<{
  c_id: number;
  c_nom: string;
  c_tel: string | null;
  c_adr: string | null;
  c_type: string;
}>[] = [
  {
    id: "Nom",
    header: "NOM",
    accessorFn: (row) => row.c_nom,
    cell: ({ row }) => {
      return <div className="font-semibold">{row.getValue("Nom")}</div>;
    },
  },
  {
    id: "Type",
    header: "TYPE",
    accessorFn: (row) => row.c_type,
    cell: ({ row }) => {
      const type = row.getValue("Type");
      return <div>{type === "PART" ? "Particulier" : "Professionnel"}</div>;
    },
  },
  {
    id: "Telephone",
    header: "TÉLÉPHONE",
    accessorFn: (row) => row.c_tel,
    cell: ({ row }) => {
      return <div>{row.getValue("Telephone") ?? "-"}</div>;
    },
  },
  {
    id: "Adresse",
    header: "ADRESSE",
    accessorFn: (row) => row.c_adr,
    cell: ({ row }) => {
      return <div>{row.getValue("Adresse") ?? "-"}</div>;
    },
  },
  {
    id: "actions",
    enableHiding: false,
    enableColumnFilter: false,
    enableSorting: false,
    header: () => {
      return (
        <Link href="/clients/add">
          <Button size="default" className="h-7 rounded-full">
            <CircleFadingPlusIcon className="mr-2 h-4 w-4" /> Client
          </Button>
        </Link>
      );
    },
    cell: ({ row }) => {
      const client = row.original;
      const clientParams = urlsParams(client, true, {
        c_id: "id",
        c_nom: "nom",
        c_tel: "tel",
        c_adr: "adr",
        c_type: "type",
      });

      return ["RETOURS", "SORTIES"].includes(
        client.c_nom.trim().toUpperCase(),
      ) ? (
        <span className="badge badge-primary badge-md font-semibold">
          RESERVER
        </span>
      ) : (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-1 w-10 p-3">
              <span className="sr-only">Ouvrir le menu</span>
              <MoreHorizontal size={25} className="h-4 w-4 text-center" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <Link href={`/clients/edit/${row.original.c_id}${clientParams}`}>
              <DropdownMenuItem className="text-orange-400">
                <EditIcon className="mr-1 h-4 w-4" /> Modifier
              </DropdownMenuItem>
            </Link>
            <DropdownMenuItem className="text-red-400">
              <form
                className="flex items-center"
                action={async () => {
                  // not using formData .bind cause problem with typescript and first arg is null
                  await deleteClient(client.c_id.toString());
                }}
                method="post"
              >
                <Button
                  variant="ghost"
                  size="icon"
                  className="m-0 h-4 w-full p-0"
                >
                  <TrashIcon size={10} className="mr-1 h-4 w-4" /> Supprimer
                </Button>
              </form>
            </DropdownMenuItem>
            {/* </Link> */}
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
