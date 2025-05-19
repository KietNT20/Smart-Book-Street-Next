'use client';

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
import { Event } from '@/types/event-types';
import { AnimatePresence, motion } from 'framer-motion';
import { BarChart4, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';
import EventBarchart from '../event-barchart';
import EventChart from '../event-statistics-charts';
import StatisticsExportButton from '../export-excel-button';

interface EventStatisticsProps {
  eventId: string;
  eventData: Event | undefined | null;
}

export default function EventStatistics({
  eventId,
  eventData,
}: EventStatisticsProps) {
  const hasAgeChart = eventData?.ageChart && eventData.ageChart.length > 0;
  const hasGenderChart =
    eventData?.genderChart && eventData.genderChart.length > 0;
  const hasReferenceChart =
    eventData?.referenceChart && eventData.referenceChart.length > 0;
  const hasAddressChart =
    eventData?.addressChart && eventData.addressChart.length > 0;

  const hasAnyChart =
    hasAgeChart || hasGenderChart || hasReferenceChart || hasAddressChart;

  const [openCharts, setOpenCharts] = useState({
    age: false,
    gender: false,
    reference: false,
    address: false,
  });

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

  if (!hasAnyChart) return null;

  return (
    <Card>
      <CardHeader>
        <div className='flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0'>
          <div>
            <CardTitle className='flex items-center gap-2'>
              <BarChart4 className='h-5 w-5' />
              Thống kê người tham gia
            </CardTitle>
            <CardDescription>
              Tổng số người đăng ký: {eventData?.totalRegistrations || 0}
            </CardDescription>
          </div>
          <StatisticsExportButton eventId={eventId} eventData={eventData} />
        </div>
      </CardHeader>
      <CardContent className='space-y-4'>
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
                      Thống kê độ tuổi người tham gia
                    </div>
                    <EventBarchart
                      data={eventData.ageChart || []}
                      title='Phân bố độ tuổi'
                      description='Thống kê độ tuổi người tham gia'
                    />
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
                  <BarChart4 className='mr-2 h-4 w-4' />
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
                      Thống kê giới tính người tham gia
                    </div>
                    <EventChart
                      data={eventData?.genderChart || []}
                      title='Phân bố giới tính'
                      description='Thống kê giới tính người tham gia'
                      type='pie'
                      height={300}
                    />
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
                  <BarChart4 className='mr-2 h-4 w-4' />
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
                      Người tham gia biết về sự kiện qua đâu
                    </div>
                    <EventChart
                      data={eventData?.referenceChart || []}
                      title='Nguồn tham khảo'
                      description='Người tham gia biết về sự kiện qua đâu'
                      type='horizontalBar'
                      height={300}
                      colors={['hsl(var(--chart-2))']}
                    />
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
                  <BarChart4 className='mr-2 h-4 w-4' />
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
                      Thống kê nơi đến của người tham gia
                    </div>
                    <EventChart
                      data={eventData?.addressChart || []}
                      title='Phân bố địa điểm'
                      description='Thống kê nơi đến của người tham gia'
                      type='pie'
                      height={300}
                    />
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
