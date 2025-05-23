'use client';

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
import { useMemo } from 'react';
import {
  Bar,
  BarChart,
  Cell,
  Legend,
  Pie,
  PieChart,
  XAxis,
  YAxis,
} from 'recharts';

// Define data item type
export interface ChartDataItem {
  label: string;
  value: number;
}

// Define chart props
export interface ChartProps {
  data: ChartDataItem[];
  title: string;
  description?: string;
  type?: 'bar' | 'pie' | 'horizontalBar';
  colors?: string[];
  className?: string;
  height?: number | string;
}

// Default colors for the charts
const DEFAULT_COLORS = [
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
  'hsl(var(--chart-11))',
  'hsl(var(--chart-12))',
];

const EventChart = ({
  data,
  title,
  description,
  type = 'bar',
  colors = DEFAULT_COLORS,
  className = '',
  height = 300,
}: ChartProps) => {
  // Transform data to include fill property for each item
  const transformedData = useMemo(() => {
    return data.map((item, index) => ({
      ...item,
      fill: colors[index % colors.length],
    }));
  }, [data, colors]);

  // Create chart config dynamically
  const chartConfig = useMemo(() => {
    const config: ChartConfig = {
      value: {
        label: 'Số lượng',
      },
    };

    data.forEach((item, index) => {
      config[item.label] = {
        label: item.label,
        color: colors[index % colors.length],
      };
    });

    return config;
  }, [data, colors]);

  const renderPieLabel = (props: any) => {
    const { cx, cy, midAngle, outerRadius, label, value } = props;
    const RADIAN = Math.PI / 180;
    const radius = outerRadius * 1.1;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill='#000000'
        textAnchor={x > cx ? 'start' : 'end'}
        dominantBaseline='central'
        fontSize='12'
      >
        {`${label}: ${value}`}
      </text>
    );
  };

  // Memoize the chart content for better performance
  const chartContent = useMemo(() => {
    switch (type) {
      case 'pie':
        return (
          <ChartContainer config={chartConfig} style={{ minHeight: height }}>
            <PieChart>
              <Pie
                data={transformedData}
                cx='50%'
                cy='50%'
                labelLine={false}
                label={renderPieLabel}
                outerRadius={80}
                dataKey='value'
                nameKey='label'
              >
                {transformedData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <ChartTooltip content={<ChartTooltipContent />} />
              <Legend />
            </PieChart>
          </ChartContainer>
        );

      case 'horizontalBar':
        return (
          <ChartContainer config={chartConfig} style={{ minHeight: height }}>
            <BarChart
              accessibilityLayer
              data={transformedData}
              layout='vertical'
              margin={{ left: 0 }}
            >
              <YAxis
                dataKey='label'
                type='category'
                tickLine={false}
                tickMargin={10}
                axisLine={false}
              />
              <XAxis dataKey='value' type='number' hide />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Bar dataKey='value' layout='vertical' radius={5} />
            </BarChart>
          </ChartContainer>
        );

      // Default vertical bar chart
      default:
        return (
          <ChartContainer config={chartConfig} style={{ minHeight: height }}>
            <BarChart
              accessibilityLayer
              data={transformedData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <XAxis dataKey='label' tickLine={false} axisLine={false} />
              <YAxis tickLine={false} axisLine={false} />
              <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
              <Bar dataKey='value' radius={4} />
            </BarChart>
          </ChartContainer>
        );
    }
  }, [transformedData, chartConfig, type, height]);

  return (
    <Card className={className}>
      <CardHeader className='pb-2'>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <div>{chartContent}</div>
      </CardContent>
    </Card>
  );
};

export default EventChart;
