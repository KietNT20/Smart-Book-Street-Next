'use client';

import { ScrollArea } from '@/components/ui/scroll-area';
import { ImageType } from '@/types/image-types';
import ImageItem from './image-item';

type Props = {
  images: ImageType[];
  bookCode?: string;
  onImageClick: (image: ImageType) => void;
  onDelete: (id: string) => void;
};

const ListView = ({ images, bookCode, onImageClick, onDelete }: Props) => {
  return (
    <div className='rounded-md border-4'>
      <ScrollArea className='h-[400px]'>
        <div className='space-y-1 p-1'>
          {images.map((image) => (
            <ImageItem
              key={image.id}
              image={image}
              bookCode={bookCode}
              onClick={onImageClick}
              onDelete={onDelete}
            />
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default ListView;
