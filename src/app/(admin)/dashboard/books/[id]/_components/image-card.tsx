'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useImagesMutation } from '@/hooks/use-images';
import { Loader2, Trash2, ZoomIn } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';
import { getPublicIdFromUrl } from '../_lib/action';

type Props = {
  id: string;
  url: string;
  altText: string;
};

const ImageCard = ({ id, url, altText }: Props) => {
  const { deleteImageMutation } = useImagesMutation();
  const [isHovering, setIsHovering] = useState(false);

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

  const onDelete = async () => {
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

  return (
    <Card className='overflow-hidden rounded-lg shadow-md transition-all duration-300 hover:shadow-lg'>
      <div
        className='relative h-64 w-64'
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        {/* Image */}
        <Image
          src={url}
          alt={altText || 'Book image'}
          fill
          className='object-cover'
          sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
        />

        {/* Overlay with actions */}
        <div
          className={`absolute inset-0 flex flex-col items-center justify-center bg-black/50 transition-opacity duration-300 ${
            isHovering ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <div className='flex w-full justify-center space-x-2 px-4'>
            <Button
              variant='outline'
              size='icon'
              className='h-9 w-9 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30'
              onClick={() => window.open(url, '_blank')}
            >
              <ZoomIn className='h-4 w-4 text-white' />
            </Button>
            <Button
              variant='outline'
              size='icon'
              className='h-9 w-9 rounded-full bg-red-500/80 backdrop-blur-sm hover:bg-red-600/90'
              onClick={onDelete}
              disabled={deleteImageMutation.isPending}
            >
              {deleteImageMutation.isPending ? (
                <Loader2 className='h-4 w-4 animate-spin text-white' />
              ) : (
                <Trash2 className='h-4 w-4 text-white' />
              )}
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ImageCard;
