'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ImageType } from '@/types/image-types';
import { MoreHorizontal } from 'lucide-react';
import Image from 'next/image';

type Props = {
  image: ImageType;
  bookCode?: string;
  onClick: (image: ImageType) => void;
  onDelete: (id: string) => void;
};

const ImageCard = ({ image, bookCode, onClick, onDelete }: Props) => {
  return (
    <Card
      className='group relative cursor-pointer overflow-hidden bg-accent p-2 transition-all duration-200 hover:shadow-md'
      onClick={() => onClick(image)}
    >
      <CardContent className='relative flex h-72 items-center justify-center overflow-hidden p-0'>
        <Image
          src={image.url}
          alt={image.altText || `Ảnh sách ${bookCode || ''}`}
          width={200}
          height={300}
          priority
          className='absolute h-auto max-w-full transition-transform duration-300 group-hover:scale-105'
        />
        <div className='absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100'>
          <div className='absolute bottom-2 right-2'>
            <DropdownMenu>
              <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                <Button
                  variant='ghost'
                  size='icon'
                  className='h-8 w-8 rounded-full bg-background/20 text-white backdrop-blur-sm hover:bg-background/30'
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
                    onDelete(image.id);
                  }}
                >
                  Xóa ảnh
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ImageCard;
