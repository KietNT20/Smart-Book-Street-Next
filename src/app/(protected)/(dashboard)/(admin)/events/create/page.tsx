import { Separator } from '@/components/ui/separator';
import EventForm from '../_components/event-form';

const EventCreatePage = () => {
  return (
    <div className='container mx-auto md:px-20 md:py-8'>
      <h1 className='text-3xl font-bold'>Tạo sự kiện mới</h1>
      <Separator className='my-4' />
      <div className='rounded-lg border p-6 shadow-md'>
        <EventForm />
      </div>
    </div>
  );
};

export default EventCreatePage;
