'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { STORAGE } from '@/constant/storage';
import { useInventoryMutation } from '@/hooks/use-inventory';
import { useOrderDetailMutation } from '@/hooks/use-order-detail';
import { BookNextjs } from '@/types/book-types';
import { getLocalStorageItem } from '@/utils/token';
import { zodResolver } from '@hookform/resolvers/zod';
import { MoreHorizontal, ShoppingCart, Trash } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

type Props = {
  book: BookNextjs;
};

const MenuColoumn = ({ book }: Props) => {
  const [open, setOpen] = useState(false);
  const { deleteProduct } = useInventoryMutation();
  const { createOrderDetail, createOrderDetailPending } =
    useOrderDetailMutation();
  const storeId = getLocalStorageItem(STORAGE.SELECTED_STORE_KEY) as string;
  const isLoading = createOrderDetailPending;

  const formSchema = z.object({
    quantity: z
      .string()
      .refine((val) => !isNaN(Number(val)), {
        message: 'Số lượng phải là một số',
      })
      .refine((val) => Number(val) > 0, {
        message: 'Số lượng phải lớn hơn 0',
      })
      .refine((val) => Number(val) <= (book?.quantity || 0), {
        message: `Số lượng vượt quá tồn kho (${book?.quantity || 0} sản phẩm)`,
      }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      quantity: '1',
    },
  });

  const handleDelete = (entityId: string) => {
    deleteProduct({
      entityId: entityId,
      storeId: storeId,
    });
  };

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    const formData = new FormData();
    formData.append('InventoryId', book.inventoryId || '');
    formData.append('Quantity', values.quantity);

    createOrderDetail(formData, {
      onSuccess: () => {
        toast.success(
          `Thêm ${values.quantity} sản phẩm "${book.title}" vào đơn hàng thành công`
        );
      },
    });

    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant='ghost' className='h-8 w-8 p-0'>
            <span className='sr-only'>Open menu</span>
            <MoreHorizontal className='h-4 w-4' />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align='end'>
          <DropdownMenuLabel>Thao tác</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => handleDelete(book.entityId || '')}
            className='cursor-pointer text-red-600'
          >
            <Trash className='mr-2 h-4 w-4' />
            Xóa sản phẩm
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DialogTrigger asChild>
            <DropdownMenuItem>
              <ShoppingCart className='mr-2 h-4 w-4' />
              Thêm vào đơn
            </DropdownMenuItem>
          </DialogTrigger>
        </DropdownMenuContent>
      </DropdownMenu>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Thêm sách vào đơn hàng</DialogTitle>
          <DialogDescription>
            Nhập số lượng sách &quot;{book?.title || ''}&quot; bạn muốn thêm vào
            đơn hàng.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
            <FormField
              control={form.control}
              name='quantity'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Số lượng</FormLabel>
                  <FormControl>
                    <Input type='number' min='1' {...field} />
                  </FormControl>
                  <div className='text-sm text-muted-foreground'>
                    Số lượng trong kho: {book?.quantity || 0} sản phẩm
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type='submit' disabled={isLoading}>
              {isLoading ? 'Đang xử lý...' : 'Xác nhận'}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default MenuColoumn;
