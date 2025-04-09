import { ImageType } from '@/types/image-types';
import ImageCard from './image-card';

type Props = {
  images: ImageType[];
  bookCode?: string;
  onImageClick: (image: ImageType) => void;
  onDelete: (id: string) => void;
};

const GridView = ({ images, bookCode, onImageClick, onDelete }: Props) => {
  return (
    <div className='grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5'>
      {images.map((image) => (
        <ImageCard
          key={image.id}
          image={image}
          bookCode={bookCode}
          onClick={onImageClick}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

export default GridView;
