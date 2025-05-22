import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Event } from '@/types/event-types';
import { Calendar, MapPin } from 'lucide-react';
import { formatDateRange } from '../_utils/date-formatter';

interface EventHeroProps {
  eventData: Event | undefined | null;
}

export default function EventHero({ eventData }: EventHeroProps) {
  return (
    <div className='relative'>
      <Card>
        <CardContent className='pt-6'>
          <Badge
            className={`mb-4 w-fit ${eventData?.isOpen ? 'bg-green-500 hover:bg-green-600' : 'bg-red-500 hover:bg-red-600'}`}
          >
            {eventData?.isOpen ? 'Đang diễn ra' : 'Đã kết thúc'}
          </Badge>
          <h1 className='mb-4 text-4xl font-bold'>{eventData?.eventName}</h1>
          <div className='flex flex-col gap-4 sm:flex-row sm:items-center'>
            <div className='flex items-center gap-2'>
              <Calendar className='h-5 w-5' />
              <span>
                {formatDateRange(eventData?.startDate, eventData?.endDate)}
              </span>
            </div>
            <div className='flex items-center gap-2'>
              <MapPin className='h-5 w-5' />
              <span>{eventData?.zone?.zoneName}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
