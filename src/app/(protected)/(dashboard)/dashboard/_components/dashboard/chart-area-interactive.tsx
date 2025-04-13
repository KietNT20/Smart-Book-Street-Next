'use client';

import { useCallback, useEffect, useState } from 'react';
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from 'recharts';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { useIsMobile } from '@/hooks/use-mobile';

// Chart configuration
const chartConfig = {
  population: {
    label: 'Dân số',
  },
  male: {
    label: 'Nam',
    color: 'hsl(var(--chart-1))',
  },
  female: {
    label: 'Nữ',
    color: 'hsl(var(--chart-2))',
  },
  total: {
    label: 'Tổng',
    color: 'hsl(var(--chart-3))',
  },
} satisfies ChartConfig;

type TimeRangeOption =
  | 'current3m'
  | 'prev3m'
  | 'current6m'
  | 'prev6m'
  | 'currentYear'
  | 'prevYear';

type PopulationData = {
  date: string;
  male: number;
  female: number;
  total: number;
};

type ApiResponse = {
  month: number;
  monthName: string;
  gender: string;
  count: number;
  period: string;
  year?: number;
};

export function ChartAreaInteractive() {
  const isMobile = useIsMobile();
  const [timeRange, setTimeRange] = useState<TimeRangeOption>('currentYear');
  const [year, setYear] = useState(new Date().getFullYear()); // Get current year dynamically
  const [dataType, setDataType] = useState<'stacked' | 'separate'>('stacked');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [populationData, setPopulationData] = useState<PopulationData[]>([]);

  useEffect(() => {
    if (isMobile) {
      setTimeRange('current6m');
    }
  }, [isMobile]);

  const getApiParams = useCallback(() => {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1; // 1-12

    switch (timeRange) {
      case 'current3m': {
        const currentQuarter = Math.ceil(currentMonth / 3);
        return `?periodType=quarter&quarter=${currentQuarter}&year=${year}`;
      }
      case 'prev3m': {
        const prevQuarter = Math.ceil(currentMonth / 3) - 1;
        const queryYear = prevQuarter <= 0 ? year - 1 : year;
        const adjustedQuarter = prevQuarter <= 0 ? 4 : prevQuarter;
        return `?periodType=quarter&quarter=${adjustedQuarter}&year=${queryYear}`;
      }
      case 'current6m': {
        const currentHalf = currentMonth <= 6 ? 1 : 2;
        return `?periodType=half&half=${currentHalf}&year=${year}`;
      }
      case 'prev6m': {
        const prevHalf = currentMonth <= 6 ? 2 : 1;
        const queryYear = currentMonth <= 6 ? year - 1 : year;
        return `?periodType=half&half=${prevHalf}&year=${queryYear}`;
      }
      case 'currentYear':
        return `?periodType=year&year=${year}`;
      case 'prevYear':
        return `?periodType=year&year=${year - 1}`;
      default:
        return '';
    }
  }, [timeRange, year]);

  // Fetch data from API
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const params = getApiParams();
      const response = await fetch(`/api/population${params}`);

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      const result = await response.json();

      const monthlyData: Record<string, PopulationData> = {};

      let displayYear = year;
      if (timeRange === 'prevYear') displayYear = year - 1;
      else if (timeRange === 'prev3m' || timeRange === 'prev6m') {
        const currentMonth = new Date().getMonth() + 1;
        if (
          (timeRange === 'prev3m' && Math.ceil(currentMonth / 3) === 1) ||
          (timeRange === 'prev6m' && currentMonth <= 6)
        ) {
          displayYear = year - 1;
        }
      }

      // Filter and process data from API
      (result.data || []).forEach((item: ApiResponse) => {
        const monthKey = item.month;
        const itemYear = item.year || displayYear;

        if (!monthlyData[monthKey]) {
          monthlyData[monthKey] = {
            date: `${itemYear}-${monthKey.toString().padStart(2, '0')}-01`,
            male: 0,
            female: 0,
            total: 0,
          };
        }

        if (item.gender === 'male') {
          monthlyData[monthKey].male = item.count;
        } else if (item.gender === 'female') {
          monthlyData[monthKey].female = item.count;
        } else if (item.gender === 'total') {
          monthlyData[monthKey].total = item.count;
        }
      });

      // Convert object to array and sort by date
      const formattedData = Object.values(monthlyData).sort((a, b) => {
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      });

      setPopulationData(formattedData);
    } catch (err) {
      console.error('Error fetching population data:', err);
      setError('Không thể tải dữ liệu dân số. Vui lòng thử lại sau.');
      // Use fallback data when API fails
      setPopulationData([]);
    } finally {
      setLoading(false);
    }
  }, [year, getApiParams, timeRange]);

  // Fetch data when dependencies change
  useEffect(() => {
    fetchData();
  }, [fetchData, timeRange]);

  // Apply time-based filtering (mostly handled by API, but we can filter further if needed)
  const filteredData = populationData;

  // Create data for separate visualization mode
  const separateData = filteredData.map((item) => ({
    ...item,
    maleOnly: dataType === 'separate' ? item.male : 0,
    femaleOnly: dataType === 'separate' ? item.female : 0,
  }));

  const getPeriodLabel = () => {
    switch (timeRange) {
      case 'current3m':
        return '3 tháng này';
      case 'prev3m':
        return '3 tháng trước';
      case 'current6m':
        return '6 tháng này';
      case 'prev6m':
        return '6 tháng trước';
      case 'currentYear':
        return 'Năm này';
      case 'prevYear':
        return 'Năm trước';
      default:
        return 'Khoảng thời gian tùy chỉnh';
    }
  };

  return (
    <Card className='@container/card'>
      <CardHeader className='relative'>
        <CardTitle>Thống kê dân số</CardTitle>
        <CardDescription>
          <span className='@[540px]/card:block hidden'>
            Dữ liệu dân số theo giới tính - {getPeriodLabel()}
          </span>
          <span className='@[540px]/card:hidden'>{getPeriodLabel()}</span>
        </CardDescription>

        <div className='absolute right-4 top-4 flex gap-2'>
          {/* Year selector */}
          {!timeRange.includes('prev') && (
            <Select
              value={year.toString()}
              onValueChange={(value) => setYear(parseInt(value))}
            >
              <SelectTrigger className='flex w-24' aria-label='Chọn năm'>
                <SelectValue placeholder={year.toString()} />
              </SelectTrigger>
              <SelectContent className='rounded-xl'>
                {/* Generate last 5 years and next year for selection */}
                {Array.from(
                  { length: 6 },
                  (_, i) => new Date().getFullYear() - 4 + i
                ).map((y) => (
                  <SelectItem
                    key={y}
                    value={y.toString()}
                    className='rounded-lg'
                  >
                    {y}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}

          <ToggleGroup
            type='single'
            value={dataType}
            onValueChange={(value) =>
              value && setDataType(value as 'stacked' | 'separate')
            }
            variant='outline'
            className='@[767px]/card:flex hidden'
          >
            <ToggleGroupItem value='stacked' className='h-8 px-2.5'>
              Chồng
            </ToggleGroupItem>
            <ToggleGroupItem value='separate' className='h-8 px-2.5'>
              Tách biệt
            </ToggleGroupItem>
          </ToggleGroup>

          {/* Time range selector for desktop - nút */}
          <ToggleGroup
            type='single'
            value={timeRange}
            onValueChange={(value) => setTimeRange(value as TimeRangeOption)}
            variant='outline'
            className='@[900px]/card:flex hidden'
          >
            <ToggleGroupItem value='current3m' className='h-8 px-2'>
              3 tháng này
            </ToggleGroupItem>
            <ToggleGroupItem value='prev3m' className='h-8 px-2'>
              3 tháng trước
            </ToggleGroupItem>
            <ToggleGroupItem value='current6m' className='h-8 px-2'>
              6 tháng này
            </ToggleGroupItem>
            <ToggleGroupItem value='prev6m' className='h-8 px-2'>
              6 tháng trước
            </ToggleGroupItem>
            <ToggleGroupItem value='currentYear' className='h-8 px-2'>
              Năm này
            </ToggleGroupItem>
            <ToggleGroupItem value='prevYear' className='h-8 px-2'>
              Năm trước
            </ToggleGroupItem>
          </ToggleGroup>

          {/* Time range selector for mobile - dropdown */}
          <Select
            value={timeRange}
            onValueChange={(value) => setTimeRange(value as TimeRangeOption)}
          >
            <SelectTrigger
              className='@[900px]/card:hidden flex w-44'
              aria-label='Chọn khoảng thời gian'
            >
              <SelectValue placeholder={getPeriodLabel()} />
            </SelectTrigger>
            <SelectContent className='rounded-xl'>
              <SelectItem value='current3m' className='rounded-lg'>
                3 tháng này
              </SelectItem>
              <SelectItem value='prev3m' className='rounded-lg'>
                3 tháng trước
              </SelectItem>
              <SelectItem value='current6m' className='rounded-lg'>
                6 tháng này
              </SelectItem>
              <SelectItem value='prev6m' className='rounded-lg'>
                6 tháng trước
              </SelectItem>
              <SelectItem value='currentYear' className='rounded-lg'>
                Năm này
              </SelectItem>
              <SelectItem value='prevYear' className='rounded-lg'>
                Năm trước
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent className='px-2 pt-4 sm:px-6 sm:pt-6'>
        {loading ? (
          <div className='flex h-[300px] items-center justify-center'>
            <div className='text-xl'>Đang tải dữ liệu...</div>
          </div>
        ) : error ? (
          <div className='flex h-[300px] items-center justify-center text-red-500'>
            <div>{error}</div>
          </div>
        ) : filteredData.length === 0 ? (
          <div className='flex h-[300px] items-center justify-center'>
            <div className='text-xl'>Không có dữ liệu cho giai đoạn này</div>
          </div>
        ) : (
          <>
            <ChartContainer
              config={chartConfig}
              className='aspect-auto h-[300px] w-full'
            >
              <AreaChart
                data={dataType === 'stacked' ? filteredData : separateData}
              >
                <defs>
                  <linearGradient id='fillMale' x1='0' y1='0' x2='0' y2='1'>
                    <stop
                      offset='5%'
                      stopColor='var(--color-male)'
                      stopOpacity={0.8}
                    />
                    <stop
                      offset='95%'
                      stopColor='var(--color-male)'
                      stopOpacity={0.1}
                    />
                  </linearGradient>
                  <linearGradient id='fillFemale' x1='0' y1='0' x2='0' y2='1'>
                    <stop
                      offset='5%'
                      stopColor='var(--color-female)'
                      stopOpacity={0.8}
                    />
                    <stop
                      offset='95%'
                      stopColor='var(--color-female)'
                      stopOpacity={0.1}
                    />
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey='date'
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  minTickGap={32}
                  tickFormatter={(value) => {
                    const date = new Date(value);
                    return date.toLocaleDateString('vi-VN', {
                      month: 'numeric',
                      year: 'numeric',
                    });
                  }}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  tickFormatter={(value) => {
                    // Format large numbers with k suffix
                    return value >= 1000
                      ? `${(value / 1000).toFixed(0)}k`
                      : value;
                  }}
                />
                <ChartTooltip
                  cursor={false}
                  content={
                    <ChartTooltipContent
                      labelFormatter={(value) => {
                        return new Date(value).toLocaleDateString('vi-VN', {
                          month: 'long',
                          year: 'numeric',
                        });
                      }}
                      indicator='dot'
                    />
                  }
                />

                {dataType === 'stacked' ? (
                  // Stacked area chart
                  <>
                    <Area
                      dataKey='female'
                      type='monotone'
                      fill='url(#fillFemale)'
                      stroke='var(--color-female)'
                      stackId='a'
                    />
                    <Area
                      dataKey='male'
                      type='monotone'
                      fill='url(#fillMale)'
                      stroke='var(--color-male)'
                      stackId='a'
                    />
                  </>
                ) : (
                  // Separate area charts
                  <>
                    <Area
                      dataKey='femaleOnly'
                      type='monotone'
                      fill='url(#fillFemale)'
                      stroke='var(--color-female)'
                    />
                    <Area
                      dataKey='maleOnly'
                      type='monotone'
                      fill='url(#fillMale)'
                      stroke='var(--color-male)'
                    />
                  </>
                )}
              </AreaChart>
            </ChartContainer>

            <div className='mt-4 flex items-center gap-4 text-xl text-muted-foreground'>
              <div className='flex items-center gap-2'>
                <span className='h-3 w-3 rounded-full bg-[hsl(var(--chart-1))]'></span>
                <span>Nam</span>
              </div>
              <div className='flex items-center gap-2'>
                <span className='h-3 w-3 rounded-full bg-[hsl(var(--chart-2))]'></span>
                <span>Nữ</span>
              </div>
              <div className='flex items-center gap-2'>
                <span className='text-base font-medium'>Tổng: </span>
                <span className='font-bold'>
                  {filteredData
                    .reduce((sum, item) => sum + item.total, 0)
                    .toLocaleString('vi-VN')}
                </span>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
