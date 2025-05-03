'use client';

import LoadingSpinner from '@/components/spin/loading-spinner';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
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
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useIsMobile } from '@/hooks/use-mobile';
import { AlertCircle, BarChart4, Calendar, Menu, Users } from 'lucide-react';
import { useState } from 'react';
import { Label, Pie, PieChart, ResponsiveContainer } from 'recharts';

interface ChartData {
  label: string;
  value: number;
}

interface DashboardData {
  ageChart: ChartData[];
  genderChart: ChartData[];
  referenceChart: ChartData[];
  addressChart: ChartData[];
  attendedChart: ChartData[];
  totalRegistrations: number;
  participation: number;
  participationRate: string;
}

interface DashboardProps {
  data?: DashboardData;
  isPending?: boolean;
}

export default function Dashboard({ data, isPending }: DashboardProps) {
  const isMobile = useIsMobile();
  const [activeTab, setActiveTab] = useState('gender');
  const [drawerOpen, setDrawerOpen] = useState(false);

  const tabOptions = [
    { value: 'gender', label: 'Giới tính' },
    { value: 'age', label: 'Độ tuổi' },
    { value: 'reference', label: 'Nguồn biết đến' },
    { value: 'address', label: 'Địa chỉ' },
    { value: 'attended', label: 'Kinh nghiệm' },
  ];

  if (!data) {
    return (
      <Alert variant='destructive'>
        <AlertCircle className='h-4 w-4' />
        <AlertTitle>Thông báo</AlertTitle>
        <AlertDescription>
          Không có dữ liệu thống kê cho sự kiện này.
        </AlertDescription>
      </Alert>
    );
  }

  const COLORS = [
    'hsl(var(--chart-1))',
    'hsl(var(--chart-2))',
    'hsl(var(--chart-3))',
    'hsl(var(--chart-4))',
    'hsl(var(--chart-5))',
    'hsl(var(--chart-6))',
    'hsl(var(--chart-7))',
    'hsl(var(--chart-8))',
    'hsl(var(--chart-9))',
    'hsl(var(--chart-10))',
  ];

  const PieChartLabel = ({
    cx,
    cy,
    midAngle,
    outerRadius,
    percent,
    index,
    name,
    value,
  }: any) => {
    // Don't render labels on mobile devices
    if (isMobile) return null;

    const RADIAN = Math.PI / 180;
    const radius = outerRadius * 1.1;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill={COLORS[index % COLORS.length]}
        textAnchor={x > cx ? 'start' : 'end'}
        dominantBaseline='central'
        className='text-xs font-medium'
      >
        {`${name}: ${value} (${(percent * 100).toFixed(0)}%)`}
      </text>
    );
  };

  const convertToChartFormat = (chartData: ChartData[]) => {
    return chartData.map((item, index) => ({
      name: item.label,
      value: item.value,
      fill: COLORS[index % COLORS.length],
    }));
  };

  const createChartConfig = (chartData: ChartData[]): ChartConfig => {
    const config: Record<string, any> = {
      value: {
        label: 'Số lượng',
      },
    };

    chartData.forEach((item, index) => {
      config[item.label] = {
        label: item.label,
        color: COLORS[index % COLORS.length],
      };
    });

    return config as ChartConfig;
  };

  // Render legend items separately for mobile
  const renderChartLegend = (chartData: ChartData[]) => {
    if (!isMobile) return null;

    return (
      <div className='mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2'>
        {chartData.map((item, index) => (
          <div key={index} className='flex items-center'>
            <div
              className='mr-2 h-3 w-3 rounded-full'
              style={{ backgroundColor: COLORS[index % COLORS.length] }}
            />
            <span className='text-sm'>
              {item.label}: {item.value} (
              {Math.round(
                (item.value /
                  chartData.reduce((acc, curr) => acc + curr.value, 0)) *
                  100
              )}
              %)
            </span>
          </div>
        ))}
      </div>
    );
  };

  const renderPieChart = (chartData: ChartData[], title: string) => {
    const formattedData = convertToChartFormat(chartData);
    const chartConfig = createChartConfig(chartData);
    const total = chartData.reduce((acc, curr) => acc + curr.value, 0);

    return (
      <Card className='flex flex-col'>
        <CardHeader className='items-center pb-0'>
          <CardTitle>{title}</CardTitle>
          <CardDescription>Thống kê hiện tại</CardDescription>
        </CardHeader>
        <CardContent className='flex-1 pb-0'>
          <ChartContainer config={chartConfig} className='mx-auto h-64 w-full'>
            <ResponsiveContainer width='100%' height='100%'>
              <PieChart>
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent hideLabel />}
                />
                <Pie
                  data={formattedData}
                  dataKey='value'
                  nameKey='name'
                  innerRadius={isMobile ? 40 : 60}
                  outerRadius={isMobile ? 60 : 80}
                  strokeWidth={isMobile ? 3 : 5}
                  paddingAngle={2}
                  labelLine={false}
                  label={<PieChartLabel />}
                >
                  <Label
                    content={({ viewBox }) => {
                      if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
                        return (
                          <text
                            x={viewBox.cx}
                            y={viewBox.cy}
                            textAnchor='middle'
                            dominantBaseline='middle'
                          >
                            <tspan
                              x={viewBox.cx}
                              y={viewBox.cy}
                              className='fill-foreground text-3xl font-bold'
                            >
                              {total}
                            </tspan>
                            <tspan
                              x={viewBox.cx}
                              y={(viewBox.cy || 0) + 24}
                              className='fill-muted-foreground'
                            >
                              Người
                            </tspan>
                          </text>
                        );
                      }
                    }}
                  />
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </ChartContainer>
          {renderChartLegend(chartData)}
        </CardContent>
      </Card>
    );
  };

  if (isPending) {
    return <LoadingSpinner />;
  }

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setDrawerOpen(false);
  };

  return (
    <div className='flex flex-col space-y-6 p-4 md:p-8'>
      <h1 className='text-2xl font-bold tracking-tight md:text-3xl'>
        Thống kê sự kiện
      </h1>

      {/* Thống kê tổng quan */}
      <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3'>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>
              Tổng số đăng ký
            </CardTitle>
            <Users className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold md:text-3xl'>
              {data?.totalRegistrations} người
            </div>
            <p className='mt-4 text-xs text-muted-foreground md:mt-6'>
              Tổng số người đã đăng ký tham gia sự kiện
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>
              Số người tham gia
            </CardTitle>
            <Calendar className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold md:text-3xl'>
              {data?.participation} người
            </div>
            <p className='mt-4 text-xs text-muted-foreground md:mt-6'>
              Số người đã tham gia sự kiện
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>
              Tỷ lệ tham gia
            </CardTitle>
            <BarChart4 className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold md:text-3xl'>
              {data?.participationRate}
            </div>
            <Progress
              value={parseInt(data?.participationRate || '0')}
              className='mt-2'
            />
            <p className='mt-2 text-xs text-muted-foreground'>
              <span className='text-primary'>
                Tỷ lệ người tham gia / tổng số đăng ký
              </span>
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs or Drawer for statistics */}
      {isMobile ? (
        <div className='space-y-4'>
          <div className='flex items-center justify-between'>
            <h2 className='text-xl font-semibold'>
              {tabOptions.find((tab) => tab.value === activeTab)?.label ||
                'Thống kê chi tiết'}
            </h2>
            <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
              <DrawerTrigger asChild>
                <Button variant='outline' size='icon'>
                  <Menu className='h-5 w-5' />
                </Button>
              </DrawerTrigger>
              <DrawerContent>
                <DrawerHeader>
                  <DrawerTitle>Chọn loại thống kê</DrawerTitle>
                  <DrawerDescription>
                    Xem các biểu đồ thống kê khác nhau
                  </DrawerDescription>
                </DrawerHeader>
                <div className='grid gap-2 p-4'>
                  {tabOptions.map((tab) => (
                    <Button
                      key={tab.value}
                      variant={activeTab === tab.value ? 'default' : 'outline'}
                      className='w-full justify-start'
                      onClick={() => handleTabChange(tab.value)}
                    >
                      {tab.label}
                    </Button>
                  ))}
                </div>
                <DrawerFooter>
                  <DrawerClose asChild>
                    <Button variant='outline'>Đóng</Button>
                  </DrawerClose>
                </DrawerFooter>
              </DrawerContent>
            </Drawer>
          </div>

          {/* Render active chart only */}
          {activeTab === 'gender' &&
            renderPieChart(data?.genderChart || [], 'Phân bố theo giới tính')}
          {activeTab === 'age' &&
            renderPieChart(data?.ageChart || [], 'Phân bố theo độ tuổi')}
          {activeTab === 'reference' &&
            renderPieChart(
              data?.referenceChart || [],
              'Nguồn biết đến sự kiện'
            )}
          {activeTab === 'address' &&
            renderPieChart(data?.addressChart || [], 'Phân bố theo địa chỉ')}
          {activeTab === 'attended' &&
            renderPieChart(
              data?.attendedChart || [],
              'Kinh nghiệm tham gia sự kiện'
            )}
        </div>
      ) : (
        <Tabs defaultValue='gender' className='space-y-4'>
          <TabsList className='grid w-full grid-cols-5'>
            {tabOptions.map((tab) => (
              <TabsTrigger key={tab.value} value={tab.value}>
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value='gender'>
            {renderPieChart(data?.genderChart || [], 'Phân bố theo giới tính')}
          </TabsContent>

          <TabsContent value='age'>
            {renderPieChart(data?.ageChart || [], 'Phân bố theo độ tuổi')}
          </TabsContent>

          <TabsContent value='reference'>
            {renderPieChart(
              data?.referenceChart || [],
              'Nguồn biết đến sự kiện'
            )}
          </TabsContent>

          <TabsContent value='address'>
            {renderPieChart(data?.addressChart || [], 'Phân bố theo địa chỉ')}
          </TabsContent>

          <TabsContent value='attended'>
            {renderPieChart(
              data?.attendedChart || [],
              'Kinh nghiệm tham gia sự kiện'
            )}
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}
