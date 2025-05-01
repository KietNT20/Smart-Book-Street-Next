'use client';

import { fetchBookByISBN } from '@/api/book';
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
import { BrowserMultiFormatReader } from '@zxing/library';
import {
  Camera,
  CameraOff,
  Keyboard,
  Loader2,
  Search,
  SwitchCamera,
  XCircle,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';

interface ISBNScannerProps {
  onBookFound: (book: Book) => void;
}

interface CameraDevice {
  deviceId: string;
  label: string;
  isFrontCamera: boolean;
}

const ISBNScanner = ({ onBookFound }: ISBNScannerProps) => {
  const [isScanning, setIsScanning] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [manualISBN, setManualISBN] = useState('');
  const [inputMode, setInputMode] = useState<'scan' | 'manual'>('scan');
  const [cameraDevices, setCameraDevices] = useState<CameraDevice[]>([]);
  const [selectedCameraId, setSelectedCameraId] = useState<string>('');
  const [isCameraPermissionGranted, setIsCameraPermissionGranted] =
    useState<boolean>(false);
  const [cameraError, setCameraError] = useState<string | null>(null);

  const scannerRef = useRef<BrowserMultiFormatReader | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const activeStreamRef = useRef<MediaStream | null>(null);

  // Kiểm tra và liệt kê thiết bị camera có sẵn
  useEffect(() => {
    const checkCameraPermission = async () => {
      try {
        // Yêu cầu quyền truy cập camera
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });

        // Dừng stream sau khi đã kiểm tra quyền truy cập
        stream.getTracks().forEach((track) => track.stop());

        setIsCameraPermissionGranted(true);
        setCameraError(null);

        // Lấy danh sách thiết bị camera
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = devices.filter(
          (device) => device.kind === 'videoinput'
        );

        if (videoDevices.length === 0) {
          setCameraError('Không tìm thấy camera');
          return;
        }

        const formattedDevices = videoDevices.map((device) => {
          // Xác định camera trước/sau dựa trên label
          const isFrontCamera =
            device.label.toLowerCase().includes('front') ||
            device.label.toLowerCase().includes('trước') ||
            device.label.toLowerCase().includes('user') ||
            device.label.toLowerCase().includes('selfie');

          return {
            deviceId: device.deviceId,
            label:
              device.label || (isFrontCamera ? 'Camera trước' : 'Camera sau'),
            isFrontCamera,
          };
        });

        setCameraDevices(formattedDevices);

        // Mặc định chọn camera sau (nếu có)
        const backCamera = formattedDevices.find(
          (device) => !device.isFrontCamera
        );
        if (backCamera) {
          setSelectedCameraId(backCamera.deviceId);
        } else if (formattedDevices.length > 0) {
          setSelectedCameraId(formattedDevices[0].deviceId);
        }
      } catch (err) {
        console.error('Không thể truy cập camera:', err);
        setIsCameraPermissionGranted(false);
        setCameraError(
          'Không thể truy cập camera. Vui lòng kiểm tra lại quyền truy cập.'
        );
      }
    };

    checkCameraPermission();

    // Cleanup khi component unmount
    return () => {
      if (activeStreamRef.current) {
        activeStreamRef.current.getTracks().forEach((track) => track.stop());
        activeStreamRef.current = null;
      }
    };
  }, []);

  const startScanning = async () => {
    if (!isCameraPermissionGranted) {
      toast.error('Camera chưa được cấp quyền truy cập');
      return;
    }

    // Trước tiên, sử dụng getUserMedia để khởi tạo camera và kiểm tra xem có hoạt động không
    try {
      if (activeStreamRef.current) {
        activeStreamRef.current.getTracks().forEach((track) => track.stop());
        activeStreamRef.current = null;
      }

      // Khởi tạo stream mới với camera được chọn
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          deviceId: { exact: selectedCameraId },
        },
      });

      activeStreamRef.current = stream;

      // Hiển thị stream trên video element trước
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play().catch((e) => {
          console.error('Video play error:', e);
          throw new Error('Không thể phát video từ camera');
        });
      }

      setIsScanning(true);
      const codeReader = new BrowserMultiFormatReader();
      scannerRef.current = codeReader;

      setTimeout(() => {
        // Bắt đầu quét mã sau khi đã hiển thị video
        codeReader.decodeFromVideoDevice(
          selectedCameraId,
          videoRef.current!,
          (result, error) => {
            if (result) {
              const isbn = result.getText();
              handleScanSuccess(isbn);
            }
            if (error && error.name !== 'NotFoundException') {
              console.error('Scanner error:', error);
            }
          }
        );
      }, 1000); // Đợi 1 giây để đảm bảo video đã được hiển thị

      setCameraError(null);
    } catch (err) {
      console.error('Không thể khởi động camera:', err);
      setCameraError(
        'Không thể khởi động camera. Vui lòng thử lại hoặc chọn camera khác.'
      );
      toast.error('Không thể khởi động camera');
      setIsScanning(false);
    }
  };

  const stopScanning = () => {
    if (scannerRef.current) {
      scannerRef.current.reset();
      scannerRef.current = null;
    }

    if (activeStreamRef.current) {
      activeStreamRef.current.getTracks().forEach((track) => track.stop());
      activeStreamRef.current = null;
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null;
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

  // Đổi camera
  const switchCamera = async () => {
    if (cameraDevices.length <= 1) return;

    const currentIndex = cameraDevices.findIndex(
      (device) => device.deviceId === selectedCameraId
    );
    const nextIndex = (currentIndex + 1) % cameraDevices.length;
    const newCameraId = cameraDevices[nextIndex].deviceId;

    // Dừng scanning hiện tại
    if (scannerRef.current) {
      scannerRef.current.reset();
      scannerRef.current = null;
    }

    if (activeStreamRef.current) {
      activeStreamRef.current.getTracks().forEach((track) => track.stop());
      activeStreamRef.current = null;
    }

    setSelectedCameraId(newCameraId);

    // Khởi động lại camera với thiết bị mới
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          deviceId: { exact: newCameraId },
        },
      });

      activeStreamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }

      // Khởi động lại scanner
      setTimeout(() => {
        const codeReader = new BrowserMultiFormatReader();
        scannerRef.current = codeReader;

        codeReader.decodeFromVideoDevice(
          newCameraId,
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
      }, 500);

      setCameraError(null);
    } catch (err) {
      console.error('Không thể chuyển camera:', err);
      setCameraError('Không thể chuyển camera. Vui lòng thử lại.');
      toast.error('Không thể chuyển camera');
    }
  };

  // Hiển thị tên camera đã chọn
  const getSelectedCameraName = () => {
    const selected = cameraDevices.find(
      (device) => device.deviceId === selectedCameraId
    );
    return selected ? selected.label : 'Chọn camera';
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
                className='gap-2'
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

      {/* Dialog quét camera */}
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
