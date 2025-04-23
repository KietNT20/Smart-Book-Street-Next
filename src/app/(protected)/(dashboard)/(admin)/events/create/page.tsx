import { Separator } from '@/components/ui/separator';
import dynamic from 'next/dynamic';

const EventForm = dynamic(() => import('../_components/event-form'), {
  ssr: false,
});

const EventCreatePage = () => {
  return (
    <div className='container mx-auto md:px-14 md:py-4'>
      <h1 className='text-3xl font-bold'>Tạo sự kiện mới</h1>
      <Separator className='my-4' />
      <div className='rounded-lg border p-6 shadow-md'>
        <EventForm />
      </div>
    </div>
  );
};

export default EventCreatePage;
