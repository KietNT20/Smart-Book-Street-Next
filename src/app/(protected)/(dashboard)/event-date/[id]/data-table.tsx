'use client';

import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from '@tanstack/react-table';

import { DataTablePagination } from '@/components/data-table-pagination';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useState } from 'react';
import BatchAttendanceButton from './_components/batch-attendance-button';

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      columnFilters,
    },
  });

  return (
    <div>
      <div className='flex flex-col gap-4 py-4 lg:flex-row lg:items-center'>
        <Input
          placeholder='Tìm Tên người đăng ký'
          value={
            (table.getColumn('registrantName')?.getFilterValue() as string) ??
            ''
          }
          onChange={(event) =>
            table
              .getColumn('registrantName')
              ?.setFilterValue(event.target.value)
          }
          className='w-full md:max-w-sm'
        />
        <Input
          placeholder='Tìm Email'
          value={
            (table.getColumn('registrantEmail')?.getFilterValue() as string) ??
            ''
          }
          onChange={(event) =>
            table
              .getColumn('registrantEmail')
              ?.setFilterValue(event.target.value)
          }
          className='w-full md:max-w-sm'
        />
        <Input
          placeholder='Tìm Số điện thoại'
          value={
            (table
              .getColumn('registrantPhoneNumber')
              ?.getFilterValue() as string) ?? ''
          }
          onChange={(event) =>
            table
              .getColumn('registrantPhoneNumber')
              ?.setFilterValue(event.target.value)
          }
          className='w-full md:max-w-sm'
        />
      </div>
      <div className='mb-4 flex justify-end'>
        <BatchAttendanceButton data={data as any} />
      </div>
      <div className='rounded-md border'>
        <Table>
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
                            header.getContext()
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
                  data-state={row.getIsSelected() && 'selected'}
                >
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
                  className='h-24 text-center'
                >
                  Chưa có dữ liệu.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className='flex items-center justify-end space-x-2 py-4'>
        <DataTablePagination table={table} />
      </div>
    </div>
  );
}
