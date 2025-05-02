'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Book } from '@/types/book-types';
import {
  Camera,
  CameraOff,
  Keyboard,
  Loader2,
  Search,
  SwitchCamera,
  XCircle,
} from 'lucide-react';
import { useISBNScanner } from '../_lib/use-isbn-scanner';

interface ISBNScannerProps {
  onBookFound: (book: Book) => void;
}

const ISBNScanner = ({ onBookFound }: ISBNScannerProps) => {
  const {
    // States
    isScanning,
    isLoading,
    manualISBN,
    inputMode,
    cameraDevices,
    selectedCameraId,
    cameraError,

    // Refs
    videoRef,

    // Methods
    setManualISBN,
    setInputMode,
    setSelectedCameraId,
    startScanning,
    stopScanning,
    handleManualSubmit,
    switchCamera,
    getSelectedCameraName,
  } = useISBNScanner({ onBookFound });

  return (
    <div className='flex flex-col gap-4 lg:flex-row'>
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
        <>
          {cameraDevices.length > 0 ? (
            <div className='flex flex-wrap items-center gap-2'>
              {cameraDevices.length > 1 ? (
                <Select
                  value={selectedCameraId}
                  onValueChange={setSelectedCameraId}
                  disabled={isLoading || isScanning}
                >
                  <SelectTrigger className='w-48'>
                    <SelectValue placeholder='Chọn camera' />
                  </SelectTrigger>
                  <SelectContent>
                    {cameraDevices.map((device) => (
                      <SelectItem key={device.deviceId} value={device.deviceId}>
                        {device.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <div className='text-sm text-muted-foreground'>
                  {getSelectedCameraName()}
                </div>
              )}
              <Button
                onClick={startScanning}
                className='w-full gap-2 md:w-auto'
                disabled={isLoading || !selectedCameraId || isScanning}
              >
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
            </div>
          ) : (
            <div className='flex items-center gap-2'>
              <Button disabled variant='outline'>
                <CameraOff className='mr-2 h-4 w-4' />
                {cameraError || 'Không tìm thấy camera'}
              </Button>
            </div>
          )}
        </>
      ) : (
        <div className='flex gap-2'>
          <Input
            value={manualISBN}
            onChange={(e) => setManualISBN(e.target.value)}
            placeholder='Nhập mã ISBN'
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

      {/* Camera scanning dialog */}
      <Dialog
        open={isScanning}
        onOpenChange={(open) => !open && stopScanning()}
      >
        <DialogContent className='sm:max-w-[400px]'>
          <DialogHeader>
            <DialogTitle>Quét mã ISBN</DialogTitle>
          </DialogHeader>
          <div className='relative'>
            {cameraError ? (
              <div className='flex h-[200px] items-center justify-center rounded-lg bg-muted p-4'>
                <p className='text-center text-sm text-muted-foreground'>
                  {cameraError}
                </p>
              </div>
            ) : (
              <div className='overflow-hidden rounded-lg bg-black'>
                <video
                  ref={videoRef}
                  className='h-auto w-full'
                  autoPlay
                  playsInline
                  muted
                />
              </div>
            )}
            <div className='absolute right-2 top-2 flex gap-2'>
              {cameraDevices.length > 1 && (
                <Button
                  variant='secondary'
                  size='icon'
                  className='h-8 w-8 opacity-80'
                  onClick={switchCamera}
                >
                  <SwitchCamera className='h-4 w-4' />
                </Button>
              )}
              <Button
                variant='ghost'
                size='icon'
                className='h-8 w-8 opacity-80'
                onClick={stopScanning}
              >
                <XCircle className='h-4 w-4' />
              </Button>
            </div>
          </div>
          <p className='text-center text-sm text-muted-foreground'>
            Hướng camera vào mã vạch ISBN trên sách
          </p>
          <p className='text-center text-xs text-muted-foreground'>
            Đang sử dụng: {getSelectedCameraName()}
          </p>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ISBNScanner;
