'use client';

import { Separator } from '@/components/ui/separator';
import { useGetEventById } from '@/hooks/use-event';
import { useParams } from 'next/navigation';
import EventForm from '../../_components/event-form';

const EditEventPage = () => {
  const params = useParams();
  const eventId = params.id as string;
  const { eventData } = useGetEventById(eventId);
  return (
    <div className='container mx-auto md:px-20 md:py-4'>
      <h1 className='text-3xl font-bold'>Tạo sự kiện mới</h1>
      <Separator className='my-4' />
      <div className='rounded-lg border p-6 shadow-md'>
        {eventData && <EventForm eventEdit={eventData} />}
      </div>
    </div>
  );
};

export default EditEventPage;
