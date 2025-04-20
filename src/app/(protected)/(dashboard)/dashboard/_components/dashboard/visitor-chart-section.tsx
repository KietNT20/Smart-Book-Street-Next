'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useGetPersonStatsHours } from '@/hooks/use-person';
import { DatePicker, DatePickerProps } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import 'dayjs/locale/vi';
import { TrendingUp } from 'lucide-react';
import { useState } from 'react';
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

dayjs.locale('vi');

const VisitorChartSection = () => {
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const dateString = selectedDate.format('YYYY-MM-DD');
  const { statsHours, isLoading } = useGetPersonStatsHours(dateString);

  // Calculate total visitors and find peak hours
  const calculateChartStatistics = () => {
    let totalVisitors = 0;
    let maxVisitors = 0;
    let peakHour = '';

    statsHours?.forEach((data) => {
      totalVisitors += data.total;
      if (data.total > maxVisitors) {
        maxVisitors = data.total;
        peakHour = data.hour;
      }
    });

    // Calculate average visitors per hour
    const avgVisitorsPerHour = Math.round(totalVisitors / 24);

    return {
      totalVisitors,
      peakHour,
      avgVisitorsPerHour,
      maxVisitors,
    };
  };

  const stats = calculateChartStatistics();

  // Calculate gender ratio
  const calculateGenderRatio = () => {
    let totalMale = 0;
    let totalFemale = 0;

    statsHours?.forEach((data) => {
      totalMale += data.male;
      totalFemale += data.female;
    });

    const total = totalMale + totalFemale;

    if (total === 0) return { male: 0, female: 0 };

    const malePercent = Math.round((totalMale / total) * 100);
    const femalePercent = 100 - malePercent; // To ensure they add up to 100%

    return { male: malePercent, female: femalePercent };
  };

  const genderRatio = calculateGenderRatio();

  const handleDateChange: DatePickerProps['onChange'] = (
    date: Dayjs | null
  ) => {
    if (date) {
      setSelectedDate(date);
    }
  };

  return (
    <div className='gap-4 lg:flex'>
      <Card className='flex-1'>
        <CardHeader>
          <div className='items-center justify-between md:flex'>
            <div className='mb-4 md:mb-0'>
              <CardTitle>Lượt khách theo giờ</CardTitle>
              <CardDescription>
                Thống kê số lượng khách theo từng khung giờ và giới tính
              </CardDescription>
            </div>
            <DatePicker
              value={selectedDate}
              onChange={handleDateChange}
              allowClear={false}
              format='DD/MM/YYYY'
              placeholder='Chọn ngày'
              className='h-10 px-3 py-2'
            />
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className='flex h-[300px] items-center justify-center'>
              <p>Đang tải dữ liệu...</p>
            </div>
          ) : (
            <div className='h-[300px]'>
              <ResponsiveContainer width='100%' height='100%'>
                <LineChart data={statsHours || []}>
                  <CartesianGrid strokeDasharray='3 3' />
                  <XAxis
                    dataKey='hour'
                    tick={{ fontSize: 12 }}
                    interval='preserveStartEnd'
                  />
                  <YAxis />
                  <Tooltip
                    content={({ active, payload, label }) => {
                      if (active && payload && payload.length >= 2) {
                        const male = Number(payload[0].value || 0);
                        const female = Number(payload[1].value || 0);
                        const total = male + female;

                        return (
                          <div className='rounded-md border border-gray-200 bg-white p-2 shadow-md'>
                            <p className='font-bold'>{`${label}`}</p>
                            <p className='text-chart-1'>{`Nam: ${male}`}</p>
                            <p className='text-chart-2'>{`Nữ: ${female}`}</p>
                            <p className='mt-1 border-t pt-1 font-medium'>{`Tổng: ${total}`}</p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Legend />
                  <Line
                    type='monotone'
                    dataKey='male'
                    stroke='hsl(var(--chart-1))'
                    name='Nam'
                    strokeWidth={2}
                    dot={{ r: 3 }}
                  />
                  <Line
                    type='monotone'
                    dataKey='female'
                    stroke='hsl(var(--chart-2))'
                    name='Nữ'
                    strokeWidth={2}
                    dot={{ r: 3 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </CardContent>
        <CardFooter className='flex-col gap-2 text-sm'>
          <div className='flex items-center gap-2 font-medium leading-none'>
            Giờ cao điểm:{' '}
            {stats.peakHour
              ? `${stats.peakHour} (${stats.maxVisitors} người)`
              : 'Không có dữ liệu'}{' '}
            {stats.peakHour && <TrendingUp className='h-4 w-4' />}
          </div>
          <div className='leading-none text-muted-foreground'>
            Trung bình {stats.avgVisitorsPerHour} khách/giờ | Tỷ lệ Nam/Nữ:{' '}
            {genderRatio.male}%/{genderRatio.female}%
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default VisitorChartSection;
