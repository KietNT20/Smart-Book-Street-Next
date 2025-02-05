'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useImagesMutation } from '@/hooks/use-images';
import { Trash2 } from 'lucide-react';
import Image from 'next/image';

type ImageCardProps = {
  id: string;
  url: string;
  altText: string;
};

const ImageCard = ({ id, url, altText }: ImageCardProps) => {
  const { deleteImageMutation } = useImagesMutation();
  const onDelete = (id: string) => {
    deleteImageMutation.mutateAsync(id);
  };
  return (
    <Card className="group relative transform-gpu overflow-hidden">
      {/* Image container */}
      <div className="relative h-72 w-52">
        <Image
          src={url}
          alt={altText}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>

      {/* Action buttons overlay */}
      <div className="absolute inset-0 flex items-end justify-center bg-gradient-to-t from-black/60 to-transparent opacity-0 transition-opacity group-hover:opacity-100">
        <Button
          variant="destructive"
          size="sm"
          className="flex-1"
          onClick={() => onDelete?.(id)}
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Xóa
        </Button>
      </div>
    </Card>
  );
};

export default ImageCard;
