'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useImagesMutation } from '@/hooks/use-images';
import { Loader2, Trash2, ZoomIn } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';

type Props = {
  id: string;
  url: string;
  altText: string;
};

const ImageCard = ({ id, url, altText }: Props) => {
  const { deleteImage, isDeleting } = useImagesMutation();
  const [isHovering, setIsHovering] = useState(false);

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
              className='h-9 w-9 rounded-full bg-background/20 backdrop-blur-sm hover:bg-background/30'
              onClick={() => window.open(url, '_blank')}
            >
              <ZoomIn className='h-4 w-4 text-white' />
            </Button>
            <Button
              variant='outline'
              size='icon'
              className='h-9 w-9 rounded-full bg-red-500/80 backdrop-blur-sm hover:bg-red-600/90'
              onClick={() => deleteImage(id)}
              disabled={isDeleting}
            >
              {isDeleting ? (
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
