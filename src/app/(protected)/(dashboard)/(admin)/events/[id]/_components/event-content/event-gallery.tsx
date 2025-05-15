import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ImageFallback } from '@/constant/storage';
import { Image } from 'antd';

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

  return (
    <Card>
      <CardHeader>
        <CardTitle>Hình ảnh sự kiện</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Ảnh */}
        {baseImgUrl && (
          <Image
            src={baseImgUrl}
            alt={eventName || ''}
            fallback={ImageFallback.SRC}
          />
        )}

        {/* Gallery */}
        {images && images.length > 0 && (
          <Image.PreviewGroup items={images.map((image) => image?.url)}>
            <div className='mt-4 grid grid-cols-2 gap-4 md:grid-cols-3'>
              {images.map((image, index) => (
                <div
                  key={index}
                  className='aspect-square overflow-hidden rounded-lg'
                >
                  <Image
                    src={image?.url}
                    alt={image?.altText || `Hình ảnh ${index + 1}`}
                    fallback={ImageFallback.SRC}
                  />
                </div>
              ))}
            </div>
          </Image.PreviewGroup>
        )}
      </CardContent>
    </Card>
  );
}
