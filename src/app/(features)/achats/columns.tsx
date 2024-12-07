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
import { deleteAchat } from "~/_lib/actions";
import { formatDateTime, urlsParams } from "~/_lib/utils";
import { toast } from "~/hooks/use-toast";

export const columns: ColumnDef<{
  a_id: number;
  a_date: Date;
  a_etat: 0 | 1 | 2;
  f_id: number;
  fournisseur: {
    f_nom: string;
  };
}>[] = [
  {
    id: "Date",
    header: "DATE",
    accessorFn: (row) => row.a_date,
    cell: ({ row }) => {
      return (
        <div className="font-medium">
          {formatDateTime(row.getValue("Date")).split("T").join("  ")}
        </div>
      );
    },
  },
  {
    id: "Fournisseur",
    header: "FOURNISSEUR",
    accessorFn: (row) => row.fournisseur.f_nom,
    cell: ({ row }) => {
      return <div className="font-medium">{row.getValue("Fournisseur")}</div>;
    },
  },
  {
    id: "Etat",
    header: ({ column }) => {
      return (
        <div className="flex items-center justify-start">
          État
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
    accessorFn: (row) => row.a_etat,
    cell: ({ row }) => {
      const etat = row.getValue<number>("Etat");
      const etats = ["En cours", "Validé", "Annulé"];
      const colors = ["text-yellow-500", "text-green-500", "text-red-500"];
      return (
        <div className={`font-semibold ${colors[etat]}`}>{etats[etat]}</div>
      );
    },
  },
  {
    id: "actions",
    enableHiding: false,
    enableColumnFilter: false,
    enableSorting: false,
    header: () => {
      return (
        <Link href="/achats/add">
          <Button size="default" className="h-7 rounded-full">
            <CircleFadingPlusIcon className="mr-2 h-4 w-4" /> Achat
          </Button>
        </Link>
      );
    },
    cell: ({ row }) => {
      const achat = row.original;
      const achatParams = urlsParams(achat, true, {
        a_id: "id",
        a_date: "date",
        a_etat: "etat",
        f_id: "f_id",
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
            <Link href={`/achats/${achat.a_id}${achatParams}`}>
              <DropdownMenuItem className="text-green-400">
                <EyeIcon className="mr-1 h-4 w-4" /> Details
              </DropdownMenuItem>
            </Link>
            {achat.a_etat === 0 ? (
              <>
                <Link href={`/achats/edit/${achat.a_id}${achatParams}`}>
                  <DropdownMenuItem className="text-orange-400">
                    <EditIcon className="mr-1 h-4 w-4" /> Modifier
                  </DropdownMenuItem>
                </Link>
                <DropdownMenuItem className="text-red-400">
                  <form
                    className="flex items-center"
                    action={async () => {
                      const data = await deleteAchat(achat.a_id.toString());
                      if (data.error) {
                        toast({
                          title: "Oops !, erreur",
                          description: data.error,
                          variant: "destructive",
                          duration: 5000,
                        });
                      }
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
              </>
            ) : null}
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
