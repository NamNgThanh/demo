"use client";

import * as React from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  getSortedRowModel,
  PaginationState,
  SortingState,
  ExpandedState,
  OnChangeFn,
  getExpandedRowModel,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  ArrowUpDown,
  ArrowUp,
  ArrowDown
} from "lucide-react";
import { cn } from "@/lib/utils";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  isLoading?: boolean;
  onRowClick?: (row: TData) => void;
  pageCount?: number;
  pagination?: PaginationState;
  onPaginationChange?: OnChangeFn<PaginationState>;
  sorting?: SortingState;
  onSortingChange?: OnChangeFn<SortingState>;
  emptyState?: React.ReactNode;
  headerClassName?: string;
  rowClassName?: string;
  renderSubComponent?: (props: { row: any }) => React.ReactNode;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  isLoading,
  onRowClick,
  pageCount,
  pagination,
  onPaginationChange,
  sorting: externalSorting,
  onSortingChange,
  emptyState,
  headerClassName,
  rowClassName,
  renderSubComponent,
}: DataTableProps<TData, TValue>) {
  const [internalPagination, setInternalPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const [internalSorting, setInternalSorting] = React.useState<SortingState>([]);
  const [expanded, setExpanded] = React.useState<ExpandedState>({});

  const table = useReactTable({
    data,
    columns,
    pageCount: pageCount,
    state: {
      pagination: pagination || internalPagination,
      sorting: externalSorting || internalSorting,
      expanded,
    },
    onPaginationChange: onPaginationChange || setInternalPagination,
    onSortingChange: onSortingChange || setInternalSorting,
    onExpandedChange: setExpanded,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    manualPagination: pageCount !== undefined,
    getRowCanExpand: () => !!renderSubComponent,
  });

  const pageIndex = table.getState().pagination.pageIndex;
  const pageSize = table.getState().pagination.pageSize;
  const totalRows = table.getFilteredRowModel().rows.length;
  const startRow = pageIndex * pageSize + 1;
  const endRow = Math.min((pageIndex + 1) * pageSize, totalRows);

  return (
    <div className="space-y-3 w-full">
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm w-full overflow-hidden">
        <div className="overflow-x-auto w-full">
          <Table className="w-full">
            <TableHeader className={cn("bg-slate-50/50", headerClassName)}>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id} className="border-b border-slate-100 hover:bg-transparent">
                  {headerGroup.headers.map((header) => {
                    const isSortable = header.column.getCanSort();
                    const sortDirection = header.column.getIsSorted();

                    return (
                      <TableHead
                        key={header.id}
                        className="py-4 font-semibold text-slate-600 align-middle whitespace-nowrap relative"
                      >
                        {header.isPlaceholder ? null : (
                          <div
                            className={cn(
                              "w-full h-full flex items-center justify-center group",
                              isSortable && "cursor-pointer select-none"
                            )}
                            onClick={header.column.getToggleSortingHandler()}
                          >
                            <div className={cn("w-full flex justify-center", isSortable && "pr-6")}>
                              {flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                            </div>

                            {isSortable && (
                              <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 shrink-0">
                                {{
                                  asc: <ArrowUp className="h-4 w-4 text-slate-900" />,
                                  desc: <ArrowDown className="h-4 w-4 text-slate-900" />,
                                }[sortDirection as string] ?? (
                                    <ArrowUpDown className="h-4 w-4 opacity-0 group-hover:opacity-50 transition-opacity" />
                                  )}
                              </div>
                            )}
                          </div>
                        )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i} className="border-b border-slate-50">
                    {columns.map((col, j) => (
                      <TableCell key={j} className="py-4">
                        <div className="h-5 bg-slate-100 rounded animate-pulse w-full min-w-12.5" />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <React.Fragment key={row.id}>
                    <TableRow
                      data-state={row.getIsSelected() && "selected"}
                      className={cn(
                        "cursor-pointer transition-colors border-b border-slate-50 last:border-none",
                        "hover:bg-[#7C3AED]/5",
                        rowClassName
                      )}
                      onClick={() => {
                        if (onRowClick) onRowClick(row.original);
                        if (renderSubComponent) row.toggleExpanded();
                      }}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id} className="py-4 align-middle whitespace-nowrap min-w-max">
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                    {row.getIsExpanded() && renderSubComponent && (
                      <TableRow>
                        <TableCell colSpan={row.getVisibleCells().length} className="p-0 border-b border-slate-100 bg-slate-50/50">
                          {renderSubComponent({ row })}
                        </TableCell>
                      </TableRow>
                    )}
                  </React.Fragment>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center text-slate-500"
                  >
                    {emptyState || "Chưa có dữ liệu"}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {table.getPageCount() > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-2 m-4">
          <div className="text-sm text-slate-500 font-medium">
            Hiển thị <span className="font-bold text-slate-900">{startRow}-{endRow}</span> trong tổng số <span className="font-bold text-slate-900">{totalRows}</span> kết quả
          </div>

          <div className="flex items-center gap-2 flex-wrap justify-center">
            <Button
              variant="outline"
              className="h-9 w-9 p-0 border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-[#7C3AED]"
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
            >
              <span className="sr-only">Về đầu</span>
              <ChevronsLeft className="h-4 w-4" />
            </Button>

            <Button
              variant="outline"
              className="h-9 w-9 p-0 border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-[#7C3AED]"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              <span className="sr-only">Trước</span>
              <ChevronLeft className="h-4 w-4" />
            </Button>

            <div className="flex items-center justify-center min-w-25 h-9 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-md shadow-sm mx-1">
              Trang <span className="font-bold text-[#7C3AED] mx-1.5">{pageIndex + 1}</span> / <span className="font-bold mx-1.5">{table.getPageCount()}</span>
            </div>

            <Button
              variant="outline"
              className="h-9 w-9 p-0 border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-[#7C3AED]"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              <span className="sr-only">Sau</span>
              <ChevronRight className="h-4 w-4" />
            </Button>

            <Button
              variant="outline"
              className="h-9 w-9 p-0 border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-[#7C3AED]"
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
            >
              <span className="sr-only">Về cuối</span>
              <ChevronsRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}