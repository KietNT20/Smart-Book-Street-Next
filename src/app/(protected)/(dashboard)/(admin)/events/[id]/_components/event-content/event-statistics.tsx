'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { useGetStatisticEventRegistrations } from '@/hooks/use-event-registrations';
import { AnimatePresence, motion } from 'framer-motion';
import {
  BarChart4,
  ChevronDown,
  ChevronUp,
  PieChart,
  UserCheck,
  Users,
  UserX,
} from 'lucide-react';
import { useState } from 'react';
import EventBarchart from '../event-barchart';
import EventChart from '../event-statistics-charts';
import StatisticsExportButton from '../export-excel-button';

interface EventStatisticsProps {
  eventId: string;
}

type StatisticFilter = 'all' | 'checkedIn' | 'notCheckedIn';

export default function EventStatistics({ eventId }: EventStatisticsProps) {
  const [statisticFilter, setStatisticFilter] =
    useState<StatisticFilter>('all');
  const [openCharts, setOpenCharts] = useState({
    age: false,
    gender: false,
    reference: false,
    address: false,
    attendedBefore: false,
  });

  // Convert filter to hook parameter
  const getHookParam = (filter: StatisticFilter): boolean | undefined => {
    switch (filter) {
      case 'all':
        return undefined;
      case 'checkedIn':
        return true;
      case 'notCheckedIn':
        return false;
      default:
        return undefined;
    }
  };

  const { statisticData } = useGetStatisticEventRegistrations(
    eventId,
    getHookParam(statisticFilter)
  );

  const hasAgeChart =
    statisticData?.ageChart && statisticData.ageChart.length > 0;
  const hasGenderChart =
    statisticData?.genderChart && statisticData.genderChart.length > 0;
  const hasReferenceChart =
    statisticData?.referenceChart && statisticData.referenceChart.length > 0;
  const hasAddressChart =
    statisticData?.addressChart && statisticData.addressChart.length > 0;
  const hasAttendedBeforeChart =
    statisticData?.attendedBeforeChart &&
    statisticData.attendedBeforeChart.length > 0;

  const hasAnyChart =
    hasAgeChart ||
    hasGenderChart ||
    hasReferenceChart ||
    hasAddressChart ||
    hasAttendedBeforeChart;

  const toggleChart = (chart: keyof typeof openCharts) => {
    setOpenCharts((prev) => ({
      ...prev,
      [chart]: !prev[chart],
    }));
  };

  const contentVariants = {
    hidden: {
      opacity: 0,
      height: 0,
      transition: {
        duration: 0.3,
        ease: 'easeInOut',
      },
    },
    visible: {
      opacity: 1,
      height: 'auto',
      transition: {
        duration: 0.3,
        ease: 'easeInOut',
      },
    },
  };

  const getFilterLabel = (filter: StatisticFilter) => {
    switch (filter) {
      case 'all':
        return 'Tất cả người đăng ký';
      case 'checkedIn':
        return 'Đã check-in';
      case 'notCheckedIn':
        return 'Chưa check-in';
      default:
        return 'Tất cả người đăng ký';
    }
  };

  if (!hasAnyChart) return null;

  return (
    <Card className='overflow-hidden'>
      <CardHeader>
        <div className='flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0'>
          <div>
            <CardTitle className='flex items-center gap-2'>
              <BarChart4 className='h-5 w-5' />
              Thống kê người tham gia
            </CardTitle>
            <div className='mt-2 flex flex-col gap-2'>
              <CardDescription>
                {getFilterLabel(statisticFilter)}:{' '}
                {statisticData?.totalRegistrations || 0}
              </CardDescription>
              {statisticFilter === 'all' && statisticData?.participation && (
                <div className='flex items-center gap-2'>
                  <Badge variant='secondary' className='text-xs'>
                    <UserCheck className='mr-1 h-3 w-3' />
                    Đã tham dự: {statisticData.participation}
                  </Badge>
                  <Badge variant='outline' className='text-xs'>
                    Tỷ lệ: {statisticData.participationRate}
                  </Badge>
                </div>
              )}
            </div>
          </div>
          <StatisticsExportButton eventId={eventId} />
        </div>

        {/* Filter Buttons */}
        <div className='flex flex-wrap gap-2 border-t pt-4'>
          <Button
            variant={statisticFilter === 'all' ? 'default' : 'outline'}
            size='sm'
            onClick={() => setStatisticFilter('all')}
            className='flex items-center gap-2'
          >
            <Users className='h-4 w-4' />
            Tất cả
            {statisticFilter === 'all' && statisticData?.totalRegistrations && (
              <Badge variant='secondary' className='ml-1'>
                {statisticData.totalRegistrations}
              </Badge>
            )}
          </Button>
          <Button
            variant={statisticFilter === 'checkedIn' ? 'default' : 'outline'}
            size='sm'
            onClick={() => setStatisticFilter('checkedIn')}
            className='flex items-center gap-2'
          >
            <UserCheck className='h-4 w-4' />
            Đã check-in
            {statisticFilter === 'checkedIn' &&
              statisticData?.totalRegistrations && (
                <Badge variant='secondary' className='ml-1'>
                  {statisticData.totalRegistrations}
                </Badge>
              )}
          </Button>
          <Button
            variant={statisticFilter === 'notCheckedIn' ? 'default' : 'outline'}
            size='sm'
            onClick={() => setStatisticFilter('notCheckedIn')}
            className='flex items-center gap-2'
          >
            <UserX className='h-4 w-4' />
            Chưa check-in
            {statisticFilter === 'notCheckedIn' &&
              statisticData?.totalRegistrations && (
                <Badge variant='secondary' className='ml-1'>
                  {statisticData.totalRegistrations}
                </Badge>
              )}
          </Button>
        </div>
      </CardHeader>

      <CardContent className='space-y-4 overflow-hidden'>
        {/* Age Chart Collapsible */}
        {hasAgeChart && (
          <Collapsible
            open={openCharts.age}
            onOpenChange={() => toggleChart('age')}
            className='overflow-hidden rounded-md border'
          >
            <CollapsibleTrigger asChild>
              <Button
                variant='ghost'
                className='flex w-full items-center justify-between p-4'
              >
                <div className='flex items-center font-medium'>
                  <BarChart4 className='mr-2 h-4 w-4' />
                  Phân bố độ tuổi
                </div>
                {openCharts.age ? (
                  <ChevronUp className='h-4 w-4' />
                ) : (
                  <ChevronDown className='h-4 w-4' />
                )}
              </Button>
            </CollapsibleTrigger>
            <AnimatePresence initial={false}>
              {openCharts.age && (
                <CollapsibleContent forceMount className='overflow-hidden'>
                  <motion.div
                    variants={contentVariants}
                    initial='hidden'
                    animate='visible'
                    exit='hidden'
                    className='px-4 pb-4'
                  >
                    <div className='mb-4 text-sm text-muted-foreground'>
                      Thống kê độ tuổi - {getFilterLabel(statisticFilter)}
                    </div>
                    <div className='w-full'>
                      <EventBarchart
                        data={statisticData.ageChart || []}
                        title='Phân bố độ tuổi'
                        description={`Thống kê độ tuổi - ${getFilterLabel(statisticFilter)}`}
                      />
                    </div>
                  </motion.div>
                </CollapsibleContent>
              )}
            </AnimatePresence>
          </Collapsible>
        )}

        {/* Gender Chart Collapsible */}
        {hasGenderChart && (
          <Collapsible
            open={openCharts.gender}
            onOpenChange={() => toggleChart('gender')}
            className='overflow-hidden rounded-md border'
          >
            <CollapsibleTrigger asChild>
              <Button
                variant='ghost'
                className='flex w-full items-center justify-between p-4'
              >
                <div className='flex items-center font-medium'>
                  <PieChart className='mr-2 h-4 w-4' />
                  Phân bố giới tính
                </div>
                {openCharts.gender ? (
                  <ChevronUp className='h-4 w-4' />
                ) : (
                  <ChevronDown className='h-4 w-4' />
                )}
              </Button>
            </CollapsibleTrigger>
            <AnimatePresence initial={false}>
              {openCharts.gender && (
                <CollapsibleContent forceMount className='overflow-hidden'>
                  <motion.div
                    variants={contentVariants}
                    initial='hidden'
                    animate='visible'
                    exit='hidden'
                    className='px-4 pb-4'
                  >
                    <div className='mb-4 text-sm text-muted-foreground'>
                      Thống kê giới tính - {getFilterLabel(statisticFilter)}
                    </div>
                    <div className='w-full'>
                      <EventChart
                        data={statisticData?.genderChart || []}
                        title='Phân bố giới tính'
                        description={`Thống kê giới tính - ${getFilterLabel(statisticFilter)}`}
                        type='pie'
                        height={300}
                      />
                    </div>
                  </motion.div>
                </CollapsibleContent>
              )}
            </AnimatePresence>
          </Collapsible>
        )}

        {/* Reference Chart Collapsible */}
        {hasReferenceChart && (
          <Collapsible
            open={openCharts.reference}
            onOpenChange={() => toggleChart('reference')}
            className='overflow-hidden rounded-md border'
          >
            <CollapsibleTrigger asChild>
              <Button
                variant='ghost'
                className='flex w-full items-center justify-between p-4'
              >
                <div className='flex items-center font-medium'>
                  <PieChart className='mr-2 h-4 w-4' />
                  Nguồn tham khảo
                </div>
                {openCharts.reference ? (
                  <ChevronUp className='h-4 w-4' />
                ) : (
                  <ChevronDown className='h-4 w-4' />
                )}
              </Button>
            </CollapsibleTrigger>
            <AnimatePresence initial={false}>
              {openCharts.reference && (
                <CollapsibleContent forceMount className='overflow-hidden'>
                  <motion.div
                    variants={contentVariants}
                    initial='hidden'
                    animate='visible'
                    exit='hidden'
                    className='px-4 pb-4'
                  >
                    <div className='mb-4 text-sm text-muted-foreground'>
                      Người tham gia biết về sự kiện qua đâu -{' '}
                      {getFilterLabel(statisticFilter)}
                    </div>
                    <div className='w-full'>
                      <EventChart
                        data={statisticData?.referenceChart || []}
                        title='Nguồn tham khảo'
                        description={`Người tham gia biết về sự kiện qua đâu - ${getFilterLabel(statisticFilter)}`}
                        type='pie'
                        height={300}
                      />
                    </div>
                  </motion.div>
                </CollapsibleContent>
              )}
            </AnimatePresence>
          </Collapsible>
        )}

        {/* Address Chart Collapsible */}
        {hasAddressChart && (
          <Collapsible
            open={openCharts.address}
            onOpenChange={() => toggleChart('address')}
            className='overflow-hidden rounded-md border'
          >
            <CollapsibleTrigger asChild>
              <Button
                variant='ghost'
                className='flex w-full items-center justify-between p-4'
              >
                <div className='flex items-center font-medium'>
                  <PieChart className='mr-2 h-4 w-4' />
                  Phân bố địa điểm
                </div>
                {openCharts.address ? (
                  <ChevronUp className='h-4 w-4' />
                ) : (
                  <ChevronDown className='h-4 w-4' />
                )}
              </Button>
            </CollapsibleTrigger>
            <AnimatePresence initial={false}>
              {openCharts.address && (
                <CollapsibleContent forceMount className='overflow-hidden'>
                  <motion.div
                    variants={contentVariants}
                    initial='hidden'
                    animate='visible'
                    exit='hidden'
                    className='px-4 pb-4'
                  >
                    <div className='mb-4 text-sm text-muted-foreground'>
                      Thống kê nơi đến của người tham gia -{' '}
                      {getFilterLabel(statisticFilter)}
                    </div>
                    <div className='w-full'>
                      <EventChart
                        data={statisticData?.addressChart || []}
                        title='Phân bố địa điểm'
                        description={`Thống kê nơi đến của người tham gia - ${getFilterLabel(statisticFilter)}`}
                        type='pie'
                        height={300}
                      />
                    </div>
                  </motion.div>
                </CollapsibleContent>
              )}
            </AnimatePresence>
          </Collapsible>
        )}

        {/* Attended Before Chart Collapsible */}
        {hasAttendedBeforeChart && (
          <Collapsible
            open={openCharts.attendedBefore}
            onOpenChange={() => toggleChart('attendedBefore')}
            className='overflow-hidden rounded-md border'
          >
            <CollapsibleTrigger asChild>
              <Button
                variant='ghost'
                className='flex w-full items-center justify-between p-4'
              >
                <div className='flex items-center font-medium'>
                  <PieChart className='mr-2 h-4 w-4' />
                  Lịch sử tham gia
                </div>
                {openCharts.attendedBefore ? (
                  <ChevronUp className='h-4 w-4' />
                ) : (
                  <ChevronDown className='h-4 w-4' />
                )}
              </Button>
            </CollapsibleTrigger>
            <AnimatePresence initial={false}>
              {openCharts.attendedBefore && (
                <CollapsibleContent forceMount className='overflow-hidden'>
                  <motion.div
                    variants={contentVariants}
                    initial='hidden'
                    animate='visible'
                    exit='hidden'
                    className='px-4 pb-4'
                  >
                    <div className='mb-4 text-sm text-muted-foreground'>
                      Thống kê lịch sử tham gia sự kiện -{' '}
                      {getFilterLabel(statisticFilter)}
                    </div>
                    <div className='w-full'>
                      <EventChart
                        data={statisticData?.attendedBeforeChart || []}
                        title='Lịch sử tham gia'
                        description={`Thống kê lịch sử tham gia sự kiện - ${getFilterLabel(statisticFilter)}`}
                        type='pie'
                        height={300}
                      />
                    </div>
                  </motion.div>
                </CollapsibleContent>
              )}
            </AnimatePresence>
          </Collapsible>
        )}
      </CardContent>
    </Card>
  );
}
