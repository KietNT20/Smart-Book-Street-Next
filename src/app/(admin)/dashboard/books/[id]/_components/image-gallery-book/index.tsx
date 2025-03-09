'use client';

import { useImagesMutation } from '@/hooks/use-images';
import { useState } from 'react';
import EmptyState from './empty-state';
import GridView from './grid-view';
import ImageDetail from './image-detail';
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
  const { deleteImage, isDeleting } = useImagesMutation();
  const [selectedImage, setSelectedImage] = useState<ImageType | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleImageClick = (image: ImageType) => {
    setSelectedImage(image);
    setIsDialogOpen(true);
  };

  const handleDeleteImage = (id: string) => {
    deleteImage(id);
    setIsDialogOpen(false);
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
          onDelete={handleDeleteImage}
        />
      ) : (
        <ListView
          images={images}
          bookCode={bookCode}
          onImageClick={handleImageClick}
          onDelete={handleDeleteImage}
        />
      )}

      {/* Image Viewer Dialog */}
      <ImageDetail
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        selectedImage={selectedImage}
        bookCode={bookCode}
        onDelete={handleDeleteImage}
        isPending={isDeleting}
      />
    </div>
  );
};

export default ImageGalleryBook;
