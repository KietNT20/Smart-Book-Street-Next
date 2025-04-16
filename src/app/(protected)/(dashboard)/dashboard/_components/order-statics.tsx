'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DatePicker } from 'antd';
import dayjs from 'dayjs';
import 'dayjs/locale/vi';
import { useState } from 'react';
import {
  OrderChartAdmin,
  StatisticsTimeframe,
} from './dashboard/chart-bar-mixed';

// Setup dayjs
dayjs.locale('vi');

export default function OrderStatisticsPage() {
  // State for current timeframe
  const [timeframe, setTimeframe] = useState<StatisticsTimeframe>('daily');

  // Date state for daily stats
  const [selectedDate, setSelectedDate] = useState<dayjs.Dayjs>(dayjs());

  // Month and year state for monthly stats
  const [selectedMonthYear, setSelectedMonthYear] =
    useState<dayjs.Dayjs>(dayjs());

  // Year state for yearly stats
  const [selectedYear, setSelectedYear] = useState<dayjs.Dayjs>(dayjs());

  // Format date for API
  const formattedDate = selectedDate.format('YYYY-MM-DD');

  return (
    <div className='container mx-auto space-y-6 py-6'>
      <h1 className='text-3xl font-bold'>Thống Kê Đơn Hàng</h1>

      <Tabs
        defaultValue='daily'
        value={timeframe}
        onValueChange={(value) => setTimeframe(value as StatisticsTimeframe)}
        className='w-full'
      >
        <TabsList className='mb-6'>
          <TabsTrigger value='daily'>Theo Ngày</TabsTrigger>
          <TabsTrigger value='monthly'>Theo Tháng</TabsTrigger>
          <TabsTrigger value='yearly'>Theo Năm</TabsTrigger>
        </TabsList>

        <div className='mb-6'>
          <Card>
            <CardHeader>
              <CardTitle>Chọn thời gian</CardTitle>
            </CardHeader>
            <CardContent>
              {timeframe === 'daily' && (
                <div className='flex items-center gap-2'>
                  <span>Chọn ngày:</span>
                  <DatePicker
                    className='px-3 py-2'
                    value={selectedDate}
                    onChange={(date) => date && setSelectedDate(date)}
                    format='DD/MM/YYYY'
                    allowClear={false}
                  />
                </div>
              )}

              {timeframe === 'monthly' && (
                <div className='flex items-center gap-2'>
                  <span>Chọn tháng:</span>
                  <DatePicker
                    picker='month'
                    className='px-3 py-2'
                    value={selectedMonthYear}
                    onChange={(date) => date && setSelectedMonthYear(date)}
                    format='MM/YYYY'
                    allowClear={false}
                  />
                </div>
              )}

              {timeframe === 'yearly' && (
                <div className='flex items-center gap-2'>
                  <span>Chọn năm:</span>
                  <DatePicker
                    className='px-3 py-2'
                    picker='year'
                    value={selectedYear}
                    onChange={(date) => date && setSelectedYear(date)}
                    format='YYYY'
                    allowClear={false}
                  />
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className='grid grid-cols-1 gap-6'>
          {/* Render appropriate OrderChartAdmin based on timeframe */}
          {timeframe === 'daily' && (
            <OrderChartAdmin
              timeframe='daily'
              date={formattedDate}
              title='Thống Kê Theo Ngày'
              description='Doanh thu theo từng khung giờ trong ngày'
            />
          )}

          {timeframe === 'monthly' && (
            <OrderChartAdmin
              timeframe='monthly'
              month={selectedMonthYear.month() + 1}
              year={selectedMonthYear.year()}
              title='Thống Kê Theo Tháng'
              description='Doanh thu theo từng tuần trong tháng'
            />
          )}

          {timeframe === 'yearly' && (
            <OrderChartAdmin
              timeframe='yearly'
              year={selectedYear.year()}
              title='Thống Kê Theo Năm'
              description='Doanh thu theo từng quý trong năm'
            />
          )}

          {/* You can add more OrderChartAdmin components here with different configurations */}
          {timeframe === 'daily' && (
            <OrderChartAdmin
              timeframe='daily'
              date={formattedDate}
              title='Số Lượng Đơn Hàng'
              description='Số lượng đơn theo từng khung giờ'
            />
          )}

          {timeframe === 'monthly' && (
            <OrderChartAdmin
              timeframe='monthly'
              month={selectedMonthYear.month() + 1}
              year={selectedMonthYear.year()}
              title='Số Lượng Đơn Hàng'
              description='Số lượng đơn theo từng tuần'
            />
          )}

          {timeframe === 'yearly' && (
            <OrderChartAdmin
              timeframe='yearly'
              year={selectedYear.year()}
              title='Số Lượng Đơn Hàng'
              description='Số lượng đơn theo từng quý'
            />
          )}
        </div>
      </Tabs>
    </div>
  );
}
