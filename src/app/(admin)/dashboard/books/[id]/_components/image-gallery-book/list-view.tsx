import { ScrollArea } from '@/components/ui/scroll-area';
import ImageItem from './image-item';
import { ImageType } from '@/types/image-types';

type Props = {
  images: ImageType[];
  bookCode?: string;
  onImageClick: (image: ImageType) => void;
  onDelete: (id: string) => void;
};

const ListView = ({ images, bookCode, onImageClick, onDelete }: Props) => {
  return (
    <div className='rounded-md border'>
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
