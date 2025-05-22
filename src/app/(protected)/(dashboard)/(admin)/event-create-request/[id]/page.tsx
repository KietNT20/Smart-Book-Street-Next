'use client';
import { PATH } from '@/enums/path';
import { useEntityBreadcrumb } from '@/hooks/use-breadcrumb-page';
import { useGetEventById } from '@/hooks/use-event';

export default function Page({ params }: { params: { id: string } }) {
  const { eventData } = useGetEventById(params.id);
  useEntityBreadcrumb(
    PATH.EVENT_CREATION_REQUEST,
    'Yêu cầu tạo sự kiện',
    params.id,
    eventData?.eventName
  );
  return <h1>My Page</h1>;
}
