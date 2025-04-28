'use client';

import { AlertCircle, BarChart4, Calendar, Users } from 'lucide-react';
import { Label, Pie, PieChart } from 'recharts';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
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
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Định nghĩa kiểu dữ liệu
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
}

export default function Dashboard({ data }: DashboardProps) {
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

  // Thêm component hiển thị nhãn tùy chỉnh với giá trị và phần trăm
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
    const RADIAN = Math.PI / 180;
    // Điều chỉnh bán kính để đưa nhãn ra xa biểu đồ một chút nhưng không quá xa
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
          <ChartContainer
            config={chartConfig}
            className='mx-auto aspect-square h-64 w-full'
          >
            <PieChart>
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Pie
                data={formattedData}
                dataKey='value'
                nameKey='name'
                innerRadius={60}
                outerRadius={80}
                strokeWidth={5}
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
          </ChartContainer>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className='flex flex-col space-y-6 p-8'>
      <h1 className='text-3xl font-bold tracking-tight'>Thống kê sự kiện</h1>

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
            <div className='text-3xl font-bold'>
              {data.totalRegistrations} người
            </div>
            <p className='mt-6 text-xs text-muted-foreground'>
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
            <div className='text-3xl font-bold'>{data.participation} người</div>
            <p className='mt-6 text-xs text-muted-foreground'>
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
            <div className='text-3xl font-bold'>{data.participationRate}</div>
            <Progress
              value={parseInt(data.participationRate)}
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

      {/* Tabs thống kê chi tiết */}
      <Tabs defaultValue='gender' className='space-y-4'>
        <TabsList className='grid grid-cols-2 md:grid-cols-5'>
          <TabsTrigger value='gender'>Giới tính</TabsTrigger>
          <TabsTrigger value='age'>Độ tuổi</TabsTrigger>
          <TabsTrigger value='reference'>Nguồn biết đến</TabsTrigger>
          <TabsTrigger value='address'>Địa chỉ</TabsTrigger>
          <TabsTrigger value='attended'>Kinh nghiệm</TabsTrigger>
        </TabsList>

        <TabsContent value='gender'>
          {renderPieChart(data.genderChart, 'Phân bố theo giới tính')}
        </TabsContent>

        <TabsContent value='age'>
          {renderPieChart(data.ageChart, 'Phân bố theo độ tuổi')}
        </TabsContent>

        <TabsContent value='reference'>
          {renderPieChart(data.referenceChart, 'Nguồn biết đến sự kiện')}
        </TabsContent>

        <TabsContent value='address'>
          {renderPieChart(data.addressChart, 'Phân bố theo địa chỉ')}
        </TabsContent>

        <TabsContent value='attended'>
          {renderPieChart(data.attendedChart, 'Kinh nghiệm tham gia sự kiện')}
        </TabsContent>
      </Tabs>
    </div>
  );
}
