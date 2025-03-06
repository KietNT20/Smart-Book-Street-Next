'use client';

import { useImagesMutation } from '@/hooks/use-images';
import { useState } from 'react';
import EmptyState from './empty-state';
import GridView from './grid-view';
import ImageDetail from './image-detail';
import { useImageService } from './image-service';
import ListView from './list-view';
import ViewControls from './view-controls';

type ImageType = {
  id: string;
  url: string;
  altText: string;
};

type Props = {
  images: ImageType[];
  bookCode?: string;
};

const ImageGalleryBook = ({ images, bookCode }: Props) => {
  const { deleteImageMutation } = useImagesMutation();
  const [selectedImage, setSelectedImage] = useState<ImageType | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { onDelete } = useImageService();

  const handleImageClick = (image: ImageType) => {
    setSelectedImage(image);
    setIsDialogOpen(true);
  };

  return (
    <div className='space-y-4'>
      {/* View Controls */}
      <ViewControls viewMode={viewMode} setViewMode={setViewMode} />

      {images.length === 0 ? (
        <EmptyState bookCode={bookCode} />
      ) : viewMode === 'grid' ? (
        <GridView
          images={images}
          bookCode={bookCode}
          onImageClick={handleImageClick}
          onDelete={onDelete}
        />
      ) : (
        <ListView
          images={images}
          bookCode={bookCode}
          onImageClick={handleImageClick}
          onDelete={onDelete}
        />
      )}

      {/* Image Viewer Dialog */}
      <ImageDetail
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        selectedImage={selectedImage}
        bookCode={bookCode}
        onDelete={onDelete}
        isPending={deleteImageMutation.isPending}
      />
    </div>
  );
};

export default ImageGalleryBook;
