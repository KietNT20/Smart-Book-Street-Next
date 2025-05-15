import { Event } from '@/types/event-types';
import EventActions from './event-actions';
import EventLocation from './event-location';
import EventTimeInfo from './event-time-info';

interface EventSidebarProps {
  eventData: Event | undefined | null;
}

export default function EventSidebar({ eventData }: EventSidebarProps) {
  return (
    <div className='space-y-6'>
      {/* Event Actions */}
      <EventActions isOpen={eventData?.isOpen} />

      {/* Location Info */}
      <EventLocation zone={eventData?.zone} />

      {/* Date and Time Information */}
      <EventTimeInfo
        startDate={eventData?.startDate}
        endDate={eventData?.endDate}
      />
    </div>
  );
}
