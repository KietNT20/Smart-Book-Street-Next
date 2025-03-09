import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import Image from 'next/image';

type ImageType = {
  id: string;
  url: string;
  altText: string;
};

type Props = {
  image: ImageType;
  bookCode?: string;
  onClick: (image: ImageType) => void;
  onDelete: (id: string) => void;
};

const ImageItem = ({ image, bookCode, onClick, onDelete }: Props) => {
  return (
    <div className='flex items-center space-x-4 rounded-md p-2 hover:bg-accent'>
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
          onClick={() => onClick(image)}
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
          onClick={() => onDelete(image.id)}
        >
          <Trash2 className='h-4 w-4' />
          <span className='sr-only'>Xóa</span>
        </Button>
      </div>
    </div>
  );
};

export default ImageItem;
