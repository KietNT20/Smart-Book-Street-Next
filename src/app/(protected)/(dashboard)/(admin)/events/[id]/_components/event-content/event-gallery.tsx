import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ImageFallback } from '@/constant/storage';
import { Image } from 'antd';
import { GalleryHorizontalEnd, ImageIcon } from 'lucide-react';

interface EventImage {
  url: string;
  altText?: string;
}

interface EventGalleryProps {
  baseImgUrl: string | undefined;
  eventName: string | undefined;
  images: EventImage[] | undefined;
}

export default function EventGallery({
  baseImgUrl,
  eventName,
  images,
}: EventGalleryProps) {
  if (!baseImgUrl && (!images || images.length === 0)) return null;

  const totalImages = (baseImgUrl ? 1 : 0) + (images?.length || 0);

  return (
    <Card className='overflow-hidden'>
      <CardHeader className='pb-4'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-3'>
            <div className='rounded-full bg-blue-100 p-2 text-blue-600'>
              <GalleryHorizontalEnd className='h-5 w-5' />
            </div>
            <div>
              <CardTitle className='text-card-foreground'>
                Hình ảnh sự kiện
              </CardTitle>
            </div>
          </div>
          <Badge variant='secondary' className='bg-blue-50 text-blue-700'>
            <ImageIcon className='mr-1 h-3 w-3' />
            {totalImages}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className='space-y-6'>
        {/* Ảnh chính */}
        {baseImgUrl && (
          <div className='group relative'>
            <Image
              src={baseImgUrl}
              alt={eventName || 'Ảnh chính của sự kiện'}
              fallback={ImageFallback.SRC}
              className='aspect-video w-full object-cover'
            />
          </div>
        )}

        {/* Separator nếu có cả ảnh chính và gallery */}
        {baseImgUrl && images && images.length > 0 && (
          <div className='flex items-center gap-4'>
            <Separator className='flex-1' />
            <Badge variant='outline' className='text-xs font-medium'>
              Thư viện ảnh
            </Badge>
            <Separator className='flex-1' />
          </div>
        )}

        {/* Gallery */}
        {images && images.length > 0 && (
          <Image.PreviewGroup items={images.map((image) => image?.url)}>
            <div className='grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4'>
              {images.map((image, index) => (
                <div
                  key={index}
                  className='group relative aspect-square overflow-hidden rounded-lg bg-gray-100 transition-all duration-300 hover:shadow-lg'
                >
                  <Image
                    src={image?.url}
                    alt={image?.altText || `Hình ảnh sự kiện ${index + 1}`}
                    fallback={ImageFallback.SRC}
                    className='h-full w-full cursor-pointer object-cover transition-transform duration-300 hover:scale-105'
                  />

                  {/* Badge số thứ tự */}
                  <div className='absolute right-2 top-2 z-10'>
                    <Badge
                      variant='secondary'
                      className='bg-white/90 text-xs text-gray-700 opacity-0 backdrop-blur-sm transition-opacity duration-300 group-hover:opacity-100'
                    >
                      {index + 1}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </Image.PreviewGroup>
        )}

        {/* Footer info */}
        <div className='flex items-center justify-center pt-2'>
          <span className='text-xs text-gray-500'>
            Nhấn vào ảnh để xem phóng to
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
