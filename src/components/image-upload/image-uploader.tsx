'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { useImagesMutation } from '@/hooks/use-images';
import { ImageIcon, Loader2, Upload } from 'lucide-react';
import Image from 'next/image';
import { ChangeEvent, useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import { Input } from '../ui/input';

interface ImageUploaderProps {
  entityId: string;
  type: string;
}

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

const ImageUploader = ({ entityId, type }: ImageUploaderProps) => {
  const [files, setFiles] = useState<File[]>([]);
  const [altText, setAltText] = useState('');
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { uploadImage, isUploading } = useImagesMutation();

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const selectedFiles = Array.from(event.target.files);

      // Validate file size
      const invalidFiles = selectedFiles.filter(
        (file) => file.size > MAX_FILE_SIZE
      );
      if (invalidFiles.length > 0) {
        toast.error(`Một số tệp hình ảnh vượt quá kích thước tối đa 10MB`);
        return;
      }

      setFiles(selectedFiles);

      // Create preview URLs
      const newPreviewUrls = selectedFiles.map((file) =>
        URL.createObjectURL(file)
      );

      // Clean up previous URLs to prevent memory leaks
      setPreviewUrls((prevUrls) => {
        prevUrls.forEach((url) => URL.revokeObjectURL(url));
        return newPreviewUrls;
      });
    }
  };

  const handleUpload = () => {
    if (files.length === 0) {
      toast.error('Vui lòng chọn ít nhất một tệp hình ảnh');
      return;
    }

    if (!altText) {
      toast.warning('Vui lòng nhập mô tả hình ảnh');
      return;
    }

    uploadImage(
      {
        files: files,
        type,
        altText,
        entityId,
      },
      {
        onSuccess: () => {
          toast.success('Hình ảnh đã được tải lên thành công');
          setFiles([]);
          setAltText('');
          setPreviewUrls((prevUrls) => {
            prevUrls.forEach((url) => URL.revokeObjectURL(url));
            return [];
          });
          setDialogOpen(false);
        },
        onError: (error) => {
          toast.error(error.message || 'Đã xảy ra lỗi khi tải lên hình ảnh');
        },
      }
    );
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const clearFileSelection = () => {
    setFiles([]);
    setPreviewUrls((prevUrls) => {
      prevUrls.forEach((url) => URL.revokeObjectURL(url));
      return [];
    });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  useEffect(() => {
    return () => {
      previewUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [previewUrls]);

  return (
    <Dialog
      open={dialogOpen}
      onOpenChange={(open) => {
        setDialogOpen(open);
        if (!open) {
          clearFileSelection();
          setAltText('');
        }
      }}
    >
      <DialogTrigger asChild>
        <Button>
          <Upload className='mr-2 h-4 w-4' />
          Tải Ảnh Lên
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Tải ảnh</DialogTitle>
        </DialogHeader>

        <div className='grid gap-4 py-4'>
          <div className='grid gap-2'>
            <Label htmlFor='images'>Chọn ảnh</Label>
            <div
              onClick={triggerFileInput}
              className='flex cursor-pointer flex-col items-center justify-center rounded-md border-2 border-dashed p-8 hover:bg-gray-50 dark:hover:bg-gray-900'
            >
              <input
                ref={fileInputRef}
                id='images'
                type='file'
                accept='image/*'
                multiple
                className='hidden'
                onChange={handleFileChange}
              />
              {previewUrls.length > 0 ? (
                <div className='grid w-full grid-cols-2 gap-2'>
                  {previewUrls.map((url, index) => (
                    <div
                      key={index}
                      className='relative aspect-square overflow-hidden rounded-md'
                    >
                      <Image
                        src={url}
                        alt={`Preview ${index + 1}`}
                        className='object-cover'
                        fill
                        sizes='(max-width: 768px) 100vw, 33vw'
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <div className='text-center'>
                  <ImageIcon className='mx-auto h-12 w-12 text-zinc-400' />
                  <div className='mt-2'>
                    <p>Click để chọn ảnh</p>
                    <p className='text-xs text-zinc-500'>
                      PNG, JPG, GIF up to 10MB
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className='grid gap-2'>
            <Label htmlFor='alt-text'>Alt Text</Label>
            <Input
              id='alt-text'
              placeholder='Mô tả hình ảnh'
              value={altText}
              onChange={(e) => setAltText(e.target.value)}
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            variant='outline'
            onClick={() => {
              setDialogOpen(false);
              clearFileSelection();
              setAltText('');
            }}
          >
            Hủy
          </Button>
          <Button onClick={handleUpload} disabled={isUploading}>
            {isUploading ? (
              <>
                <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                Đang tải lên...
              </>
            ) : (
              'Tải lên'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ImageUploader;
