'use client';

import { Separator } from '@/components/ui/separator';
import { useEventMutaton } from '@/hooks/use-event';
import EventForm from './_components/event-form';

const EventPage = () => {
  const { createEvent, isEventPending } = useEventMutaton();
  const handleFormSubmit = (formData: FormData) => {
    createEvent(formData);
  };

  const defaultValues = {
    eventName: '',
    startDate: '',
    endDate: '',
    description: '',
    isOpen: true,
    allowAds: false,
    zoneId: '',
  };

  return (
    <div className='container mx-auto md:px-32 md:py-8'>
      <h1 className='text-3xl font-bold'>Tạo sự kiện mới</h1>
      <Separator className='my-4' />
      <div className='rounded-lg border p-6 shadow-md'>
        <EventForm
          onSubmit={handleFormSubmit}
          isSubmitting={isEventPending}
          defaultValues={defaultValues}
        />
      </div>
    </div>
  );
};

export default EventPage;
