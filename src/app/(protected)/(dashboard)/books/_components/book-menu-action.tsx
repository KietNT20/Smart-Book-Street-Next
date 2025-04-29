'use client';

import { ConfirmModal } from '@/components/confirm-modal';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { STORAGE } from '@/constant/storage';
import { PATH } from '@/enums/path';
import { useBookMutations } from '@/hooks/use-books';
import { useInventoryMutation } from '@/hooks/use-inventory';
import { Book } from '@/types/book-types';
import { getLocalStorageItem } from '@/utils/token';
import { Edit, Eye, MoreHorizontal, PackagePlus, Trash } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { toast } from 'sonner';

type Props = {
  book: Book;
};

const BookMenuAction = ({ book }: Props) => {
  const storeId = getLocalStorageItem(STORAGE.SELECTED_STORE_KEY) as string;
  const { addProductToStore } = useInventoryMutation();
  const [quantity, setQuantity] = useState('0');
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const { deleteBook, deleteBookPending } = useBookMutations();
  const isSubmitting = deleteBookPending;

  const handleAddToStore = () => {
    if (!quantity || !/^\d+$/.test(quantity)) {
      toast.error('Vui lòng nhập số hợp lệ');
      return;
    }

    const quantityValue = parseInt(quantity);

    if (quantityValue < 0) {
      toast.error('Số lượng không thể âm');
      return;
    }

    toast.promise(
      addProductToStore.mutateAsync({
        entityId: book.id as string,
        storeId: storeId,
        isInStock: true,
        quantity: quantityValue,
      }),
      {
        loading: 'Đang thêm vào kho của bạn...',
        success: () => {
          return 'Thêm vào kho thành công';
        },
        error: 'Sản phẩm đã tồn tại trong kho',
      }
    );
    setIsOpen(false);
  };

  const handleDeleteConfirm = () => {
    if (!book.id) return;
    deleteBook(book.id);
    setIsDeleteModalOpen(false);
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant='ghost' className='h-8 w-8 p-0'>
              <MoreHorizontal className='h-4 w-4' />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end'>
            <DropdownMenuLabel>Thao tác</DropdownMenuLabel>
            <DropdownMenuItem asChild>
              <Link href={`${PATH.BOOKS}/${book.id}`}>
                <Eye className='mr-2 h-4 w-4' />
                Xem chi tiết
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href={`${PATH.BOOKS}/${book.id}/edit`}>
                <Edit className='mr-2 h-4 w-4' />
                Chỉnh sửa
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => setIsDeleteModalOpen(true)}
              className='cursor-pointer text-red-600'
            >
              <Trash className='mr-2 h-4 w-4' />
              Xóa
            </DropdownMenuItem>
            <DialogTrigger asChild>
              <DropdownMenuItem onClick={() => setIsOpen(true)}>
                <PackagePlus className='mr-2 h-4 w-4' />
                <span>Thêm vào kho</span>
              </DropdownMenuItem>
            </DialogTrigger>
          </DropdownMenuContent>
        </DropdownMenu>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Thêm sản phẩm vào kho</DialogTitle>
            <DialogDescription>
              Nhập số lượng sản phẩm bạn muốn thêm vào kho
            </DialogDescription>
          </DialogHeader>
          <div className='py-4'>
            <Label htmlFor='quantity' className='mb-2 block'>
              Số lượng
            </Label>
            <Input
              id='quantity'
              type='text'
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              onKeyDown={(e) => {
                if (
                  !/^\d$/.test(e.key) &&
                  e.key !== 'Backspace' &&
                  e.key !== 'Enter' &&
                  e.key !== 'Tab' &&
                  e.key !== 'ArrowLeft' &&
                  e.key !== 'ArrowRight'
                ) {
                  e.preventDefault();
                }
              }}
              placeholder='Nhập số lượng'
              className='w-full'
            />
          </div>
          <DialogFooter>
            <Button variant='outline' onClick={() => setIsOpen(false)}>
              Hủy
            </Button>
            <Button type='button' onClick={handleAddToStore}>
              Xác nhận thêm vào kho
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        title='Bạn có chắc chắn muốn xóa?'
        description={`Bạn có chắc chắn muốn xóa ${book?.title || 'sách này'} không? Hành động này không thể hoàn tác.`}
        variant='destructive'
        confirmText='Xác nhận xóa'
        isLoading={isSubmitting}
      />
    </>
  );
};

export default BookMenuAction;
