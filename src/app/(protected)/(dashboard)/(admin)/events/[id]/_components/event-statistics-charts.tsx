import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useMemo } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
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

/**
 * Chart component that can render different types of charts based on props
 */
const EventChart = ({
  data,
  title,
  description,
  type = 'bar',
  colors = DEFAULT_COLORS,
  className = '',
  height = 300,
}: ChartProps) => {
  const renderPieLabel = (props: any) => {
    const { cx, cy, midAngle, outerRadius, name, value } = props;
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
        {`${name}: ${value}`}
      </text>
    );
  };

  // Memoize the chart content for better performance
  const chartContent = useMemo(() => {
    switch (type) {
      case 'pie':
        return (
          <ResponsiveContainer width='100%' height='100%'>
            <PieChart>
              <Pie
                data={data}
                cx='50%'
                cy='50%'
                labelLine={false}
                label={renderPieLabel}
                outerRadius={80}
                fill='#8884d8'
                dataKey='value'
                nameKey='label'
              >
                {data?.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={colors[index % colors.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        );

      case 'horizontalBar':
        return (
          <ResponsiveContainer width='100%' height='100%'>
            <BarChart
              data={data}
              layout='vertical'
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray='3 3' />
              <XAxis type='number' />
              <YAxis dataKey='label' type='category' width={120} />
              <Tooltip />
              <Legend />
              <Bar dataKey='value' name='Số lượng' fill={colors[0]} />
            </BarChart>
          </ResponsiveContainer>
        );

      // Default bar chart
      default:
        return (
          <ResponsiveContainer width='100%' height='100%'>
            <BarChart
              data={data}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray='3 3' />
              <XAxis dataKey='label' />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey='value' name='Số lượng' fill={colors[0]} />
            </BarChart>
          </ResponsiveContainer>
        );
    }
  }, [data, type, colors]);

  return (
    <Card className={className}>
      <CardHeader className='pb-2'>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <div style={{ height: height }}>{chartContent}</div>
      </CardContent>
    </Card>
  );
};

export default EventChart;
