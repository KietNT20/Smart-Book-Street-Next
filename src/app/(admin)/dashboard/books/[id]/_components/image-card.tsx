'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useImagesMutation } from '@/hooks/use-images';
import { Loader2, Trash2 } from 'lucide-react';
import Image from 'next/image';
import { getPublicIdFromUrl } from '../_lib/action';

type ImageCardProps = {
  id: string;
  url: string;
  altText: string;
};

const ImageCard = ({ id, url, altText }: ImageCardProps) => {
  const { deleteImageMutation } = useImagesMutation();
  const deleteFromCloudinary = async (publicId: string) => {
    const response = await fetch('/api/sign-cloudinary-params', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ publicId }),
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
    <Card className="group relative transform-gpu overflow-hidden">
      <Image
        src={url}
        alt={altText}
        style={{
          width: '100%',
          height: 'auto',
        }}
        width={500}
        height={300}
        sizes="100vw"
        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
      />
      <div className="absolute inset-0 flex items-end justify-center bg-gradient-to-t from-black/60 to-transparent opacity-0 transition-opacity group-hover:opacity-100">
        <Button
          variant="destructive"
          size="sm"
          className="flex-1"
          onClick={onDelete}
          disabled={deleteImageMutation.isPending}
        >
          {deleteImageMutation.isPending ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Trash2 className="mr-2 h-4 w-4" />
          )}
          {deleteImageMutation.isPending ? 'Đang xóa...' : 'Xóa'}
        </Button>
      </div>
    </Card>
  );
};

export default ImageCard;
