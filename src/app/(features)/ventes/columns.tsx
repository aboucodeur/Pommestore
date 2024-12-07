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
import { deleteVente } from "~/_lib/actions";
import { formatDateTime, urlsParams } from "~/_lib/utils";
import { toast } from "~/hooks/use-toast";

export const columns: ColumnDef<{
  v_id: number;
  v_date: Date;
  v_etat: 0 | 1 | 2;
  c_id: number;
  client: {
    c_nom: string;
  };
}>[] = [
  {
    id: "Date",
    header: "DATE",
    accessorFn: (row) => row.v_date,
    cell: ({ row }) => {
      return (
        <div className="font-medium">
          {/* avec donne moi avec un a absent en haut :   */}
          {formatDateTime(row.getValue("Date")).split("T").join("  ")}
        </div>
      );
    },
  },
  {
    id: "Client",
    header: "CLIENT",
    accessorFn: (row) => row.client.c_nom,
    cell: ({ row }) => {
      return <div className="font-medium">{row.getValue("Client")}</div>;
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
    accessorFn: (row) => row.v_etat,
    cell: ({ row }) => {
      const etat = row.getValue<number>("Etat");
      const etats = ["En cours", "Validée", "Annulée"];
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
        <Link href="/ventes/add">
          <Button size="default" className="h-7 rounded-full">
            <CircleFadingPlusIcon className="mr-2 h-4 w-4" /> Vente
          </Button>
        </Link>
      );
    },
    cell: ({ row }) => {
      const vente = row.original;
      const venteParams = urlsParams(vente, true, {
        v_id: "id",
        v_date: "date",
        v_etat: "etat",
        c_id: "c_id",
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
            <Link href={`/ventes/${vente.v_id}${venteParams}`}>
              <DropdownMenuItem className="text-green-400">
                <EyeIcon className="mr-1 h-4 w-4" /> Details
              </DropdownMenuItem>
            </Link>
            {vente.v_etat === 0 ? (
              <>
                <Link href={`/ventes/edit/${vente.v_id}${venteParams}`}>
                  <DropdownMenuItem className="text-orange-400">
                    <EditIcon className="mr-1 h-4 w-4" /> Modifier
                  </DropdownMenuItem>
                </Link>
                <DropdownMenuItem className="text-red-400">
                  <form
                    className="flex items-center"
                    action={async () => {
                      const data = await deleteVente(vente.v_id.toString());
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
