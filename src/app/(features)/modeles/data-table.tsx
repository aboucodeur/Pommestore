"use client";

import { Button } from "@components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@components/ui/table";
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
import { ArrowLeftIcon, ArrowRightIcon, SearchIcon } from "lucide-react";
import { useState } from "react";
import DebouncedInput from "~/_components/ui/debouced-input";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  search: string;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  search,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  // const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0, // Page par defaut
    pageSize: 8, // Nombres d'elements par page
  });
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

  const [globalFilter, setGlobalFilter] = useState("");

  const filter = new URLSearchParams(search).get("f");

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
        {/* <DropdownMenu>
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
        </DropdownMenu> */}

        {/* Filtre de recherche ici dans un select, tout et corbeile */}
        <form>
          <div className="flex w-64 gap-1">
            <Select name="f" defaultValue={filter ?? "all"}>
              <SelectTrigger className="ml-2 border p-2 shadow-lg">
                <SelectValue placeholder="Filtre" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tout</SelectItem>
                <SelectItem value="deleted">Corbeille</SelectItem>
              </SelectContent>
            </Select>
            <Button type="submit" className="ml-2 shadow-lg outline-none">
              <SearchIcon className="h-4 w-4" />
            </Button>
          </div>
        </form>
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
