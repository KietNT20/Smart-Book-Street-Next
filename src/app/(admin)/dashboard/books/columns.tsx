import { Button } from '@/components/ui/button';
import { formatDate } from '@/lib/utils';
import { Book } from '@/types/book-types';
import { ColumnDef } from '@tanstack/react-table';
import { ArrowDown, ArrowUp, ArrowUpDown } from 'lucide-react';
import BookMenuAction from './_components/book-menu-action';

type ColumnHandlers = {
  _onDelete: (id?: string) => void;
};

export const createColumns = ({
  _onDelete,
}: ColumnHandlers): ColumnDef<Book>[] => [
  {
    accessorKey: 'code',
    header: ({ column }) => (
      <Button
        variant='ghost'
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        className='flex items-center'
      >
        Mã sách
        {column.getIsSorted() === 'asc' ? (
          <ArrowUp className='ml-2 h-4 w-4' />
        ) : column.getIsSorted() === 'desc' ? (
          <ArrowDown className='ml-2 h-4 w-4' />
        ) : (
          <ArrowUpDown className='ml-2 h-4 w-4' />
        )}
      </Button>
    ),
    filterFn: 'includesString',
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
          <ArrowUp className='ml-2 h-4 w-4' />
        ) : column.getIsSorted() === 'desc' ? (
          <ArrowDown className='ml-2 h-4 w-4' />
        ) : (
          <ArrowUpDown className='ml-2 h-4 w-4' />
        )}
      </Button>
    ),
    filterFn: 'includesString',
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
          <ArrowUp className='ml-2 h-4 w-4' />
        ) : column.getIsSorted() === 'desc' ? (
          <ArrowDown className='ml-2 h-4 w-4' />
        ) : (
          <ArrowUpDown className='ml-2 h-4 w-4' />
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
    id: 'languages',
    accessorKey: 'languages',
    header: 'Ngôn ngữ',
  },
  {
    id: 'status',
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
          <ArrowUp className='ml-2 h-4 w-4' />
        ) : column.getIsSorted() === 'desc' ? (
          <ArrowDown className='ml-2 h-4 w-4' />
        ) : (
          <ArrowUpDown className='ml-2 h-4 w-4' />
        )}
      </Button>
    ),
    cell: ({ row }) => formatDate(row.getValue('publicationDate')),
  },
  {
    accessorKey: 'createdDate',
    header: ({ column }) => (
      <Button
        variant='ghost'
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        className='flex items-center'
      >
        Ngày tạo
        {column.getIsSorted() === 'asc' ? (
          <ArrowUp className='ml-2 h-4 w-4' />
        ) : column.getIsSorted() === 'desc' ? (
          <ArrowDown className='ml-2 h-4 w-4' />
        ) : (
          <ArrowUpDown className='ml-2 h-4 w-4' />
        )}
      </Button>
    ),
    cell: ({ row }) => formatDate(row.getValue('createdDate')),
  },
  {
    id: 'actions',
    header: 'Thao tác',
    cell: ({ row }) => {
      const book = row.original;
      const bookProps = { book, _onDelete };

      return <BookMenuAction {...bookProps} />;
    },
  },
];
