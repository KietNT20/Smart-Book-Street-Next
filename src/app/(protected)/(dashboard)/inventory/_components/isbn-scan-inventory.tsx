'use client';

import { fetchBookIsbnInventory } from '@/api/book';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { STORAGE } from '@/constant/storage';
import { useOrderDetailMutation } from '@/hooks/use-order-detail';
import { getLocalStorageItem } from '@/utils/token';
import { BrowserMultiFormatReader } from '@zxing/library';
import { Camera, Keyboard, Loader2, Search, XCircle } from 'lucide-react';
import { useRef, useState } from 'react';
import { toast } from 'sonner';

const storeId = getLocalStorageItem(STORAGE.SELECTED_STORE_KEY) as string;

/**
 * Hàm định dạng ISBN thành dạng có gạch ngang
 * Ví dụ: "9786045784860" → "978-604-57-8486-0"
 */
const formatISBN = (isbn: string): string => {
  // Loại bỏ tất cả dấu gạch ngang hiện có
  const cleanIsbn = isbn.replace(/-/g, '');

  // Nếu là ISBN-13 (13 chữ số)
  if (cleanIsbn.length === 13) {
    return `${cleanIsbn.slice(0, 3)}-${cleanIsbn.slice(3, 6)}-${cleanIsbn.slice(6, 8)}-${cleanIsbn.slice(8, 12)}-${cleanIsbn.slice(12)}`;
  }

  // Nếu là ISBN-10 (10 chữ số)
  if (cleanIsbn.length === 10) {
    return `${cleanIsbn.slice(0, 1)}-${cleanIsbn.slice(1, 4)}-${cleanIsbn.slice(4, 9)}-${cleanIsbn.slice(9)}`;
  }

  // Trả về nguyên gốc nếu không đúng định dạng
  return isbn;
};

const ISBNScannerInventory = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [manualISBN, setManualISBN] = useState('');
  const [inputMode, setInputMode] = useState<'scan' | 'manual'>('scan');

  const scannerRef = useRef<BrowserMultiFormatReader | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const { createOrderDetail, createOrderDetailPending } =
    useOrderDetailMutation();

  const isLoading = createOrderDetailPending;

  const startScanning = async () => {
    try {
      setIsScanning(true);
      const codeReader = new BrowserMultiFormatReader();
      scannerRef.current = codeReader;

      const videoInputDevices = await codeReader.listVideoInputDevices();
      if (videoInputDevices.length === 0) {
        toast.error('Không tìm thấy camera');
        setIsScanning(false);
        return;
      }

      const selectedDeviceId = videoInputDevices[0].deviceId;

      await codeReader.decodeFromVideoDevice(
        selectedDeviceId,
        videoRef.current!,
        (result, error) => {
          if (result) {
            const rawIsbn = result.getText();
            // Định dạng ISBN thành dạng có gạch ngang
            const formattedIsbn = formatISBN(rawIsbn);
            handleScanSuccess(formattedIsbn);
          }
          if (error && error.name !== 'NotFoundException') {
            console.error(error);
          }
        }
      );
    } catch (err) {
      toast.error('Không thể khởi động camera');
      console.error(err);
      setIsScanning(false);
    }
  };

  const stopScanning = () => {
    if (scannerRef.current) {
      scannerRef.current.reset();
    }
    setIsScanning(false);
  };

  const handleScanSuccess = async (isbn: string) => {
    stopScanning();
    processISBN(isbn);
  };

  const handleManualSubmit = () => {
    if (!manualISBN) {
      toast.error('Vui lòng nhập mã ISBN');
      return;
    }

    // Định dạng ISBN nhập tay thành dạng có gạch ngang
    const formattedIsbn = formatISBN(manualISBN);
    processISBN(formattedIsbn);
  };

  const processISBN = (isbn: string) => {
    // Giữ nguyên ISBN có dấu gạch ngang khi gửi request
    toast.promise(fetchBookIsbnInventory(storeId, isbn), {
      loading: 'Đang tìm kiếm thông tin sách...',
      success: (data) => {
        const formData = new FormData();
        formData.append('InventoryId', data.inventoryId);
        formData.append('Quantity', '1');

        try {
          createOrderDetail(formData);
          toast.success(`Đã thêm 1 sách "${data.title}" vào đơn hàng`);
        } catch (error) {
          console.error('Error creating order detail:', error);
          toast.error('Không thể thêm sách vào đơn hàng');
        }
        setManualISBN('');
        return 'Đã tìm thấy thông tin sách';
      },
      error: (error) => {
        if (error instanceof Error) {
          return error.message;
        }
        return 'Có lỗi xảy ra khi tìm kiếm thông tin sách';
      },
    });
  };

  return (
    <div className='flex flex-col gap-4 md:flex-row'>
      <div className='flex items-center justify-center gap-2'>
        <Button
          variant={inputMode === 'scan' ? 'default' : 'outline'}
          onClick={() => setInputMode('scan')}
          className='gap-2'
          disabled={isLoading}
        >
          <Camera className='h-4 w-4' />
          Quét mã
        </Button>
        <Button
          variant={inputMode === 'manual' ? 'default' : 'outline'}
          onClick={() => setInputMode('manual')}
          className='gap-2'
          disabled={isLoading}
        >
          <Keyboard className='h-4 w-4' />
          Nhập thủ công
        </Button>
      </div>

      {inputMode === 'scan' ? (
        <Button onClick={startScanning} className='gap-2' disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className='h-4 w-4 animate-spin' />
              Đang xử lý...
            </>
          ) : (
            <>
              <Camera className='h-4 w-4' />
              Quét mã ISBN
            </>
          )}
        </Button>
      ) : (
        <div className='flex gap-2'>
          <Input
            value={manualISBN}
            onChange={(e) => setManualISBN(e.target.value)}
            placeholder='Nhập mã ISBN (VD: 978-604-57-8486-0)'
            className='flex-1 lg:w-80'
            disabled={isLoading}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleManualSubmit();
              }
            }}
          />
          <Button onClick={handleManualSubmit} disabled={isLoading}>
            {isLoading ? (
              <Loader2 className='h-4 w-4 animate-spin' />
            ) : (
              <Search className='h-4 w-4' />
            )}
          </Button>
        </div>
      )}

      {/* Dialog quét camera */}
      <Dialog
        open={isScanning}
        onOpenChange={(open) => !open && stopScanning()}
      >
        <DialogContent className='md:max-w-72'>
          <DialogHeader>
            <DialogTitle>Quét mã ISBN</DialogTitle>
          </DialogHeader>
          <div className='relative'>
            <video ref={videoRef} className='h-auto w-full rounded-lg' />
            <Button
              variant='ghost'
              size='icon'
              className='absolute right-2 top-2'
              onClick={stopScanning}
            >
              <XCircle className='h-4 w-4' />
            </Button>
          </div>
          <p className='text-center text-sm text-muted-foreground'>
            Hướng camera vào mã vạch ISBN trên sách
          </p>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ISBNScannerInventory;
