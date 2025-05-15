import { Badge } from '@/components/ui/badge';
import { ImageFallback } from '@/constant/storage';
import { Event } from '@/types/event-types';
import { Image } from 'antd';
import { Calendar, Clock, MapPin } from 'lucide-react';
import { formatDateRange, formatTime } from '../_utils/date-formatter';

interface EventHeroProps {
  eventData: Event | undefined | null;
}

export default function EventHero({ eventData }: EventHeroProps) {
  return (
    <div className='relative h-96 overflow-hidden'>
      <div className='absolute inset-0 z-10 bg-black/50'></div>
      <div className='flex h-full items-center justify-center'>
        <Image
          src={eventData?.baseImgUrl}
          alt={eventData?.eventName}
          fallback={ImageFallback.SRC}
          style={{
            height: 'auto',
            maxWidth: '100%',
          }}
        />
      </div>
      <div className='absolute inset-0 z-20 mx-auto flex max-w-6xl flex-col justify-end p-8 text-white'>
        <Badge
          className={`mb-4 w-fit ${eventData?.isOpen ? 'bg-green-500 hover:bg-green-600' : 'bg-red-500 hover:bg-red-600'}`}
        >
          {eventData?.isOpen ? 'Đang diễn ra' : 'Đã kết thúc'}
        </Badge>
        <h1 className='mb-4 text-4xl font-bold'>{eventData?.eventName}</h1>
        <div className='flex flex-col gap-4 text-zinc-100 sm:flex-row sm:items-center'>
          <div className='flex items-center gap-2'>
            <Calendar className='h-5 w-5' />
            <span>
              {formatDateRange(eventData?.startDate, eventData?.endDate)}
            </span>
          </div>
          <div className='flex items-center gap-2'>
            <Clock className='h-5 w-5' />
            <span>
              {formatTime(eventData?.startDate)} -{' '}
              {formatTime(eventData?.endDate)}
            </span>
          </div>
          <div className='flex items-center gap-2'>
            <MapPin className='h-5 w-5' />
            <span>{eventData?.zone?.zoneName}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
