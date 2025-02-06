'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useImagesMutation } from '@/hooks/use-images';
import { useToast } from '@/hooks/use-toast';
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
  const { toast } = useToast();
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

      toast({
        title: 'Thành công',
        description: 'Đã xóa ảnh',
        variant: 'success',
      });
    } catch (error) {
      console.error('Error deleting image:', error);
      toast({
        title: 'Lỗi',
        description: 'Không thể xóa ảnh. Vui lòng thử lại',
        variant: 'destructive',
      });
    }
  };

  return (
    <Card className="group relative transform-gpu overflow-hidden">
      <div className="relative h-72 w-52">
        <Image
          src={url}
          alt={altText}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          priority
        />
      </div>

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
