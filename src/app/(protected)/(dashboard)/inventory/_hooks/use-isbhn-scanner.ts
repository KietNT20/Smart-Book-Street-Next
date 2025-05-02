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
 * Hàm định dạng ISBN thành dạng có gạch ngang
 * Ví dụ: "9786045784860" → "978-604-57-8486-0"
 */
export const formatISBN = (isbn: string): string => {
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

    if (!videoRef.current) {
      toast.error('Không tìm thấy video element');
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
        if (videoRef.current) {
          codeReader.decodeFromVideoDevice(
            selectedCameraId,
            videoRef.current,
            (result, error) => {
              if (result) {
                const rawIsbn = result.getText();
                // Định dạng ISBN thành dạng có gạch ngang
                const formattedIsbn = formatISBN(rawIsbn);
                handleScanSuccess(formattedIsbn);
              }
              if (error && error.name !== 'NotFoundException') {
                console.error('Scanner error:', error);
              }
            }
          );
        }
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

  const handleScanSuccess = (isbn: string) => {
    stopScanning();

    // Nếu có callback từ bên ngoài thì gọi
    if (onScanSuccess) {
      onScanSuccess(isbn);
    } else {
      // Xử lý mặc định
      processISBN(isbn);
    }
  };

  const handleManualSubmit = () => {
    if (!manualISBN) {
      toast.error('Vui lòng nhập mã ISBN');
      return;
    }

    // Định dạng ISBN nhập tay thành dạng có gạch ngang
    const formattedIsbn = formatISBN(manualISBN);

    // Nếu có callback từ bên ngoài thì gọi
    if (onScanSuccess) {
      onScanSuccess(formattedIsbn);
      setManualISBN('');
    } else {
      // Xử lý mặc định
      processISBN(formattedIsbn);
    }
  };

  const processISBN = (isbn: string) => {
    // Giữ nguyên ISBN có dấu gạch ngang khi gửi request
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

    // Chỉ khởi động lại camera với thiết bị mới nếu đang trong chế độ scanning
    if (isScanning && videoRef.current) {
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

  // Hiển thị tên camera đã chọn
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
