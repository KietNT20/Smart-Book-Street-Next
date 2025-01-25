'use client';

import { Upload } from 'lucide-react';
import {
  CldUploadWidget,
  CloudinaryUploadWidgetResults,
} from 'next-cloudinary';
import Image from 'next/image';
import { useState } from 'react';

export default function ImageUploader() {
  const [imageUrl, setImageUrl] = useState<string>('');
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string>('');

  const handleUploadSuccess = async (result: CloudinaryUploadWidgetResults) => {
    try {
      setIsUploading(true);
      setError('');

      if (!result?.info || typeof result.info === 'string') {
        throw new Error('Invalid upload result');
      }

      const secureUrl = result.info.secure_url;
      const originalFilename = result.info.original_filename;

      if (!secureUrl || !originalFilename) {
        throw new Error('Missing upload information');
      }

      const response = await fetch('/api/uploadImage', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          url: secureUrl,
          filename: originalFilename,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to save image');
      }

      setImageUrl(secureUrl);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Upload failed');
      setImageUrl('');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-xl p-4">
      <CldUploadWidget
        uploadPreset="my-uploads"
        onSuccess={handleUploadSuccess}
      >
        {({ open }) => (
          <div className="rounded-lg border-2 border-dashed border-gray-300 p-6">
            <button
              onClick={() => open()}
              className="w-full focus:outline-none"
              disabled={isUploading}
            >
              <div className="flex h-40 flex-col items-center justify-center">
                {imageUrl ? (
                  <div className="relative h-full w-full">
                    <Image
                      src={imageUrl}
                      alt="Uploaded image"
                      width={400}
                      height={300}
                      className="h-full w-full object-contain"
                      priority
                    />
                  </div>
                ) : (
                  <>
                    <Upload className="h-12 w-12 text-gray-400" />
                    <p className="mt-2 text-sm text-gray-500">
                      {isUploading
                        ? 'Uploading...'
                        : 'Click to upload or drag and drop'}
                    </p>
                  </>
                )}
              </div>
            </button>
          </div>
        )}
      </CldUploadWidget>

      {error && <div className="mt-4 text-sm text-red-500">{error}</div>}
    </div>
  );
}
