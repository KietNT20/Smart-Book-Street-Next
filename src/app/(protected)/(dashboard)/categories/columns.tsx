import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ColumnDef } from '@tanstack/react-table';
import {
  ArrowUpDown,
  Edit,
  MoreHorizontal,
  SortAsc,
  SortDesc,
  Trash,
} from 'lucide-react';

export interface CategoryCol {
  id: string;
  categoryName: string;
  description?: string;
}

const getSortIcon = (isSorted: false | 'asc' | 'desc') => {
  if (!isSorted) return <ArrowUpDown className='ml-1 h-4 w-4 text-zinc-500' />;
  if (isSorted === 'asc')
    return <SortAsc className='ml-1 h-4 w-4 text-blue-500' />;
  return <SortDesc className='ml-1 h-4 w-4 text-blue-500' />;
};

export const columns = ({
  onEdit,
  onDelete,
}: {
  onEdit: (category: CategoryCol) => void;
  onDelete: (id: string) => void;
}): ColumnDef<CategoryCol>[] => [
  {
    accessorKey: 'no',
    header: 'No.',
    cell: ({ row }) => {
      const index = row.index + 1;
      return <p className='text-muted-foreground'>{index}</p>;
    },
  },
  {
    accessorKey: 'categoryName',
    header: ({ column }) => {
      const sorted = column.getIsSorted();
      return (
        <Button
          variant='ghost'
          onClick={() => {
            if (sorted === false) {
              column.toggleSorting(false);
            } else if (sorted === 'asc') {
              column.toggleSorting(true);
            } else {
              column.clearSorting();
            }
          }}
        >
          Tên danh mục
          {getSortIcon(sorted)}
        </Button>
      );
    },
    enableSorting: true,
    enableColumnFilter: true,
    filterFn: 'includesString',
  },
  {
    accessorKey: 'description',
    header: 'Mô tả',
    enableSorting: false,
    cell: ({ row }) => {
      const description = row.getValue('description') as string;
      if (!description) return '—';
      return description?.length > 50
        ? `${description.substring(0, 50)}...`
        : description;
    },
  },
  {
    id: 'actions',
    header: 'Thao tác',
    enableSorting: false,
    enableColumnFilter: false,
    cell: ({ row }) => {
      const category = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant='ghost' className='h-8 w-8 p-0'>
              <span className='sr-only'>Open menu</span>
              <MoreHorizontal className='h-4 w-4' />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end'>
            <DropdownMenuLabel>Thao tác</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => onEdit(category)}>
              <Edit className='mr-2 h-4 w-4' />
              Sửa danh mục
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onDelete(category.id)}
              className='text-red-600 focus:text-red-600'
            >
              <Trash className='mr-2 h-4 w-4' />
              Xóa danh mục
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
