'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { formatDateVi } from '@/lib/utils';
import { Event } from '@/types/event-types';
import { Clock } from 'lucide-react';
import { formatTimeString } from '../../_utils/date-formatter';
import EventDescription from './event-description';
import EventGallery from './event-gallery';
import EventStatistics from './event-statistics';
import EventVideo from './event-video';

interface EventContentProps {
  eventId: string;
  eventData: Event | undefined | null;
}

export default function EventContent({
  eventId,
  eventData,
}: EventContentProps) {
  return (
    <div className='space-y-8 md:col-span-2'>
      {/* Description */}
      <EventDescription description={eventData?.description} />

      {/* Event Schedules */}
      <Card>
        <CardContent className='p-6'>
          <div className='space-y-4'>
            <Label className='flex items-center gap-2 text-base font-semibold'>
              <Clock className='h-4 w-4' />
              Lịch trình sự kiện
            </Label>
            <div className='space-y-2'>
              <Table className='border'>
                <TableHeader>
                  <TableRow>
                    <TableHead>Ngày</TableHead>
                    <TableHead>Giờ bắt đầu</TableHead>
                    <TableHead>Giờ kết thúc</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {eventData?.eventSchedules?.map((schedule) => (
                    <TableRow key={schedule.id}>
                      <TableCell>{formatDateVi(schedule.eventDate)}</TableCell>
                      <TableCell>
                        {formatTimeString(schedule.startTime)}
                      </TableCell>
                      <TableCell>
                        {formatTimeString(schedule.endTime)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Video Preview */}
      <EventVideo
        videoLink={eventData?.videoLink ? eventData.videoLink : '#'}
        posterImage={eventData?.baseImgUrl}
      />

      {/* Gallery */}
      <EventGallery
        baseImgUrl={eventData?.baseImgUrl}
        eventName={eventData?.eventName}
        images={eventData?.images}
      />

      {/* Statistics */}
      <EventStatistics eventId={eventId} />
    </div>
  );
}
