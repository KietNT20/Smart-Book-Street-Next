import { fetchBookIsbnInventory } from '@/api/book';
import { STORAGE } from '@/constant/storage';
import { getLocalStorageItem } from '@/utils/token';
import { BrowserMultiFormatReader } from '@zxing/library';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';

export interface CameraDevice {
  deviceId: string;
  label: string;
  isFrontCamera: boolean;
}

/**
 * Function to format ISBN to dashed format.
 * @param {string} isbn - ISBN string to format.
 * Example: "9786045784860" → "978-604-57-8486-0"
 */
export const formatISBN = (isbn: string): string => {
  // Remove all existing dashes
  const cleanIsbn = isbn.replace(/-/g, '');

  // If it's ISBN-13 (13 digits)
  if (cleanIsbn.length === 13) {
    return `${cleanIsbn.slice(0, 3)}-${cleanIsbn.slice(3, 6)}-${cleanIsbn.slice(6, 8)}-${cleanIsbn.slice(8, 12)}-${cleanIsbn.slice(12)}`;
  }

  // If it's ISBN-10 (10 digits)
  if (cleanIsbn.length === 10) {
    return `${cleanIsbn.slice(0, 1)}-${cleanIsbn.slice(1, 4)}-${cleanIsbn.slice(4, 9)}-${cleanIsbn.slice(9)}`;
  }

  // Return original if not in correct format
  return isbn;
};

interface UseIsbnScannerProps {
  onScanSuccess?: (isbn: string) => void;
}

export const useIsbnScanner = ({ onScanSuccess }: UseIsbnScannerProps = {}) => {
  const [isScanning, setIsScanning] = useState(false);
  const [manualISBN, setManualISBN] = useState('');
  const [inputMode, setInputMode] = useState<'scan' | 'manual'>('scan');
  const [cameraDevices, setCameraDevices] = useState<CameraDevice[]>([]);
  const [selectedCameraId, setSelectedCameraId] = useState<string>('');
  const [isCameraPermissionGranted, setIsCameraPermissionGranted] =
    useState<boolean>(false);
  const [cameraError, setCameraError] = useState<string | null>(null);

  const scannerRef = useRef<BrowserMultiFormatReader | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const activeStreamRef = useRef<MediaStream | null>(null);

  const storeId = getLocalStorageItem(STORAGE.SELECTED_STORE_KEY) as string;

  // Check and list available camera devices
  useEffect(() => {
    const checkCameraPermission = async () => {
      try {
        // Request camera access
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });

        // Stop stream after checking access
        stream.getTracks().forEach((track) => track.stop());

        setIsCameraPermissionGranted(true);
        setCameraError(null);

        // Check and list available camera devices
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = devices.filter(
          (device) => device.kind === 'videoinput'
        );

        if (videoDevices.length === 0) {
          setCameraError('Không tìm thấy camera');
          return;
        }

        const formattedDevices = videoDevices.map((device) => {
          // Determine front/back camera based on label
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

        // Default select rear camera (if available)
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

    if (!videoRef.current) {
      toast.error('Không tìm thấy video element');
      return;
    }

    // First, use getUserMedia to initialize the camera and check if it works.
    try {
      if (activeStreamRef.current) {
        activeStreamRef.current.getTracks().forEach((track) => track.stop());
        activeStreamRef.current = null;
      }

      // Initiate a new stream with the selected camera
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          deviceId: { exact: selectedCameraId },
        },
      });

      activeStreamRef.current = stream;

      // Display the stream on the video element
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
        // Start scanning after a short delay to ensure video is ready
        if (videoRef.current) {
          codeReader.decodeFromVideoDevice(
            selectedCameraId,
            videoRef.current,
            (result, error) => {
              if (result) {
                const rawIsbn = result.getText();
                // Format ISBN to dashed form
                const formattedIsbn = formatISBN(rawIsbn);
                handleScanSuccess(formattedIsbn);
              }
              if (error && error.name !== 'NotFoundException') {
                console.error('Scanner error:', error);
              }
            }
          );
        }
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

  const handleScanSuccess = (isbn: string) => {
    stopScanning();

    // If there is a callback from outside, call it
    if (onScanSuccess) {
      onScanSuccess(isbn);
    } else {
      // Default handling
      processISBN(isbn);
    }
  };

  const handleManualSubmit = () => {
    if (!manualISBN) {
      toast.error('Vui lòng nhập mã ISBN');
      return;
    }

    // Format ISBN to dashed form
    const formattedIsbn = formatISBN(manualISBN);

    // If there is a callback from outside, call it
    if (onScanSuccess) {
      onScanSuccess(formattedIsbn);
      setManualISBN('');
    } else {
      // Default handling
      processISBN(formattedIsbn);
    }
  };

  const processISBN = (isbn: string) => {
    // Keep the ISBN with dashes when sending the request
    toast.promise(fetchBookIsbnInventory(storeId, isbn), {
      loading: 'Đang tìm kiếm thông tin sách...',
      success: (data) => {
        setManualISBN('');
        return `Đã tìm thấy thông tin sách: ${data.title}`;
      },
      error: (error) => {
        if (error instanceof Error) {
          return error.message;
        }
        return 'Có lỗi xảy ra khi tìm kiếm thông tin sách';
      },
    });
  };

  // Change camera
  const switchCamera = async () => {
    if (cameraDevices.length <= 1) return;

    const currentIndex = cameraDevices.findIndex(
      (device) => device.deviceId === selectedCameraId
    );
    const nextIndex = (currentIndex + 1) % cameraDevices.length;
    const newCameraId = cameraDevices[nextIndex].deviceId;

    // Stop the current scanner and stream
    if (scannerRef.current) {
      scannerRef.current.reset();
      scannerRef.current = null;
    }

    if (activeStreamRef.current) {
      activeStreamRef.current.getTracks().forEach((track) => track.stop());
      activeStreamRef.current = null;
    }

    setSelectedCameraId(newCameraId);

    // Only restart the camera with the new device if in scanning mode
    if (isScanning && videoRef.current) {
      // Restart the camera with the new device
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

        // Restart the scanner
        setTimeout(() => {
          if (!videoRef.current) return;

          const codeReader = new BrowserMultiFormatReader();
          scannerRef.current = codeReader;

          codeReader.decodeFromVideoDevice(
            newCameraId,
            videoRef.current,
            (result, error) => {
              if (result) {
                const rawIsbn = result.getText();
                const formattedIsbn = formatISBN(rawIsbn);
                handleScanSuccess(formattedIsbn);
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
    }
  };

  // Display the selected camera name in the UI
  const getSelectedCameraName = () => {
    const selected = cameraDevices.find(
      (device) => device.deviceId === selectedCameraId
    );
    return selected ? selected.label : 'Chọn camera';
  };

  return {
    // State
    isScanning,
    manualISBN,
    inputMode,
    cameraDevices,
    selectedCameraId,
    isCameraPermissionGranted,
    cameraError,
    videoRef,

    // Actions
    setManualISBN,
    setInputMode,
    setSelectedCameraId,
    startScanning,
    stopScanning,
    handleManualSubmit,
    switchCamera,
    getSelectedCameraName,

    // Helpers
    formatISBN,
  };
};
