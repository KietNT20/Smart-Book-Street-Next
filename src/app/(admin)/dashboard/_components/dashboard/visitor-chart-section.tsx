'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { TrendingUp } from 'lucide-react';
import { useState } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts';

// Types
interface HourlyData {
  hour: string;
  visitors: number;
}

interface DemographicsData {
  ageGroup: string;
  male: number;
  female: number;
}

type TimeRangeShort = 'today' | 'yesterday' | 'this-week' | 'last-week';
type TimeRangeLong =
  | 'this-month'
  | 'last-month'
  | 'this-quarter'
  | 'last-quarter';

// Sample data
const hourlyData: HourlyData[] = [
  { hour: '06:00', visitors: 30 },
  { hour: '08:00', visitors: 120 },
  { hour: '10:00', visitors: 250 },
  { hour: '12:00', visitors: 180 },
  { hour: '14:00', visitors: 310 },
  { hour: '16:00', visitors: 280 },
  { hour: '18:00', visitors: 150 },
  { hour: '20:00', visitors: 80 }
];

const demographicsData: DemographicsData[] = [
  { ageGroup: '0-18', male: 320, female: 400 },
  { ageGroup: '19-24', male: 800, female: 1000 },
  { ageGroup: '25-35', male: 650, female: 700 },
  { ageGroup: '36-50', male: 450, female: 500 },
  { ageGroup: '>50', male: 200, female: 180 }
];

const VisitorChartSection = () => {
  const [hourlyTimeRange, setHourlyTimeRange] =
    useState<TimeRangeShort>('today');
  const [demographicsTimeRange, setDemographicsTimeRange] =
    useState<TimeRangeLong>('this-month');

  return (
    <div className='gap-4 lg:flex'>
      {/* Biểu đồ số lượng khách theo giờ */}
      <Card className='flex-1'>
        <CardHeader>
          <div className='items-center justify-between md:flex'>
            <div className='mb-4 md:mb-0'>
              <CardTitle>Lượt khách theo giờ</CardTitle>
              <CardDescription>
                Thống kê số lượng khách theo từng khung giờ
              </CardDescription>
            </div>
            <Select
              value={hourlyTimeRange}
              onValueChange={(value: TimeRangeShort) =>
                setHourlyTimeRange(value)
              }
            >
              <SelectTrigger className='w-[180px]'>
                <SelectValue placeholder='Chọn thời gian' />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Thời gian</SelectLabel>
                  <SelectItem value='today'>Hôm nay</SelectItem>
                  <SelectItem value='yesterday'>Hôm qua</SelectItem>
                  <SelectItem value='this-week'>Tuần này</SelectItem>
                  <SelectItem value='last-week'>Tuần trước</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <div className='h-[300px]'>
            <ResponsiveContainer width='100%' height='100%'>
              <LineChart data={hourlyData}>
                <CartesianGrid strokeDasharray='3 3' />
                <XAxis dataKey='hour' />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type='monotone'
                  dataKey='visitors'
                  stroke='hsl(var(--chart-1))'
                  name='Số lượng khách'
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
        <CardFooter className='flex-col gap-2 text-sm'>
          <div className='flex items-center gap-2 font-medium leading-none'>
            Giờ cao điểm: 14:00 - 16:00 <TrendingUp className='h-4 w-4' />
          </div>
          <div className='leading-none text-muted-foreground'>
            Trung bình 175 khách/giờ
          </div>
        </CardFooter>
      </Card>

      {/* Biểu đồ phân bố độ tuổi và giới tính */}
      <Card className='mt-4 flex-1 lg:mt-0'>
        <CardHeader>
          <div className='items-center justify-between md:flex'>
            <div className='mb-4 md:mb-0'>
              <CardTitle>Phân bố độ tuổi và giới tính</CardTitle>
              <CardDescription>
                Thống kê theo nhóm tuổi và giới tính
              </CardDescription>
            </div>
            <Select
              value={demographicsTimeRange}
              onValueChange={(value: TimeRangeLong) =>
                setDemographicsTimeRange(value)
              }
            >
              <SelectTrigger className='w-[180px]'>
                <SelectValue placeholder='Chọn thời gian' />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Thời gian</SelectLabel>
                  <SelectItem value='this-month'>Tháng này</SelectItem>
                  <SelectItem value='last-month'>Tháng trước</SelectItem>
                  <SelectItem value='this-quarter'>Quý này</SelectItem>
                  <SelectItem value='last-quarter'>Quý trước</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <div className='h-[300px]'>
            <ResponsiveContainer width='100%' height='100%'>
              <BarChart data={demographicsData}>
                <CartesianGrid strokeDasharray='3 3' />
                <XAxis dataKey='ageGroup' />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey='male' name='Nam' fill='hsl(var(--chart-1))' />
                <Bar dataKey='female' name='Nữ' fill='hsl(var(--chart-2))' />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
        <CardFooter className='flex-col gap-2 text-sm'>
          <div className='flex items-center gap-2 font-medium leading-none'>
            Độ tuổi phổ biến nhất: 19-24 <TrendingUp className='h-4 w-4' />
          </div>
          <div className='leading-none text-muted-foreground'>
            Tỷ lệ Nam/Nữ: 45%/55%
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default VisitorChartSection;
