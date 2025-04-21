import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { STORAGE } from '@/constant/storage';
import { useInventoryMutation } from '@/hooks/use-inventory';
import { BookNextjs } from '@/types/book-types';
import { SouvenirNextjs } from '@/types/souvenir-types';
import { getLocalStorageItem } from '@/utils/token';
import { useRef } from 'react';
import { toast } from 'sonner';

interface InventoryQuantityCellProps {
  row: {
    original: BookNextjs | SouvenirNextjs;
  };
}

export const InventoryQuantityCell = ({ row }: InventoryQuantityCellProps) => {
  const { updateProductQuantity } = useInventoryMutation();
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const form = e.currentTarget;
        const formData = new FormData(form);
        const input = form.querySelector('input');
        const value = input?.value;

        if (value) {
          formData.append('quantity', value);
        }

        if (!value || !/^\d+$/.test(value)) {
          toast.error('Vui lòng nhập số hợp lệ');
          return;
        }

        const quantity = parseInt(value);

        if (quantity < 0) {
          toast.error('Số lượng không thể âm');
          return;
        }

        const storeId = getLocalStorageItem(STORAGE.SELECTED_STORE_KEY);
        if (!storeId) {
          toast.error('Không tìm thấy ID cửa hàng');
          return;
        }

        toast.promise(
          updateProductQuantity.mutateAsync({
            entityId: row.original.entityId,
            storeId,
            data: formData,
          }),
          {
            loading: `Đang cập nhật số lượng...`,
            success: 'Cập nhật số lượng thành công',
            error: 'Lỗi khi cập nhật số lượng',
          }
        );
      }}
    >
      <Label htmlFor={`${row.original.entityId}-quantity`} className='sr-only'>
        Số lượng
      </Label>
      <Input
        ref={inputRef}
        className='h-8 w-16 border-transparent bg-transparent text-right shadow-none hover:bg-input/30 focus-visible:border focus-visible:bg-background'
        defaultValue={row.original.quantity}
        id={`${row.original.entityId}-quantity`}
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
