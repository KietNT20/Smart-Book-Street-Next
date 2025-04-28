'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  useGetAllEventRegistrations,
  useGetStatisticEventRegistrations,
} from '@/hooks/use-event-registrations';
import EventDetailDashboard from './_components/event-dashboard';
import { columns } from './columns';
import { DataTable } from './data-table';

export default function Page({ params }: { params: { id: string } }) {
  const { eventRegistrationsData } = useGetAllEventRegistrations(params.id);
  const { statisticData } = useGetStatisticEventRegistrations(params.id);
  return (
    <div className='container mx-auto py-10'>
      <Tabs defaultValue='attended' className='w-full'>
        <TabsList className='grid w-full grid-cols-2'>
          <TabsTrigger value='attended'>Điểm danh</TabsTrigger>
          <TabsTrigger value='statistic'>Thống kê</TabsTrigger>
        </TabsList>
        <TabsContent value='attended'>
          <DataTable columns={columns} data={eventRegistrationsData} />
        </TabsContent>
        <TabsContent value='statistic'>
          <EventDetailDashboard data={statisticData} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
