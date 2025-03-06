'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useImagesMutation } from '@/hooks/use-images';
import {
  Image as ImageIcon,
  Loader2,
  MoreHorizontal,
  Trash2
} from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';
import { getPublicIdFromUrl } from '../_lib/action';

type ImageType = {
  id: string;
  url: string;
  altText: string;
};

type Props = {
  images: ImageType[];
  bookCode?: string;
};

const EnhancedImageGallery = ({ images, bookCode }: Props) => {
  const { deleteImageMutation } = useImagesMutation();
  const [selectedImage, setSelectedImage] = useState<ImageType | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const deleteFromCloudinary = async (publicId: string) => {
    const response = await fetch('/api/sign-cloudinary-params', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ publicId })
    });

    if (!response.ok) {
      throw new Error('Failed to delete from Cloudinary');
    }

    return response.json();
  };

  const onDelete = async (id: string, url: string) => {
    try {
      const publicId = await getPublicIdFromUrl(url);
      if (!publicId) {
        throw new Error('Could not extract public ID from URL');
      }
      await deleteFromCloudinary(publicId);
      await deleteImageMutation.mutateAsync(id);
    } catch (error) {
      console.error('Error deleting image:', error);
    }
  };

  const handleImageClick = (image: ImageType) => {
    setSelectedImage(image);
    setIsDialogOpen(true);
  };

  return (
    <div className='space-y-4'>
      {/* View Controls */}
      <div className='flex justify-end space-x-2'>
        <Button
          variant={viewMode === 'grid' ? 'default' : 'outline'}
          size='sm'
          onClick={() => setViewMode('grid')}
          className='h-8 w-8 p-0'
        >
          <svg
            xmlns='http://www.w3.org/2000/svg'
            width='16'
            height='16'
            viewBox='0 0 24 24'
            fill='none'
            stroke='currentColor'
            strokeWidth='2'
            strokeLinecap='round'
            strokeLinejoin='round'
          >
            <rect x='3' y='3' width='7' height='7' />
            <rect x='14' y='3' width='7' height='7' />
            <rect x='14' y='14' width='7' height='7' />
            <rect x='3' y='14' width='7' height='7' />
          </svg>
          <span className='sr-only'>Grid view</span>
        </Button>
        <Button
          variant={viewMode === 'list' ? 'default' : 'outline'}
          size='sm'
          onClick={() => setViewMode('list')}
          className='h-8 w-8 p-0'
        >
          <svg
            xmlns='http://www.w3.org/2000/svg'
            width='16'
            height='16'
            viewBox='0 0 24 24'
            fill='none'
            stroke='currentColor'
            strokeWidth='2'
            strokeLinecap='round'
            strokeLinejoin='round'
          >
            <line x1='8' y1='6' x2='21' y2='6' />
            <line x1='8' y1='12' x2='21' y2='12' />
            <line x1='8' y1='18' x2='21' y2='18' />
            <line x1='3' y1='6' x2='3.01' y2='6' />
            <line x1='3' y1='12' x2='3.01' y2='12' />
            <line x1='3' y1='18' x2='3.01' y2='18' />
          </svg>
          <span className='sr-only'>List view</span>
        </Button>
      </div>

      {images.length === 0 ? (
        <div className='flex h-60 flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 p-12 text-center'>
          <ImageIcon className='mb-4 h-12 w-12 text-gray-400' />
          <h3 className='mb-2 text-sm font-medium'>Chưa có hình ảnh</h3>
          <p className='text-xs text-gray-500'>
            Tải lên hình ảnh cho sách &quot;{bookCode || ''}&quot; bằng cách
            nhấn nút &quot;Tải ảnh lên&quot;
          </p>
        </div>
      ) : viewMode === 'grid' ? (
        <div className='grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5'>
          {images.map((image) => (
            <Card
              key={image.id}
              className='group relative cursor-pointer overflow-hidden transition-all duration-200 hover:shadow-md'
              onClick={() => handleImageClick(image)}
            >
              <div className='relative aspect-square'>
                <Image
                  src={image.url}
                  alt={image.altText || `Ảnh sách ${bookCode || ''}`}
                  fill
                  className='object-cover transition-transform duration-300 group-hover:scale-105'
                  sizes='(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 20vw'
                />
                <div className='absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100'>
                  <div className='absolute bottom-2 right-2'>
                    <DropdownMenu>
                      <DropdownMenuTrigger
                        asChild
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Button
                          variant='ghost'
                          size='icon'
                          className='h-8 w-8 rounded-full bg-white/20 text-white backdrop-blur-sm hover:bg-white/30'
                        >
                          <MoreHorizontal className='h-4 w-4' />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align='end'>
                        <DropdownMenuLabel>Tùy chọn</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation();
                            window.open(image.url, '_blank');
                          }}
                        >
                          Xem kích thước đầy đủ
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className='text-red-600 focus:text-red-600'
                          onClick={(e) => {
                            e.stopPropagation();
                            onDelete(image.id, image.url);
                          }}
                        >
                          Xóa ảnh
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <div className='rounded-md border'>
          <ScrollArea className='h-[400px]'>
            <div className='space-y-1 p-1'>
              {images.map((image) => (
                <div
                  key={image.id}
                  className='flex items-center space-x-4 rounded-md p-2 hover:bg-accent'
                >
                  <div className='relative h-16 w-16 shrink-0 overflow-hidden rounded-md'>
                    <Image
                      src={image.url}
                      alt={image.altText || `Ảnh sách ${bookCode || ''}`}
                      fill
                      className='object-cover'
                      sizes='64px'
                    />
                  </div>
                  <div className='flex-1 truncate'>
                    <div className='flex flex-col'>
                      <span className='font-medium'>
                        {image.altText || `Ảnh sách ${bookCode || ''}`}
                      </span>
                      <span className='truncate text-xs text-muted-foreground'>
                        {image.url.split('/').pop()}
                      </span>
                    </div>
                  </div>
                  <div className='flex space-x-1'>
                    <Button
                      variant='ghost'
                      size='icon'
                      className='h-8 w-8'
                      onClick={() => handleImageClick(image)}
                    >
                      <svg
                        xmlns='http://www.w3.org/2000/svg'
                        width='16'
                        height='16'
                        viewBox='0 0 24 24'
                        fill='none'
                        stroke='currentColor'
                        strokeWidth='2'
                        strokeLinecap='round'
                        strokeLinejoin='round'
                      >
                        <circle cx='11' cy='11' r='8'></circle>
                        <line x1='21' y1='21' x2='16.65' y2='16.65'></line>
                        <line x1='11' y1='8' x2='11' y2='14'></line>
                        <line x1='8' y1='11' x2='14' y2='11'></line>
                      </svg>
                      <span className='sr-only'>Xem</span>
                    </Button>
                    <Button
                      variant='ghost'
                      size='icon'
                      className='h-8 w-8 text-red-600 hover:text-red-700'
                      onClick={() => onDelete(image.id, image.url)}
                    >
                      <Trash2 className='h-4 w-4' />
                      <span className='sr-only'>Xóa</span>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
      )}

      {/* Image Viewer Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className='max-w-3xl'>
          <DialogHeader>
            <DialogTitle>Chi tiết hình ảnh</DialogTitle>
            <DialogDescription>
              {selectedImage?.altText || `Ảnh sách ${bookCode || ''}`}
            </DialogDescription>
          </DialogHeader>
          <div className='relative mx-auto aspect-video w-full overflow-hidden rounded-md'>
            {selectedImage && (
              <Image
                src={selectedImage.url}
                alt={selectedImage.altText || `Ảnh sách ${bookCode || ''}`}
                fill
                className='object-contain'
                sizes='(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw'
              />
            )}
          </div>
          <div className='flex justify-between'>
            <Button
              variant='outline'
              onClick={() => window.open(selectedImage?.url, '_blank')}
            >
              Xem kích thước đầy đủ
            </Button>
            <Button
              variant='destructive'
              onClick={() => {
                if (selectedImage) {
                  onDelete(selectedImage.id, selectedImage.url);
                  setIsDialogOpen(false);
                }
              }}
              disabled={deleteImageMutation.isPending}
            >
              {deleteImageMutation.isPending ? (
                <>
                  <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                  Đang xóa...
                </>
              ) : (
                <>
                  <Trash2 className='mr-2 h-4 w-4' />
                  Xóa ảnh
                </>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EnhancedImageGallery;
