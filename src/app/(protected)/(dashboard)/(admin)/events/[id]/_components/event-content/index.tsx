'use client';

import { Event } from '@/types/event-types';
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
