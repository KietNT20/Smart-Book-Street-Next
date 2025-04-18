'use client';

import { Separator } from '@/components/ui/separator';
import { useEffect, useState } from 'react';
import { ChartAreaInteractive } from './_components/dashboard/chart-area-interactive';
import ChartsSection from './_components/dashboard/charts-section';
import VisitorChartSection from './_components/dashboard/visitor-chart-section';
import LastUpdated from './_components/last-updated';
import OrderStatisticsPage from './_components/order-statics';
import SectionCards from './_components/section-cards';
import SyncButton from './_components/sync-button';

export default function DashboardPage() {
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  useEffect(() => {
    setLastUpdated(new Date());
  }, []);

  const handleSync = (syncTime: Date): void => {
    setLastUpdated(syncTime);
  };

  return (
    <>
      <div className='flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between'>
        <div>
          <h2 className='text-2xl font-bold'>DASHBOARD</h2>
          <LastUpdated lastUpdated={lastUpdated} className='mt-1' />
        </div>
        <SyncButton onSync={handleSync} />
      </div>
      <Separator className='my-4' />
      <SectionCards />
      <div className='flex flex-col gap-4 py-4 md:gap-6 md:py-6'>
        <ChartAreaInteractive />
        <ChartsSection />
      </div>
      <div className='mt-4'>
        <VisitorChartSection />
      </div>
      <div>
        <OrderStatisticsPage />
      </div>
    </>
  );
}
