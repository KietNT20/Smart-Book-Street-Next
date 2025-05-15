import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Video } from 'lucide-react';

interface EventVideoProps {
  videoLink?: string;
  posterImage?: string;
}

export default function EventVideo({
  videoLink,
  posterImage,
}: EventVideoProps) {
  if (!videoLink) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className='flex items-center gap-2'>
          <Video className='h-5 w-5' />
          Video giới thiệu
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className='aspect-video overflow-hidden rounded-lg'>
          <video
            src={videoLink}
            controls
            className='h-full w-full object-cover'
            poster={posterImage}
          >
            Trình duyệt của bạn không hỗ trợ video.
          </video>
        </div>
      </CardContent>
    </Card>
  );
}
