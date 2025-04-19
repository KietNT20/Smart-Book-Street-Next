import { cn, formatPrice } from '@/lib/utils';
import { Inventory } from '@/types/inventory-types';
import { ColumnDef } from '@tanstack/react-table';
import { InventoryQuantityCell } from './_components/inventory-quantity-cell';

export const columns: ColumnDef<Inventory>[] = [
  {
    accessorKey: 'no',
    header: 'No.',
    cell: ({ row }) => {
      const index = row.index + 1;
      return <p className='text-muted-foreground'>{index}</p>;
    },
  },
  {
    accessorKey: 'book.title',
    header: 'Tên sách',
  },
  {
    accessorKey: 'book.languages',
    header: 'Ngôn ngữ',
  },
  {
    accessorKey: 'book.price',
    header: 'Giá sách',
    cell: ({ row }) => {
      return (
        <p className='text-sm font-medium text-muted-foreground'>
          {formatPrice(row.getValue('book.price') as number)}
        </p>
      );
    },
  },
  {
    accessorKey: 'store.storeName',
    header: 'Cửa hàng',
  },
  {
    accessorKey: 'quantity',
    header: () => <div className='w-full text-right'>Số lượng</div>,
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
];
