'use client';

import { useGetEventsInDate } from '@/hooks/use-event';
import dayjs from 'dayjs';
import { columns } from './columns';
import { DataTable } from './data-table';

const Page = () => {
  const currentDate = dayjs().format('YYYY-MM-DD');

  const { eventsInDateData } = useGetEventsInDate(currentDate);

  return (
    <div className='container mx-auto'>
      <DataTable columns={columns} data={eventsInDateData} />
    </div>
  );
};

export default Page;
