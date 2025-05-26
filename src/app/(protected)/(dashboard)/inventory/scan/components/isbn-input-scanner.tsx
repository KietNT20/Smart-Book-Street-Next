import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { BrowserMultiFormatReader } from '@zxing/library';
import { Camera, Keyboard, XCircle } from 'lucide-react';
import { useRef, useState } from 'react';
import { toast } from 'sonner';

interface Props {
  storeId: string;
  onSubmit: (data: { isbn: string; storeId: string; quantity: number }) => void;
}

export const ISBNInputScanner = ({ storeId, onSubmit }: Props) => {
  const [isScanning, setIsScanning] = useState(false);
  const [showQuantityDialog, setShowQuantityDialog] = useState(false);
  const [scannedISBN, setScannedISBN] = useState('');
  const [manualISBN, setManualISBN] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [inputMode, setInputMode] = useState<'scan' | 'manual'>('scan');

  const scannerRef = useRef<BrowserMultiFormatReader | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const startScanning = async () => {
    try {
      setIsScanning(true);
      const codeReader = new BrowserMultiFormatReader();
      scannerRef.current = codeReader;

      const videoInputDevices = await codeReader.listVideoInputDevices();
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

  const handleScanSuccess = (isbn: string) => {
    stopScanning();
    setScannedISBN(isbn);
    setShowQuantityDialog(true);
  };

  const handleManualSubmit = () => {
    if (!manualISBN) {
      toast.error('Vui lòng nhập mã ISBN');
      return;
    }
    setScannedISBN(manualISBN);
    setShowQuantityDialog(true);
  };

  const handleConfirm = () => {
    onSubmit({
      isbn: scannedISBN,
      storeId,
      quantity,
    });
    setShowQuantityDialog(false);
    setManualISBN('');
    setScannedISBN('');
    setQuantity(1);
  };

  return (
    <div className='flex flex-col gap-4'>
      <div className='flex items-center justify-center gap-2'>
        <Button
          variant={inputMode === 'scan' ? 'default' : 'outline'}
          onClick={() => setInputMode('scan')}
          className='gap-2'
        >
          <Camera className='size-4' />
          Quét mã
        </Button>
        <Button
          variant={inputMode === 'manual' ? 'default' : 'outline'}
          onClick={() => setInputMode('manual')}
          className='gap-2'
        >
          <Keyboard className='size-4' />
          Nhập thủ công
        </Button>
      </div>

      {inputMode === 'scan' ? (
        <Button onClick={startScanning} className='w-full'>
          Bắt đầu quét
        </Button>
      ) : (
        <div className='flex gap-2'>
          <Input
            value={manualISBN}
            onChange={(e) => setManualISBN(e.target.value)}
            placeholder='Nhập mã ISBN'
            className='flex-1'
          />
          <Button onClick={handleManualSubmit}>Tiếp tục</Button>
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
              <XCircle className='size-4' />
            </Button>
          </div>
          <p className='text-center text-sm text-muted-foreground'>
            Hướng camera vào mã vạch ISBN trên sách
          </p>
        </DialogContent>
      </Dialog>

      {/* Dialog nhập số lượng */}
      <Dialog open={showQuantityDialog} onOpenChange={setShowQuantityDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nhập số lượng</DialogTitle>
          </DialogHeader>
          <div className='py-4'>
            <p className='mb-2'>ISBN: {scannedISBN}</p>
            <Input
              type='number'
              min={1}
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
              placeholder='Nhập số lượng'
            />
          </div>
          <DialogFooter>
            <Button
              variant='outline'
              onClick={() => setShowQuantityDialog(false)}
            >
              Hủy
            </Button>
            <Button onClick={handleConfirm}>Xác nhận</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
