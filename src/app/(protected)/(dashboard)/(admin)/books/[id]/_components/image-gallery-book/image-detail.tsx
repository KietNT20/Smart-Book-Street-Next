import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { ImageType } from '@/types/image-types';
import { Loader2, Trash2 } from 'lucide-react';
import Image from 'next/image';

type Props = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  selectedImage: ImageType | null;
  bookCode?: string;
  onDelete: (id: string) => void;
  isPending: boolean;
};

const ImageDetail = ({
  isOpen,
  onOpenChange,
  selectedImage,
  bookCode,
  onDelete,
  isPending
}: Props) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className='max-w-3xl'>
        <DialogHeader>
          <DialogTitle>Chi tiết hình ảnh</DialogTitle>
          <DialogDescription>
            {selectedImage?.altText || `Ảnh sách ${bookCode || ''}`}
          </DialogDescription>
        </DialogHeader>
        <div className='relative mx-auto aspect-video w-full overflow-hidden rounded-md'>
          {selectedImage && (
            <Image
              src={selectedImage.url}
              alt={selectedImage.altText || `Ảnh sách ${bookCode || ''}`}
              fill
              className='object-contain'
              sizes='(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw'
            />
          )}
        </div>
        <div className='flex justify-between'>
          <Button
            variant='outline'
            onClick={() => window.open(selectedImage?.url, '_blank')}
          >
            Xem kích thước đầy đủ
          </Button>
          <Button
            variant='destructive'
            onClick={() => {
              if (selectedImage) {
                onDelete(selectedImage.id);
                onOpenChange(false);
              }
            }}
            disabled={isPending}
          >
            {isPending ? (
              <>
                <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                Đang xóa...
              </>
            ) : (
              <>
                <Trash2 className='mr-2 h-4 w-4' />
                Xóa ảnh
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ImageDetail;
