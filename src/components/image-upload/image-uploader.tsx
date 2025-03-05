'use client';

import { useImagesMutation } from '@/hooks/use-images';
import {
  CldUploadWidget,
  CloudinaryUploadWidgetInfo,
  CloudinaryUploadWidgetResults
} from 'next-cloudinary';
import { useState } from 'react';

type ImageUploaderProps = {
  entityId: string;
  folder?: string;
};

const ImageUploader = ({ entityId, folder }: ImageUploaderProps) => {
  const [uploading, setUploading] = useState(false);
  const { addImageMutation } = useImagesMutation();

  const handleUpload = async (result: CloudinaryUploadWidgetResults) => {
    // Check if the upload is successful
    if (result.event !== 'success') return;
    // Check if not have result info or result info is string
    if (!result.info || typeof result.info === 'string') return;
    setUploading(true);
    try {
      const imageInfo: CloudinaryUploadWidgetInfo = result.info;
      if (imageInfo) {
        // Prepare image payload
        const imagePayload = [
          {
            url: imageInfo.secure_url,
            type: imageInfo.resource_type,
            altText: imageInfo.original_filename,
            entityId: entityId
          }
        ];
        // Save image to database
        await addImageMutation.mutateAsync(imagePayload);
      }
    } catch (error) {
      console.error('Failed to save image:', error);
    } finally {
      setUploading(false);
    }
  };

  const uploadOptions = {
    folder,
    maxFiles: 5
  };

  return (
    <div>
      <CldUploadWidget
        signatureEndpoint='/api/sign-cloudinary-params'
        onSuccess={handleUpload}
        options={uploadOptions}
      >
        {({ open }) => (
          <button
            onClick={() => open()}
            disabled={uploading}
            className='rounded bg-blue-500 px-4 py-2 text-white duration-300 hover:bg-blue-600 disabled:bg-gray-400'
          >
            {uploading ? 'Đang xử lý...' : 'Tải ảnh'}
          </button>
        )}
      </CldUploadWidget>
    </div>
  );
};

export default ImageUploader;
