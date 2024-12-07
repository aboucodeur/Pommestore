"use client";

import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type PaginationState,
  type RowSelectionState,
  type SortingState,
  useReactTable,
} from "@tanstack/react-table";

import { Button } from "@components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@components/ui/table";
import { ArrowLeftIcon, ArrowRightIcon, EyeIcon } from "lucide-react";
import { useState } from "react";
import DebouncedInput from "~/_components/ui/debouced-input";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "~/_components/ui/dropdown-menu";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  // const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0, // Page par defaut
    pageSize: 8, // Nombres d'elements par page
  });
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

  const [globalFilter, setGlobalFilter] = useState("");

  const table = useReactTable({
    data,
    columns,
    // pageCount: data.length ?? 0,
    getCoreRowModel: getCoreRowModel(), // like a configuration

    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),

    // onColumnFiltersChange: setColumnFilters,
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    onRowSelectionChange: setRowSelection, // no core model
    onGlobalFilterChange: setGlobalFilter,
    state: {
      sorting,
      pagination,
      // columnFilters,
      rowSelection,
      globalFilter,
    },
  });

  return (
    <div className="p-1">
      {/* Rechercher et Visibilite des colonnes */}
      <div className="w-50 flex gap-1">
        <DebouncedInput
          value={globalFilter ?? ""}
          onChange={(value) => setGlobalFilter(String(value))}
          placeholder="Recherche ici..."
        />
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Button
              variant="outline"
              className="ml-auto shadow-lg outline-none"
            >
              <EyeIcon className="mr-1 h-4 w-4" />
              Colonnes
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => (
                <DropdownMenuCheckboxItem
                  key={column.id}
                  className="capitalize"
                  checked={column.getIsVisible()}
                  onCheckedChange={(value) => {
                    column.toggleVisibility(!!value);
                  }}
                >
                  {column.id}
                </DropdownMenuCheckboxItem>
              ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <Table className="mt-2 rounded-lg border">
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>

        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                Pas de resultats.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {/* Table footer */}
      <div className="mt-3 flex flex-wrap items-center gap-3">
        <p className="text-sm">
          Select(s) : {table.getFilteredSelectedRowModel().rows.length}
        </p>
        <p className="text-sm">
          Total(s) : {table.getFilteredRowModel().rows.length}
        </p>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          <ArrowLeftIcon className="h-4 w-4" /> Precedent
        </Button>
        <span className="font-bold text-black dark:text-white">
          {table.getState().pagination.pageIndex + 1}
        </span>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Suivant <ArrowRightIcon className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
