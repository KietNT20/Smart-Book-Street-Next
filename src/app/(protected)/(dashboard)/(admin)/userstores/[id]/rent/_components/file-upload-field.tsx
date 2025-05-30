'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Eye, EyeOff, Upload, X } from 'lucide-react';
import Image from 'next/image';
import { useCallback, useEffect, useRef, useState } from 'react';

type Props = {
  onChange: (file: File) => void;
  disabled?: boolean;
};

const FileUploadField = ({ onChange, disabled = false }: Props) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [showFilePreview, setShowFilePreview] = useState(false);
  const [filePreviewUrl, setFilePreviewUrl] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const currentUrlRef = useRef<string | null>(null);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (currentUrlRef.current) {
        URL.revokeObjectURL(currentUrlRef.current);
      }
    };
  }, []);

  const handleFileChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;

      // Cleanup previous URL
      if (currentUrlRef.current) {
        URL.revokeObjectURL(currentUrlRef.current);
        currentUrlRef.current = null;
      }

      // Create new URL
      const url = URL.createObjectURL(file);
      currentUrlRef.current = url;

      setSelectedFile(file);
      setFilePreviewUrl(url);
      onChange(file);
    },
    [onChange]
  );

  const handleRemoveFile = useCallback(() => {
    // Cleanup URL
    if (currentUrlRef.current) {
      URL.revokeObjectURL(currentUrlRef.current);
      currentUrlRef.current = null;
    }

    // Reset state
    setSelectedFile(null);
    setFilePreviewUrl(null);
    setShowFilePreview(false);

    // Clear input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, []);

  const renderFilePreview = useCallback(() => {
    if (!selectedFile || !filePreviewUrl) return null;

    const fileType = selectedFile.type;
    const fileName = selectedFile.name.toLowerCase();

    if (fileType === 'application/pdf' || fileName.endsWith('.pdf')) {
      return (
        <div className='h-96 w-full overflow-hidden rounded border'>
          <iframe
            src={filePreviewUrl}
            className='h-full w-full'
            title='PDF Preview'
          />
        </div>
      );
    }

    if (fileType.startsWith('image/')) {
      return (
        <div className='relative h-96 w-full overflow-hidden rounded border'>
          <Image
            src={filePreviewUrl}
            alt={selectedFile.name}
            fill
            className='object-contain'
            unoptimized // For blob URLs, optimization isn't needed
          />
        </div>
      );
    }

    return (
      <div className='flex h-96 w-full items-center justify-center rounded border bg-muted'>
        <div className='text-center'>
          <Upload className='mx-auto mb-4 text-muted-foreground' size={48} />
          <p className='text-sm text-muted-foreground'>
            Không thể xem trước loại file này
          </p>
        </div>
      </div>
    );
  }, [selectedFile, filePreviewUrl]);

  return (
    <div className='space-y-4'>
      <div className='flex items-center gap-4'>
        <Input
          ref={fileInputRef}
          type='file'
          accept='.pdf,.jpeg,.jpg,.png'
          onChange={handleFileChange}
          disabled={disabled}
          className='flex-1'
        />
        <Upload className='text-muted-foreground' size={20} />
      </div>

      {selectedFile && (
        <div className='space-y-3'>
          <div className='flex items-center justify-between rounded-lg bg-muted p-3'>
            <div className='flex items-center gap-2 text-sm'>
              <span className='text-muted-foreground'>File đã chọn:</span>
              <span className='font-medium'>{selectedFile.name}</span>
              <span className='text-xs text-muted-foreground'>
                ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
              </span>
            </div>

            <div className='flex items-center gap-2'>
              <Button
                variant='outline'
                size='sm'
                onClick={() => setShowFilePreview(!showFilePreview)}
                type='button'
                className='h-8 px-3'
              >
                {showFilePreview ? (
                  <>
                    <EyeOff size={14} className='mr-1' />
                    Ẩn
                  </>
                ) : (
                  <>
                    <Eye size={14} className='mr-1' />
                    Xem trước
                  </>
                )}
              </Button>
              <Button
                variant='outline'
                size='icon'
                onClick={handleRemoveFile}
                type='button'
                className='h-8 w-8 p-0 text-destructive hover:text-destructive'
              >
                <X size={14} />
              </Button>
            </div>
          </div>

          {showFilePreview && (
            <div className='space-y-3'>
              <h4 className='font-medium'>
                Xem trước file: {selectedFile.name}
              </h4>
              {renderFilePreview()}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FileUploadField;
