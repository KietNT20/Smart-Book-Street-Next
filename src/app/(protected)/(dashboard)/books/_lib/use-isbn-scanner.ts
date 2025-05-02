// useISBNScanner.ts
import { fetchBookByISBN } from '@/api/book';
import { Book } from '@/types/book-types';
import { BrowserMultiFormatReader } from '@zxing/library';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';

export interface CameraDevice {
  deviceId: string;
  label: string;
  isFrontCamera: boolean;
}

interface UseISBNScannerProps {
  onBookFound: (book: Book) => void;
}

export interface UseISBNScannerReturn {
  // States
  isScanning: boolean;
  isLoading: boolean;
  manualISBN: string;
  inputMode: 'scan' | 'manual';
  cameraDevices: CameraDevice[];
  selectedCameraId: string;
  isCameraPermissionGranted: boolean;
  cameraError: string | null;

  // Refs
  videoRef: React.RefObject<HTMLVideoElement>;

  // Methods
  setManualISBN: (isbn: string) => void;
  setInputMode: (mode: 'scan' | 'manual') => void;
  setSelectedCameraId: (id: string) => void;
  startScanning: () => Promise<void>;
  stopScanning: () => void;
  handleManualSubmit: () => void;
  switchCamera: () => Promise<void>;
  getSelectedCameraName: () => string;
}

export const useISBNScanner = ({
  onBookFound,
}: UseISBNScannerProps): UseISBNScannerReturn => {
  // States
  const [isScanning, setIsScanning] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [manualISBN, setManualISBN] = useState('');
  const [inputMode, setInputMode] = useState<'scan' | 'manual'>('scan');
  const [cameraDevices, setCameraDevices] = useState<CameraDevice[]>([]);
  const [selectedCameraId, setSelectedCameraId] = useState<string>('');
  const [isCameraPermissionGranted, setIsCameraPermissionGranted] =
    useState<boolean>(false);
  const [cameraError, setCameraError] = useState<string | null>(null);

  // Refs
  const scannerRef = useRef<BrowserMultiFormatReader | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const activeStreamRef = useRef<MediaStream | null>(null);

  // Check and list available camera devices
  useEffect(() => {
    const checkCameraPermission = async () => {
      try {
        // Request camera access permission
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });

        // Stop stream after permission check
        stream.getTracks().forEach((track) => track.stop());

        setIsCameraPermissionGranted(true);
        setCameraError(null);

        // Get list of camera devices
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = devices.filter(
          (device) => device.kind === 'videoinput'
        );

        if (videoDevices.length === 0) {
          setCameraError('Không tìm thấy camera');
          return;
        }

        const formattedDevices = videoDevices.map((device) => {
          // Identify front/back camera based on label
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

        // Default to back camera if available
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

    // Cleanup when component unmounts
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

    // First, use getUserMedia to initialize camera and check if it works
    try {
      if (activeStreamRef.current) {
        activeStreamRef.current.getTracks().forEach((track) => track.stop());
        activeStreamRef.current = null;
      }

      // Initialize new stream with selected camera
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          deviceId: { exact: selectedCameraId },
        },
      });

      activeStreamRef.current = stream;

      // Display stream on video element first
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
        // Start scanning for codes after video is displayed
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
      }, 1000); // Wait 1 second to ensure video is displayed

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

  // Switch camera
  const switchCamera = async () => {
    if (cameraDevices.length <= 1) return;

    const currentIndex = cameraDevices.findIndex(
      (device) => device.deviceId === selectedCameraId
    );
    const nextIndex = (currentIndex + 1) % cameraDevices.length;
    const newCameraId = cameraDevices[nextIndex].deviceId;

    // Stop current scanning
    if (scannerRef.current) {
      scannerRef.current.reset();
      scannerRef.current = null;
    }

    if (activeStreamRef.current) {
      activeStreamRef.current.getTracks().forEach((track) => track.stop());
      activeStreamRef.current = null;
    }

    setSelectedCameraId(newCameraId);

    // Restart camera with new device
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

      // Restart scanner
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

  // Display selected camera name
  const getSelectedCameraName = () => {
    const selected = cameraDevices.find(
      (device) => device.deviceId === selectedCameraId
    );
    return selected ? selected.label : 'Chọn camera';
  };

  return {
    // States
    isScanning,
    isLoading,
    manualISBN,
    inputMode,
    cameraDevices,
    selectedCameraId,
    isCameraPermissionGranted,
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
  };
};
