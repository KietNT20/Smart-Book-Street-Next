'use client';

import { Button } from '@/components/ui/button';
import { formatDate } from '@/lib/utils';
import { Book } from '@/types/book-types';
import { ColumnDef } from '@tanstack/react-table';
import { ArrowDown, ArrowUp, ArrowUpDown } from 'lucide-react';

export const columns: ColumnDef<Book>[] = [
  {
    accessorKey: 'code',
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        className="flex items-center"
      >
        Mã sách
        {column.getIsSorted() === 'asc' ? (
          <ArrowUp />
        ) : column.getIsSorted() === 'desc' ? (
          <ArrowDown />
        ) : (
          <ArrowUpDown />
        )}
      </Button>
    ),
    filterFn: 'includesString',
  },
  {
    accessorKey: 'title',
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        className="flex items-center"
      >
        Tên sách
        {column.getIsSorted() === 'asc' ? (
          <ArrowUp />
        ) : column.getIsSorted() === 'desc' ? (
          <ArrowDown />
        ) : (
          <ArrowUpDown />
        )}
      </Button>
    ),
    filterFn: 'includesString',
  },
  {
    accessorKey: 'price',
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        className="flex items-center"
      >
        Giá (VND)
        {column.getIsSorted() === 'asc' ? (
          <ArrowUp />
        ) : column.getIsSorted() === 'desc' ? (
          <ArrowDown />
        ) : (
          <ArrowUpDown />
        )}
      </Button>
    ),
    cell: ({ row }) => {
      const price = parseFloat(row.getValue('price'));
      if (isNaN(price)) {
        return '0 ₫';
      }
      return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
      }).format(price);
    },
  },
  {
    accessorKey: 'languages',
    header: 'Ngôn ngữ',
    filterFn: 'includesString',
  },
  {
    accessorKey: 'status',
    header: 'Tình trạng',
    filterFn: 'includesString',
  },
  {
    accessorKey: 'publicationDate',
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        className="flex items-center"
      >
        Ngày xuất bản
        {column.getIsSorted() === 'asc' ? (
          <ArrowUp />
        ) : column.getIsSorted() === 'desc' ? (
          <ArrowDown />
        ) : (
          <ArrowUpDown />
        )}
      </Button>
    ),
    cell: ({ row }) => formatDate(row.getValue('publicationDate')),
  },
  {
    accessorKey: 'createdDate',
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        className="flex items-center"
      >
        Ngày tạo
        {column.getIsSorted() === 'asc' ? (
          <ArrowUp />
        ) : column.getIsSorted() === 'desc' ? (
          <ArrowDown />
        ) : (
          <ArrowUpDown />
        )}
      </Button>
    ),
    cell: ({ row }) => formatDate(row.getValue('createdDate')),
  },
];
