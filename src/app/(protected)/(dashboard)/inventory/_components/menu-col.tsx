import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { STORAGE } from '@/constant/storage';
import { useInventoryMutation } from '@/hooks/use-inventory';
import { getLocalStorageItem } from '@/utils/token';
import { MoreHorizontal } from 'lucide-react';

type Props = {
  entityId: string;
};

const MenuColoumn = ({ entityId }: Props) => {
  const { deleteProduct } = useInventoryMutation();
  const storeId = getLocalStorageItem(STORAGE.SELECTED_STORE_KEY) as string;

  const handleDelete = (entityId: string) => {
    deleteProduct({
      entityId: entityId,
      storeId: storeId,
    });
  };

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
        <DropdownMenuItem onClick={() => handleDelete(entityId)}>
          Xóa sản phẩm
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        {/* <DropdownMenuItem>View customer</DropdownMenuItem>
        <DropdownMenuItem>View payment details</DropdownMenuItem> */}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default MenuColoumn;
