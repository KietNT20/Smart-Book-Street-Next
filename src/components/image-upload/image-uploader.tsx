'use client';

import { useAddImage } from '@/hooks/use-images';
import {
  CldUploadWidget,
  CloudinaryUploadWidgetInfo,
  CloudinaryUploadWidgetResults,
} from 'next-cloudinary';
import { useState } from 'react';

type ImageUploaderProps = {
  entityId?: string;
};

const ImageUploader = ({ entityId }: ImageUploaderProps) => {
  const [uploading, setUploading] = useState(false);
  const { mutate: addImgmutate } = useAddImage();

  const handleUpload = async (result: CloudinaryUploadWidgetResults) => {
    // Kiểm tra nếu upload thành công
    if (result.event !== 'success') return;
    // Kiểm tra nếu kết quả trả về không phải là object
    if (!result.info || typeof result.info === 'string') return;
    setUploading(true);
    try {
      const imageInfo: CloudinaryUploadWidgetInfo = result.info;

      // Tạo payload cho backend
      const imagePayload = [
        {
          url: imageInfo.secure_url,
          type: imageInfo.resource_type,
          altText: imageInfo.original_filename,
          entityId: entityId ?? '',
        },
      ];

      // Lưu thông tin ảnh vào backend
      addImgmutate(imagePayload);
    } catch (error) {
      console.error('Failed to save image:', error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <CldUploadWidget
        signatureEndpoint="/api/sign-cloudinary-params"
        onSuccess={handleUpload}
      >
        {({ open }) => (
          <button
            onClick={() => open()}
            disabled={uploading}
            className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 disabled:bg-gray-400"
          >
            {uploading ? 'Đang xử lý...' : 'Upload ảnh'}
          </button>
        )}
      </CldUploadWidget>
    </div>
  );
};

export default ImageUploader;
