'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { BarDatum } from '@/types/person-types';
import { DatePicker } from 'antd';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import { TrendingUp } from 'lucide-react';
import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts';

const { RangePicker } = DatePicker;

// const getYearMonth = (date: Dayjs) => date.year() * 12 + date.month();

// const disabled7DaysDate: DatePickerProps['disabledDate'] = (
//   current,
//   { from, type }
// ) => {
//   if (from) {
//     const minDate = from.subtract(7, 'days');
//     const maxDate = from.add(7, 'days');

//     switch (type) {
//       case 'year':
//         return (
//           current.year() < minDate.year() || current.year() > maxDate.year()
//         );
//       case 'month':
//         return (
//           getYearMonth(current) < getYearMonth(minDate) ||
//           getYearMonth(current) > getYearMonth(maxDate)
//         );
//       default:
//         return Math.abs(current.diff(from, 'days')) > 7;
//     }
//   }
//   return false;
// };

type Props = {
  barData: BarDatum[];
  barConfig: {
    male: { label: string; color: string };
    female: { label: string; color: string };
  };
  isLoading?: boolean;
  dateRange: [Dayjs, Dayjs];
  onDateRangeChange: (dateRange: [Dayjs, Dayjs]) => void;
};

const BarchartCard = ({
  barData,
  barConfig,
  isLoading,
  dateRange,
  onDateRangeChange,
}: Props) => {
  // Format date for display
  const formatDate = (date: string) => {
    return dayjs(date).format('DD/MM');
  };

  // Check if the date is within the selected range
  const filteredData = barData.filter((item) => {
    const itemDate = dayjs(item.day);
    return (
      (dateRange[0]
        ? itemDate.isAfter(dateRange[0], 'day') ||
          itemDate.isSame(dateRange[0], 'day')
        : true) &&
      (dateRange[1]
        ? itemDate.isBefore(dateRange[1], 'day') ||
          itemDate.isSame(dateRange[1], 'day')
        : true)
    );
  });

  // Handle date range change
  const handleRangeChange = (dates: [Dayjs | null, Dayjs | null] | null) => {
    if (dates && dates[0] && dates[1]) {
      onDateRangeChange([dates[0], dates[1]]);
    }
  };

  const getDescriptionText = () => {
    if (dateRange && dateRange.length === 2) {
      return `Dữ liệu từ ${dateRange[0].format('DD/MM/YYYY')} - ${dateRange[1].format('DD/MM/YYYY')}`;
    }
    return 'Chọn khoảng thời gian để hiển thị dữ liệu';
  };

  const totalMale = filteredData.reduce((sum, item) => sum + item.male, 0);
  const totalFemale = filteredData.reduce((sum, item) => sum + item.female, 0);
  const totalVisitors = totalMale + totalFemale;

  return (
    <Card className='mb-4 flex-[2] lg:mb-0'>
      <CardHeader>
        <div className='md:flex md:items-center md:justify-between'>
          <div className='mb-4 md:mb-0'>
            <CardTitle>Lượt tham quan</CardTitle>
            <CardDescription className='mt-3'>
              {getDescriptionText()}
            </CardDescription>
          </div>
          <div className='bg-background'>
            <RangePicker
              className='h-10 px-3 py-2'
              value={dateRange}
              onChange={handleRangeChange}
              // disabledDate={disabled7DaysDate}
              allowClear={false}
              format='DD/MM/YYYY'
              placeholder={['Từ ngày', 'Đến ngày']}
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className='flex h-64 items-center justify-center'>
            <p>Đang tải dữ liệu...</p>
          </div>
        ) : filteredData.length > 0 ? (
          <ChartContainer config={barConfig}>
            <BarChart
              accessibilityLayer
              data={filteredData}
              margin={{ top: 10, right: 30, left: 0, bottom: 5 }}
            >
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey='day'
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                tickFormatter={formatDate}
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent indicator='dashed' />}
              />
              <Bar dataKey='male' fill='hsl(var(--chart-1))' radius={4} />
              <Bar dataKey='female' fill='hsl(var(--chart-2))' radius={4} />
            </BarChart>
          </ChartContainer>
        ) : (
          <div className='flex h-64 items-center justify-center'>
            <p>Không có dữ liệu trong khoảng thời gian đã chọn</p>
          </div>
        )}
      </CardContent>
      <CardFooter className='flex-col items-start gap-2 text-sm'>
        <div className='flex gap-2 font-medium leading-none'>
          {filteredData.length > 0 ? (
            <>
              Tổng lượt tham quan: {totalVisitors} (Nam: {totalMale}, Nữ:{' '}
              {totalFemale})
              {totalVisitors > 0 && <TrendingUp className='size-4' />}
            </>
          ) : (
            'Chưa có dữ liệu'
          )}
        </div>
        <div className='leading-none text-muted-foreground'>
          {dateRange[0] && dateRange[1]
            ? `Thống kê lượt tham quan theo giới tính trong ${dateRange[1].diff(dateRange[0], 'days') + 1} ngày`
            : 'Thống kê lượt tham quan theo giới tính'}
        </div>
      </CardFooter>
    </Card>
  );
};

export default BarchartCard;
