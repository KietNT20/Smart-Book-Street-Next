// components/inventory-quantity-cell.tsx
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { STORAGE } from '@/constant/storage';
import { useInventoryMutation } from '@/hooks/use-inventory';
import { Inventory } from '@/types/inventory-types';
import { useRef } from 'react';
import { toast } from 'sonner';

interface InventoryQuantityCellProps {
  row: {
    original: Inventory;
  };
}

export const InventoryQuantityCell = ({ row }: InventoryQuantityCellProps) => {
  const { updateQuantityMutation } = useInventoryMutation();
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const form = e.currentTarget;
        const input = form.querySelector('input');
        const value = input?.value;

        if (!value || !/^\d+$/.test(value)) {
          toast.error('Vui lòng nhập số hợp lệ');
          return;
        }

        const quantity = parseInt(value);

        if (quantity < 0) {
          toast.error('Số lượng không thể âm');
          return;
        }

        const storeId = localStorage.getItem(STORAGE.SELECTED_STORE_KEY);
        if (!storeId) {
          toast.error('Không tìm thấy ID cửa hàng');
          return;
        }

        // Gọi mutation để cập nhật số lượng
        toast.promise(
          updateQuantityMutation.mutateAsync({
            entityId: row.original.book.id as string,
            storeId,
            quantity,
            isInStock: true,
          }),
          {
            loading: `Đang cập nhật số lượng...`,
            success: 'Cập nhật số lượng thành công',
            error: 'Lỗi khi cập nhật số lượng',
          }
        );
      }}
    >
      <Label htmlFor={`${row.original.id}-quantity`} className='sr-only'>
        Số lượng
      </Label>
      <Input
        ref={inputRef}
        className='h-8 w-16 border-transparent bg-transparent text-right shadow-none hover:bg-input/30 focus-visible:border focus-visible:bg-background'
        defaultValue={row.original.quantity}
        id={`${row.original.id}-quantity`}
        type='text'
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
        // Auto submit khi blur
        onBlur={(e) => {
          const form = e.currentTarget.form;
          if (form) {
            form.requestSubmit();
          }
        }}
      />
    </form>
  );
};
