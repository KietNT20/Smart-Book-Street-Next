'use client';

import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useGetPersonTotal } from '@/hooks/use-person';
import { BookOpen, Clock, UserCheck, Users } from 'lucide-react';
import { useEffect, useState } from 'react';
import { ChartAreaInteractive } from './_components/dashboard/chart-area-interactive';
import ChartsSection from './_components/dashboard/charts-section';
import VisitorChartSection from './_components/dashboard/visitor-chart-section';
import LastUpdated from './_components/last-updated';
import OrderStatisticsPage from './_components/order-statics';
import SyncButton from './_components/sync-button';

export default function DashboardPage() {
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [formattedTotal, setFormattedTotal] = useState<string>('');

  const { total, isLoading } = useGetPersonTotal();

  const formatNumber = (num: number): string => {
    if (!num) return '';
    return new Intl.NumberFormat().format(num);
  };

  useEffect(() => {
    if (!isLoading && total !== undefined) {
      setFormattedTotal(formatNumber(total));
    }
  }, [total, isLoading]);

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
      <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
        <Card className='shadow-xs bg-chart-1 from-primary/5 to-card'>
          <CardHeader className='relative'>
            <CardDescription className='text-white'>
              Tổng số người camera phát hiện
            </CardDescription>
            <CardTitle className='text-2xl font-semibold tabular-nums text-white md:text-3xl'>
              {isLoading ? 'Đang tải' : formattedTotal}
            </CardTitle>
            <div className='absolute right-4 top-4'>
              <Users className='text-blue-100' />
            </div>
          </CardHeader>
        </Card>

        <Card className='shadow-xs bg-chart-2 from-primary/5 to-card'>
          <CardHeader className='relative'>
            <CardDescription className='text-white'>
              Tổng Số Sách
            </CardDescription>
            <CardTitle className='text-2xl font-semibold tabular-nums text-white md:text-3xl'>
              8,432
            </CardTitle>
            <div className='absolute right-4 top-4'>
              <BookOpen className='text-purple-100' />
            </div>
          </CardHeader>
          <CardFooter className='flex-col items-start gap-1 text-sm'>
            <div className='line-clamp-1 flex gap-2 font-medium text-purple-100'>
              +123 đầu sách mới trong tháng
            </div>
          </CardFooter>
        </Card>

        <Card className='shadow-xs bg-chart-3 from-primary/5 to-card'>
          <CardHeader className='relative'>
            <CardDescription className='text-white'>
              Các đối tác
            </CardDescription>
            <CardTitle className='text-2xl font-semibold tabular-nums text-white md:text-3xl'>
              46
            </CardTitle>
            <div className='absolute right-4 top-4'>
              <UserCheck className='text-green-100' />
            </div>
          </CardHeader>
          <CardFooter className='flex-col items-start gap-1 text-sm'>
            <div className='line-clamp-1 flex gap-2 font-medium text-purple-100'>
              +21 đối tác mới trong tháng
            </div>
          </CardFooter>
        </Card>

        <Card className='shadow-xs bg-chart-4 from-primary/5 to-card'>
          <CardHeader className='relative'>
            <CardDescription className='text-white'>
              Thời Gian Trung Bình
            </CardDescription>
            <CardTitle className='text-2xl font-semibold tabular-nums text-white md:text-3xl'>
              45 phút
            </CardTitle>
            <div className='absolute right-4 top-4'>
              <Clock className='text-orange-100' />
            </div>
          </CardHeader>
          <CardFooter className='flex-col items-start gap-1 text-sm'>
            <div className='line-clamp-1 flex gap-2 font-medium text-purple-100'>
              Thời gian tham quan trung bình
            </div>
          </CardFooter>
        </Card>
      </div>
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
