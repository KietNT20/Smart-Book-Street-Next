'use client';

import { LabelList, Pie, PieChart } from 'recharts';

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

// Default colors for chart items
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

export interface ChartDataItem {
  label: string;
  value: number;
}

interface Props {
  data: ChartDataItem[];
  title?: string;
  description?: string;
}

export default function EventPieChart({ data, title, description }: Props) {
  const chartData = data.map((item, index) => ({
    name: item.label,
    value: item.value,
    fill: DEFAULT_COLORS[index % DEFAULT_COLORS.length],
    key: item.label.toLowerCase().replace(/\s+/g, '_'),
  }));

  const chartConfig: Record<string, { label: string; color: string }> = {
    value: {
      label: 'Số lượng',
      color: 'hsl(var(--chart-1))',
    },
  } satisfies ChartConfig;

  data.forEach((item, index) => {
    const key = item.label.toLowerCase().replace(/\s+/g, '_');
    chartConfig[key] = {
      label: item.label,
      color: DEFAULT_COLORS[index % DEFAULT_COLORS.length],
    };
  });

  return (
    <Card className='flex flex-col'>
      <CardHeader className='items-center pb-0'>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className='flex-1'>
        <ChartContainer
          config={chartConfig}
          className='mx-auto aspect-square max-h-[250px] [&_.recharts-text]:fill-background'
        >
          <PieChart>
            <ChartTooltip
              content={<ChartTooltipContent nameKey='value' hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey='value'
              nameKey='name'
              cx='50%'
              cy='50%'
              outerRadius={80}
              fill='#8884d8'
            >
              <LabelList
                dataKey='name'
                className='fill-background'
                stroke='none'
                fontSize={12}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
