import { Language, VietnameseLanguageLabels } from '@/enums/lang';
import { cn, formatPrice } from '@/lib/utils';
import { BookNextjs } from '@/types/book-types';
import { ColumnDef } from '@tanstack/react-table';
import { InventoryQuantityCell } from './_components/inventory-quantity-cell';
import MenuColoumn from './_components/menu-col';

export const columnsBook: ColumnDef<BookNextjs>[] = [
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
    header: 'ISBN',
  },
  {
    accessorKey: 'title',
    header: 'Tên sách',
  },
  {
    accessorKey: 'languages',
    header: 'Ngôn ngữ',
    cell: ({ row }) => {
      const languages = row.getValue('languages') as Language;
      return (
        <p className='text-sm font-medium text-muted-foreground'>
          {languages ? VietnameseLanguageLabels[languages] : '---'}
        </p>
      );
    },
  },
  {
    id: 'price',
    header: 'Giá sách',
    cell: ({ row }) => {
      const price = row.original?.price;
      return (
        <p className='text-sm font-medium text-muted-foreground'>
          {price ? formatPrice(price as number) : '---'}
        </p>
      );
    },
  },
  {
    accessorKey: 'quantity',
    header: 'Số lượng',
    cell: ({ row }) => {
      return <InventoryQuantityCell row={row} />;
    },
  },
  {
    accessorKey: 'isInStock',
    header: 'Tình trạng',
    cell: ({ row }) => {
      const isInStock = row.getValue('isInStock') as boolean;
      return (
        <p
          className={cn(
            'text-sm font-medium',
            isInStock ? 'text-green-500' : 'text-red-500'
          )}
        >
          {isInStock ? 'Còn hàng' : 'Hết hàng'}
        </p>
      );
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const book = row.original;
      return <MenuColoumn book={book} />;
    },
  },
];
