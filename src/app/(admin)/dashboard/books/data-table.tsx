import { TableSkeleton } from '@/components/table-skeleton';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  VisibilityState,
} from '@tanstack/react-table';
import { useState } from 'react';

export type BookTableState = {
  pageIndex: number;
  pageSize: number;
  sortField: string;
  sortOrder: -1 | 0 | 1;
};

export interface DataTableProps<TData, TValue> {
  data: TData[];
  columns: ColumnDef<TData, TValue>[];
  pageCount?: number;
  state: BookTableState;
  isLoading?: boolean;
  onStateChange: (state: BookTableState) => void;
}

export function DataTable<TData, TValue>({
  data,
  columns,
  pageCount,
  state,
  isLoading,
  onStateChange,
}: DataTableProps<TData, TValue>) {
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});

  const table = useReactTable({
    data,
    columns,
    defaultColumn: {
      size: 200, //starting column size
      minSize: 50, //enforced during column resizing
      maxSize: 500, //enforced during column resizing
    },
    pageCount: pageCount ?? -1,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    manualPagination: true,
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      sorting: [{ id: state.sortField, desc: state.sortOrder === -1 }],
      columnVisibility,
      pagination: {
        pageIndex: state.pageIndex - 1,
        pageSize: state.pageSize,
      },
    },
    onPaginationChange: (updater) => {
      const newState =
        typeof updater === 'function'
          ? updater({
              pageIndex: state.pageIndex - 1,
              pageSize: state.pageSize,
            })
          : updater;

      onStateChange({
        ...state,
        pageIndex: newState.pageIndex + 1,
        pageSize: newState.pageSize,
      });
    },
    onSortingChange: (updater) => {
      const newSorting =
        typeof updater === 'function'
          ? updater([{ id: state.sortField, desc: state.sortOrder === -1 }])
          : updater;

      if (newSorting.length > 0) {
        onStateChange({
          ...state,
          sortField: newSorting[0].id,
          sortOrder: newSorting[0].desc ? -1 : 1,
        });
      }
    },
  });

  return (
    <div>
      <div className="mb-3 flex justify-end">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              Hiển thị cột
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className={
                      header.column.getCanSort()
                        ? 'cursor-pointer select-none'
                        : ''
                    }
                    onClick={header.column.getToggleSortingHandler()}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableSkeleton columns={columns.length} rows={state.pageSize} />
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} className="hover:bg-muted/50">
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  Không có kết quả
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          Trang {state.pageIndex} / {pageCount || 1}
        </div>
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-2">
            <p className="text-sm font-medium">Số dòng</p>
            <select
              value={state.pageSize}
              onChange={(e) => {
                onStateChange({
                  ...state,
                  pageSize: Number(e.target.value),
                  pageIndex: 1, // Reset về trang 1 khi đổi pageSize
                });
              }}
              className="h-8 rounded-md border border-input bg-background px-2"
            >
              {[10, 20, 30, 40, 50].map((pageSize) => (
                <option key={pageSize} value={pageSize}>
                  {pageSize}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                if (state.pageIndex > 1) {
                  onStateChange({
                    ...state,
                    pageIndex: state.pageIndex - 1,
                  });
                }
              }}
              disabled={state.pageIndex === 1}
            >
              Trước
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                if (state.pageIndex < (pageCount || 0)) {
                  onStateChange({
                    ...state,
                    pageIndex: state.pageIndex + 1,
                  });
                }
              }}
              disabled={state.pageIndex === pageCount}
            >
              Tiếp
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
