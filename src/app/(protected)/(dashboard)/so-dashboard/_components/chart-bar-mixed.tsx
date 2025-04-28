'use client';

import { TrendingUp } from 'lucide-react';
import { Bar, BarChart, XAxis, YAxis } from 'recharts';

import LoadingSpinner from '@/components/spin/loading-spinner';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { STORAGE } from '@/constant/storage';
import useDebounce from '@/hooks/use-debounce';
import {
  useOrderStaticsDailyStore,
  useOrderStaticsMonthlyStore,
  useOrderStaticsYearlyStore,
} from '@/hooks/use-order';
import { getLocalStorageItem } from '@/utils/token';

export interface OrderStaticValue {
  label: string;
  value: number;
}

export interface OrderStatics {
  orderChart: OrderStaticValue[];
  orderProfit: OrderStaticValue[];
  totalOrder: number;
  totalProfit: number;
}

// Transform data for chart rendering
const transformDataForChart = (data: OrderStaticValue[]) => {
  return data.map((item, index) => {
    const colorIndex = index % 12;
    return {
      id: index,
      label: item.label,
      value: item.value,
      fill: `var(--color-${colorIndex})`,
    };
  });
};

// Dynamic chart config based on data
const generateChartConfig = (
  profit: boolean,
  data: OrderStaticValue[]
): ChartConfig => {
  const config: ChartConfig = {
    value: {
      label: profit ? 'Doanh Thu' : 'Tổng Đơn',
    },
  };

  data.forEach((item, index) => {
    const colorIndex = (index % 12) + 1;
    config[`${index}`] = {
      label: item.label,
      color: `hsl(var(--chart-${colorIndex}))`,
    };
  });

  return config;
};

export type StatisticsTimeframe = 'daily' | 'monthly' | 'yearly';

interface ChartBarProps {
  timeframe: StatisticsTimeframe;
  date?: string;
  month?: number;
  year?: number;
  title?: string;
  description?: string;
  profilt?: boolean;
}

export function OrderChartStore({
  timeframe = 'daily',
  date,
  month,
  year,
  title,
  description,
  profilt = true,
}: ChartBarProps) {
  // Get the current date, month, and year if not provided
  const currentDate = date || new Date().toISOString().split('T')[0];
  const currentMonth = month || new Date().getMonth() + 1;
  const currentYear = year || new Date().getFullYear();
  const thisYear = year || new Date().getFullYear();
  const storeID = getLocalStorageItem(STORAGE.SELECTED_STORE_KEY);

  // Use appropriate hooks based on timeframe
  const { orderStaticsDailyStore, orderDailyLoading, orderDailyError } =
    useOrderStaticsDailyStore(currentDate, storeID || '');

  const { orderStaticsMonthlyStore, orderMonthlyLoading, orderMonthlyError } =
    useOrderStaticsMonthlyStore(currentMonth, currentYear, storeID || '');

  const { orderStaticsYearlyStore, orderYearLoading, orderYearError } =
    useOrderStaticsYearlyStore(thisYear, storeID || '');

  // Determine which data to use based on timeframe
  const getActiveData = () => {
    switch (timeframe) {
      case 'daily':
        return orderStaticsDailyStore;
      case 'monthly':
        return orderStaticsMonthlyStore;
      case 'yearly':
        return orderStaticsYearlyStore;
      default:
        return null;
    }
  };

  // Get loading state based on timeframe
  const isLoading = useDebounce(
    orderDailyLoading || orderMonthlyLoading || orderYearLoading,
    300
  );

  // Get error based on timeframe
  const getError = () => {
    switch (timeframe) {
      case 'daily':
        return orderDailyError;
      case 'monthly':
        return orderMonthlyError;
      case 'yearly':
        return orderYearError;
      default:
        return null;
    }
  };

  const data = getActiveData();
  const error = getError();

  if (error || !data) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent className='flex h-[300px] items-center justify-center'>
          <p className='text-destructive'>{error || 'Chưa có dữ liệu'}</p>
        </CardContent>
      </Card>
    );
  }

  const chartData = transformDataForChart(
    profilt ? data.orderProfit : data.orderChart
  );
  const chartConfig = generateChartConfig(
    profilt,
    profilt ? data.orderProfit : data.orderChart
  );

  // Generate appropriate description based on timeframe
  let timeDescription = description;
  if (timeframe === 'daily' && date) {
    timeDescription = `Thống kê vào ${date}`;
  } else if (timeframe === 'monthly' && month && year) {
    timeDescription = `Thống kê theo Tháng ${month} ${year}`;
  } else if (timeframe === 'yearly' && year) {
    timeDescription = `Thống kê theo Năm ${year}`;
  }

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{timeDescription}</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart
            accessibilityLayer
            data={chartData}
            layout='horizontal'
            margin={{
              left: 0,
              right: 0,
              top: 0,
              bottom: 20,
            }}
          >
            <XAxis
              dataKey='label'
              type='category'
              tickLine={false}
              axisLine={true}
              tick={{ fontSize: 12 }}
            />
            <YAxis
              dataKey='value'
              type='number'
              axisLine={false}
              tickLine={false}
              tickFormatter={(value) => `${value}`}
            />
            <ChartTooltip
              cursor={{ fill: 'rgba(0, 0, 0, 0.1)' }}
              content={<ChartTooltipContent />}
            />
            <Bar dataKey='value' radius={[4, 4, 0, 0]} />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className='flex-col items-start gap-2 text-sm'>
        <div className='flex gap-2 font-medium leading-none'>
          Tổng Đơn: {data.totalOrder.toLocaleString()}{' '}
          <TrendingUp className='h-4 w-4' />
        </div>
        <div className='leading-none text-muted-foreground'>
          Tổng Lợi Nhuận: ${data.totalProfit.toLocaleString()}
        </div>
      </CardFooter>
    </Card>
  );
}
