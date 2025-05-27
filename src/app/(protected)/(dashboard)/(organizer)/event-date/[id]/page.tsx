'use client';

import { PATH } from '@/enums/path';
import { useEntityBreadcrumb } from '@/hooks/use-breadcrumb-page';
import { useGetAllEventRegistrations } from '@/hooks/use-event-registrations';
import { columns } from './columns';
import { DataTable } from './data-table';

export default function Page({ params }: { params: { id: string } }) {
  const { eventRegistrationsData } = useGetAllEventRegistrations(params.id);
  useEntityBreadcrumb(
    PATH.EVENT_DATE,
    'Sự kiện hôm nay',
    params.id,
    'Danh sách đăng ký tham gia sự kiện'
  );
  return (
    <div className='container mx-auto'>
      <DataTable columns={columns} data={eventRegistrationsData} />
    </div>
  );
}
