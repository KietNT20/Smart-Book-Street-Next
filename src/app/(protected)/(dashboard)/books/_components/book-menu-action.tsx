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
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { STORAGE } from '@/constant/storage';
import { PATH } from '@/enums/path';
import { useBookMutations } from '@/hooks/use-books';
import useDebounce from '@/hooks/use-debounce';
import { useInventoryMutation } from '@/hooks/use-inventory';
import { Book } from '@/types/book-types';
import { getLocalStorageItem } from '@/utils/token';
import { Edit, Eye, MoreVertical, PackagePlus, Trash } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

type Props = {
  book: Book;
};

const BookMenuAction = ({ book }: Props) => {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [addStoreOpen, setAddStoreOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [quantity, setQuantity] = useState('0');

  const storeId = getLocalStorageItem(STORAGE.SELECTED_STORE_KEY) as string;
  const { addProductToStore } = useInventoryMutation();
  const { deleteBook, deleteBookPending } = useBookMutations();
  const isSubmitting = useDebounce(deleteBookPending, 300);

  // Navigation handlers
  const handleViewDetails = () => {
    router.push(`${PATH.BOOKS}/${book.id}`);
    setMenuOpen(false);
  };

  const handleEdit = () => {
    router.push(`${PATH.BOOKS}/${book.id}/edit`);
    setMenuOpen(false);
  };

  // Delete handlers
  const handleDeleteClick = () => {
    setDeleteConfirmOpen(true);
    setMenuOpen(false);
  };

  const handleDeleteConfirm = () => {
    if (!book.id) return;
    deleteBook(book.id);
    setDeleteConfirmOpen(false);
  };

  // Add to store handlers
  const handleAddToStoreClick = () => {
    setAddStoreOpen(true);
    setMenuOpen(false);
  };

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
    setAddStoreOpen(false);
  };

  const handleClickOutside = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (menuOpen) {
      setMenuOpen(false);
    }
  };

  return (
    <>
      {/* Custom dropdown menu using only basic HTML */}
      <div className='relative inline-block text-left'>
        <div>
          <button
            type='button'
            className='inline-flex h-8 w-8 items-center justify-center rounded-md text-sm font-medium transition-colors hover:bg-muted hover:text-muted-foreground focus:outline-none'
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <MoreVertical className='h-4 w-4' />
          </button>
        </div>

        {menuOpen && (
          <>
            {/* Overlay to capture clicks outside */}
            <div
              className='fixed inset-0 z-40'
              onClick={handleClickOutside}
            ></div>

            {/* Dropdown menu */}
            <div className='absolute right-0 z-50 mt-2 w-56 origin-top-right rounded-md bg-popover shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none'>
              <div className='py-1'>
                <div className='px-3 py-2 text-xs font-semibold'>Thao tác</div>

                <button
                  className='flex w-full items-center px-4 py-2 text-sm hover:bg-accent'
                  onClick={handleViewDetails}
                >
                  <Eye className='mr-2 h-4 w-4' />
                  Xem chi tiết
                </button>

                <button
                  className='flex w-full items-center px-4 py-2 text-sm hover:bg-accent'
                  onClick={handleEdit}
                >
                  <Edit className='mr-2 h-4 w-4' />
                  Chỉnh sửa
                </button>

                <button
                  className='flex w-full items-center px-4 py-2 text-sm text-red-600 hover:bg-accent'
                  onClick={handleDeleteClick}
                >
                  <Trash className='mr-2 h-4 w-4' />
                  Xóa
                </button>

                <button
                  className='flex w-full items-center px-4 py-2 text-sm hover:bg-accent'
                  onClick={handleAddToStoreClick}
                >
                  <PackagePlus className='mr-2 h-4 w-4' />
                  Thêm vào kho
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Add to store dialog */}
      <Dialog open={addStoreOpen} onOpenChange={setAddStoreOpen}>
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
            <Button variant='outline' onClick={() => setAddStoreOpen(false)}>
              Hủy
            </Button>
            <Button type='button' onClick={handleAddToStore}>
              Xác nhận thêm vào kho
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete confirmation */}
      <ConfirmModal
        isOpen={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
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
