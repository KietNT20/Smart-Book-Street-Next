'use client';

import { Button } from '@/components/ui/button';
import { useImagesMutation } from '@/hooks/use-images';
import { ImagePlus, Loader2 } from 'lucide-react';
import {
  CldUploadWidget,
  CloudinaryUploadWidgetInfo,
  CloudinaryUploadWidgetResults
} from 'next-cloudinary';
import { useState } from 'react';

type ImageUploaderProps = {
  entityId: string;
  folder?: string;
  maxFiles?: number;
  mutiple?: boolean;
};

const ImageUploader = ({
  entityId,
  folder,
  maxFiles,
  mutiple = true
}: ImageUploaderProps) => {
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
    multiple: mutiple,
    maxFiles: maxFiles || 5
  };

  return (
    <div>
      <CldUploadWidget
        signatureEndpoint='/api/sign-cloudinary-params'
        onSuccess={handleUpload}
        options={uploadOptions}
      >
        {({ open }) => (
          <Button
            onClick={() => open()}
            disabled={uploading}
            className='flex items-center gap-2'
          >
            {uploading ? (
              <>
                <Loader2 className='h-4 w-4 animate-spin' />
                Đang xử lý...
              </>
            ) : (
              <>
                <ImagePlus className='h-4 w-4' />
                Tải ảnh
              </>
            )}
          </Button>
        )}
      </CldUploadWidget>
    </div>
  );
};

export default ImageUploader;
