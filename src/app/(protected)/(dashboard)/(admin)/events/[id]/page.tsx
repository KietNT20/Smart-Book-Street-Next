'use client';

import BackButton from '@/components/back-btn/back-button';
import { Button } from '@/components/ui/button';
import { PATH } from '@/enums/path';
import { useEntityBreadcrumb } from '@/hooks/use-breadcrumb-page';
import { useGetEventById } from '@/hooks/use-event';
import Link from 'next/link';
import EventContent from './_components/event-content';
import EventHero from './_components/event-hero';
import EventSidebar from './_components/event-sidebar';

export default function EventDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const { eventData } = useGetEventById(params.id);

  useEntityBreadcrumb(PATH.EVENTS, 'Sự kiện', params.id, eventData?.eventName);

  return (
    <div className='min-h-screen bg-background pb-16'>
      <div className='mx-auto my-4 flex items-center justify-between px-4'>
        <BackButton />
        <Link href={`${PATH.EVENTS}/${params.id}/edit`}>
          <Button>Chỉnh sửa</Button>
        </Link>
      </div>

      {/* Hero Section */}
      <div className='mx-auto px-4'>
        <EventHero eventData={eventData} />
      </div>

      {/* Content */}
      <div className='mx-auto mt-8 px-4'>
        <div className='grid grid-cols-1 gap-8 md:grid-cols-3'>
          {/* Main Content */}
          <EventContent eventId={params.id} eventData={eventData} />

          {/* Sidebar */}
          <EventSidebar eventData={eventData} />
        </div>
      </div>
    </div>
  );
}
