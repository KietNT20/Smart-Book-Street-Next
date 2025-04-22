'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { API_URL } from '@/constant/api-url';
import { BASE_URL } from '@/constant/environment';
import { Book } from '@/types/book-types';
import { BrowserMultiFormatReader } from '@zxing/library';
import { Camera, Keyboard, Loader2, Search, XCircle } from 'lucide-react';
import { useRef, useState } from 'react';
import { toast } from 'sonner';

interface ISBNScannerProps {
  onBookFound: (book: Book) => void;
}

const fetchBookByISBN = async (isbn: string): Promise<{ result: Book }> => {
  try {
    const response = await fetch(
      `${BASE_URL}/${API_URL.BOOKS.INDEX}/google/${isbn}`
    );

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('Không tìm thấy thông tin sách với mã ISBN này');
      }
      throw new Error('Có lỗi xảy ra khi tìm kiếm sách');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching book data:', error);
    throw error;
  }
};

const ISBNScanner = ({ onBookFound }: ISBNScannerProps) => {
  const [isScanning, setIsScanning] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [manualISBN, setManualISBN] = useState('');
  const [inputMode, setInputMode] = useState<'scan' | 'manual'>('scan');

  const scannerRef = useRef<BrowserMultiFormatReader | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

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
            const isbn = result.getText();
            handleScanSuccess(isbn);
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

    processISBN(manualISBN);
  };

  const processISBN = (isbn: string) => {
    setIsLoading(true);

    toast.promise(fetchBookByISBN(isbn), {
      loading: 'Đang tìm kiếm thông tin sách...',
      success: (data) => {
        console.log('Book data:', data);

        if (data && data.result) {
          onBookFound(data.result);
        }

        setIsLoading(false);
        setManualISBN('');
        return 'Đã tìm thấy thông tin sách';
      },
      error: (error) => {
        setIsLoading(false);
        if (error instanceof Error) {
          return error.message;
        }
        return 'Có lỗi xảy ra khi tìm kiếm thông tin sách';
      },
    });
  };

  return (
    <div className='flex flex-col gap-4'>
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
            placeholder='Nhập mã ISBN'
            className='flex-1'
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
        <DialogContent className='sm:max-w-[425px]'>
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

export default ISBNScanner;
