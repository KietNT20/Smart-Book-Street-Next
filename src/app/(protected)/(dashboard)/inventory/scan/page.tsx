'use client';

import { STORAGE } from '@/constant/storage';
import { inventoryService } from '@/services/inventoryService';
import { useMutation } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { ISBNInputScanner } from './components/isbn-input-scanner';
import { ScanHistory } from './components/scan-history';

export default function InventoryScanPage() {
  const [storeId, setStoreId] = useState<string>('');
  const [scanHistory, setScanHistory] = useState<
    Array<{ isbn: string; quantity: number; timestamp: Date }>
  >([]);

  // Get storeId from localStorage on client side
  useEffect(() => {
    const storedId = localStorage.getItem(STORAGE.SELECTED_STORE_KEY);
    if (storedId) {
      setStoreId(storedId);
    } else {
      toast.error('Không tìm thấy cửa hàng');
    }
  }, []);

  const scanMutation = useMutation({
    mutationFn: (data: { isbn: string; storeId: string; quantity: number }) =>
      inventoryService.scan(data),
    onSuccess: () => {
      toast.success('Cập nhật tồn kho thành công');
    },
    onError: () => {
      toast.error('Lỗi khi cập nhật tồn kho');
    },
  });

  const handleSubmit = (data: {
    isbn: string;
    storeId: string;
    quantity: number;
  }) => {
    scanMutation.mutate(data, {
      onSuccess: () => {
        setScanHistory((prev) => [
          {
            isbn: data.isbn,
            quantity: data.quantity,
            timestamp: new Date(),
          },
          ...prev.slice(0, 9),
        ]);
      },
    });
  };

  // Don't render until we have storeId
  if (!storeId) {
    return (
      <div className='container mx-auto p-4'>
        <p>Đang tải...</p>
      </div>
    );
  }

  return (
    <div className='container mx-auto p-4'>
      <h1 className='mb-6 text-2xl font-bold'>Nhập kho sách</h1>

      <div className='mx-auto max-w-md'>
        <ISBNInputScanner storeId={storeId} onSubmit={handleSubmit} />

        {scanHistory.length > 0 && <ScanHistory items={scanHistory} />}
      </div>

      {/* Hiển thị trạng thái loading khi đang gửi request */}
      {scanMutation.isPending && (
        <div className='mt-4 text-center'>
          <p className='text-sm text-muted-foreground'>
            Đang cập nhật tồn kho...
          </p>
        </div>
      )}
    </div>
  );
}
