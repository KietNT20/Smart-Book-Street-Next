'use client';

import { useGetAllEventRegistrations } from '@/hooks/use-event-registrations';
import { columns } from './columns';
import { DataTable } from './data-table';

export default function Page({ params }: { params: { id: string } }) {
  const { eventRegistrationsData } = useGetAllEventRegistrations(params.id);
  return (
    <div className='container mx-auto py-10'>
      <DataTable columns={columns} data={eventRegistrationsData} />
    </div>
  );
}
