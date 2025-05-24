'use client';

import { Separator } from '@/components/ui/separator';
import { PATH } from '@/enums/path';
import { useEntityBreadcrumb } from '@/hooks/use-breadcrumb-page';
import EventForm from './_components/event-form';

export default function EventCreationPage() {
  useEntityBreadcrumb(
    PATH.EVENT_CREATION,
    'Đăng ký sự kiện',
    '',
    'Đăng ký sự kiện'
  );
  return (
    <div>
      <div className='container mx-auto text-center'>
        <h1 className='text-3xl font-bold'>Đăng ký sự kiện tại đường sách</h1>
      </div>
      <Separator className='my-4' />
      <div className='rounded-lg border p-6 shadow-md'>
        <EventForm />
      </div>
    </div>
  );
}
