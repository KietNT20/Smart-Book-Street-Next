'use client';

import { Button } from '@/components/ui/button';
import { formateDateVi, formatPrice } from '@/lib/utils';
import { Book } from '@/types/book-types';
import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown, SortAsc, SortDesc } from 'lucide-react';
import BookMenuAction from './_components/book-menu-action';

export const columns: ColumnDef<Book>[] = [
  {
    accessorKey: 'no',
    header: 'No.',
    cell: ({ row }) => {
      const index = row.index + 1;
      return <p className='text-muted-foreground'>{index}</p>;
    },
  },
  {
    accessorKey: 'isbn',
    header: ({ column }) => (
      <Button
        variant='ghost'
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        className='flex items-center'
      >
        ISBN
        {column.getIsSorted() === 'asc' ? (
          <SortAsc className='ml-1 h-4 w-4 text-blue-500' />
        ) : column.getIsSorted() === 'desc' ? (
          <SortDesc className='ml-1 h-4 w-4 text-blue-500' />
        ) : (
          <ArrowUpDown className='ml-1 h-4 w-4 text-zinc-500' />
        )}
      </Button>
    ),
  },
  {
    accessorKey: 'title',
    header: ({ column }) => (
      <Button
        variant='ghost'
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        className='flex items-center'
      >
        Tên sách
        {column.getIsSorted() === 'asc' ? (
          <SortAsc className='ml-2 h-4 w-4' />
        ) : column.getIsSorted() === 'desc' ? (
          <SortDesc className='ml-2 h-4 w-4' />
        ) : (
          <ArrowUpDown className='ml-2 h-4 w-4' />
        )}
      </Button>
    ),
    cell: ({ row }) => {
      const book = row.original;
      return (
        <p className='max-w-48 overflow-hidden truncate text-ellipsis'>
          {book.title}
        </p>
      );
    },
  },
  {
    accessorKey: 'price',
    header: ({ column }) => (
      <Button
        variant='ghost'
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        className='flex items-center'
      >
        Giá (VND)
        {column.getIsSorted() === 'asc' ? (
          <SortAsc className='ml-2 h-4 w-4' />
        ) : column.getIsSorted() === 'desc' ? (
          <SortDesc className='ml-2 h-4 w-4' />
        ) : (
          <ArrowUpDown className='ml-2 h-4 w-4' />
        )}
      </Button>
    ),
    cell: ({ row }) => {
      return formatPrice(row.getValue('price'));
    },
  },
  {
    accessorKey: 'languages',
    header: 'Ngôn ngữ',
  },
  {
    accessorKey: 'status',
    header: 'Tình trạng',
  },
  {
    accessorKey: 'publicationDate',
    header: ({ column }) => (
      <Button
        variant='ghost'
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        className='flex items-center'
      >
        Ngày xuất bản
        {column.getIsSorted() === 'asc' ? (
          <SortAsc className='ml-2 h-4 w-4' />
        ) : column.getIsSorted() === 'desc' ? (
          <SortDesc className='ml-2 h-4 w-4' />
        ) : (
          <ArrowUpDown className='ml-2 h-4 w-4' />
        )}
      </Button>
    ),
    cell: ({ row }) => formateDateVi(row.getValue('publicationDate')),
  },
  {
    id: 'actions',
    header: 'Thao tác',
    cell: ({ row }) => {
      const book = row.original;
      return <BookMenuAction book={book} />;
    },
  },
];
