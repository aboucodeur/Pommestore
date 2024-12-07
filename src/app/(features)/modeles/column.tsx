"use client";

import { type ColumnDef } from "@tanstack/react-table";
import {
  ArrowUpDownIcon,
  CircleFadingPlusIcon,
  EditIcon,
  EyeIcon,
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
import { deleteModele } from "~/_lib/actions";
import { formatDateTime, urlsParams } from "~/_lib/utils";

export const columns: ColumnDef<{
  createdAt: Date;
  updatedAt: Date | null;
  en_id: number;
  m_id: number;
  m_nom: string;
  m_type: string;
  m_qte: number;
  m_prix: string;
  m_memoire: number;
  deletedAt: Date | null;
}>[] = [
  {
    id: "Date",
    header: ({ column }) => {
      return (
        <div className="flex items-center justify-start">
          Date
          <Button
            variant={"ghost"}
            className="p-0"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            <ArrowUpDownIcon className="ml-1 h-4" />
          </Button>
        </div>
      );
    },
    accessorFn: (row) => row.createdAt,
    cell: ({ row }) => {
      return (
        <div className="font-semibold">
          {formatDateTime(row.getValue("Date")).split("T").join("  ")}
        </div>
      );
    },
  },
  {
    id: "Nom",
    header: ({ column }) => {
      return (
        <div className="flex items-center justify-start">
          Nom
          <Button
            variant={"ghost"}
            className="p-0"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            <ArrowUpDownIcon className="ml-1 h-4" />
          </Button>
        </div>
      );
    },
    accessorFn: (row) => `${row.m_nom} ${row.m_type} ${row.m_memoire} Go`,
    cell: ({ row }) => {
      return <div className="font-semibold">{row.getValue("Nom")}</div>;
    },
  },
  {
    id: "Prix",
    header: "PRIX",
    accessorFn: (row) => row.m_prix,
    cell: ({ row }) => {
      return (
        <div className="font-bold">
          {row.getValue("Prix")}
          <sup> F</sup>
        </div>
      );
    },
  },
  {
    id: "Memoire",
    header: "MÉMOIRE",
    accessorFn: (row) => row.m_memoire,
    cell: ({ row }) => {
      return (
        <div className="font-bold">
          {row.getValue("Memoire")}
          <sup> Go</sup>
        </div>
      );
    },
  },
  {
    id: "Quantite",
    header: "QUANTITÉ",
    accessorFn: (row) => row.m_qte,
  },
  {
    id: "actions",
    enableHiding: false,
    enableColumnFilter: false,
    enableSorting: false,
    header: () => {
      return (
        <Link href="/modeles/add">
          <Button size="default" className="h-7 rounded-full">
            <CircleFadingPlusIcon className="mr-2 h-4 w-4" /> Modèle
          </Button>
        </Link>
      );
    },
    cell: ({ row }) => {
      const modele = row.original;
      const modeleParams = urlsParams(modele, true, {
        m_id: "id",
        m_nom: "nom",
        m_type: "type",
        m_prix: "prix",
        m_memoire: "memoire",
        m_qte: "qte",
      });

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-1 w-10 p-3">
              <span className="sr-only">Ouvrir le menu</span>
              <MoreHorizontal size={25} className="h-4 w-4 text-center" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <Link href={`/modeles/${modele.m_id}?${modeleParams}`}>
              <DropdownMenuItem className="text-green-400">
                <EyeIcon className="mr-1 h-4 w-4" /> Details
              </DropdownMenuItem>
            </Link>
            <Link href={`/modeles/edit/${modele.m_id}?${modeleParams}`}>
              <DropdownMenuItem className="text-orange-400">
                <EditIcon className="mr-1 h-4 w-4" /> Modifier
              </DropdownMenuItem>
            </Link>
            <DropdownMenuItem className="text-red-400">
              <form
                className="flex items-center"
                action={async () => {
                  await deleteModele(modele.m_id.toString());
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
