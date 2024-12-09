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
import { deleteFournisseur } from "~/_lib/actions";
import { urlsParams } from "~/_lib/utils";

export const columns: ColumnDef<{
  f_id: number;
  f_nom: string;
  f_tel: string | null;
  f_adr: string | null;
}>[] = [
  {
    id: "Nom",
    header: "NOM",
    accessorFn: (row) => row.f_nom,
    cell: ({ row }) => {
      return <div className="font-semibold">{row.getValue("Nom")}</div>;
    },
  },
  {
    id: "Telephone",
    header: "TÉLÉPHONE",
    accessorFn: (row) => row.f_tel,
    cell: ({ row }) => {
      return <div>{row.getValue("Telephone") ?? "-"}</div>;
    },
  },
  {
    id: "Adresse",
    header: "ADRESSE",
    accessorFn: (row) => row.f_adr,
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
        <Link href="/fournisseurs/add">
          <Button size="default" className="h-7 rounded-full">
            <CircleFadingPlusIcon className="mr-2 h-4 w-4" /> Fournisseur
          </Button>
        </Link>
      );
    },
    cell: ({ row }) => {
      const fournisseur = row.original;
      const fournisseurParams = urlsParams(fournisseur, true, {
        f_id: "id",
        f_nom: "nom",
        f_tel: "tel",
        f_adr: "adr",
      });

      return ["ENTREES"].includes(fournisseur.f_nom.trim().toUpperCase()) ? (
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
            <Link
              href={`/fournisseurs/edit/${row.original.f_id}${fournisseurParams}`}
            >
              <DropdownMenuItem className="text-orange-400">
                <EditIcon className="mr-1 h-4 w-4" /> Modifier
              </DropdownMenuItem>
            </Link>
            <DropdownMenuItem className="text-red-400">
              <form
                className="flex items-center"
                action={async () => {
                  await deleteFournisseur(fournisseur.f_id.toString());
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
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
