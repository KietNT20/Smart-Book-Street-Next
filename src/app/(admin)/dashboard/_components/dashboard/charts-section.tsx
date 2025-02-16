'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { TrendingUp } from 'lucide-react';
import * as React from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Label,
  Pie,
  PieChart,
  XAxis,
} from 'recharts';

// Data cho Bar Chart
const barData = [
  { month: 'Tháng 1', visitor: 186, book: 80 },
  { month: 'Tháng 2', visitor: 305, book: 200 },
  { month: 'Tháng 3', visitor: 237, book: 120 },
  { month: 'Tháng 4', visitor: 73, book: 190 },
  { month: 'Tháng 5', visitor: 209, book: 130 },
  { month: 'Tháng 6', visitor: 214, book: 140 },
];

const barConfig = {
  visitor: {
    label: 'Lượt tham quan',
    color: 'hsl(var(--chart-1))',
  },
  book: {
    label: 'Số sách mới',
    color: 'hsl(var(--chart-2))',
  },
} satisfies ChartConfig;

// Data cho Pie Chart
const pieData = [
  { category: 'vanHoc', visitors: 275, fill: 'hsl(var(--chart-1))' },
  { category: 'thieuNhi', visitors: 200, fill: 'hsl(var(--chart-2))' },
  { category: 'giaoKhoa', visitors: 287, fill: 'hsl(var(--chart-3))' },
  { category: 'kyNang', visitors: 173, fill: 'hsl(var(--chart-4))' },
  { category: 'other', visitors: 190, fill: 'hsl(var(--chart-5))' },
];

const pieConfig = {
  visitors: {
    label: 'Số lượng',
  },
  vanHoc: {
    label: 'Văn học',
    color: 'hsl(var(--chart-1))',
  },
  thieuNhi: {
    label: 'Thiếu nhi',
    color: 'hsl(var(--chart-2))',
  },
  giaoKhoa: {
    label: 'Giáo khoa',
    color: 'hsl(var(--chart-3))',
  },
  kyNang: {
    label: 'Kỹ năng',
    color: 'hsl(var(--chart-4))',
  },
  other: {
    label: 'Khác',
    color: 'hsl(var(--chart-5))',
  },
} satisfies ChartConfig;

const ChartsSection = () => {
  const totalBooks = React.useMemo(() => {
    return pieData.reduce((acc, curr) => acc + curr.visitors, 0);
  }, []);

  return (
    <div className="mt-4 gap-4 md:flex">
      {/* Bar Chart Container */}
      <Card className="mb-4 flex-[2] md:mb-0">
        <CardHeader>
          <CardTitle>Thống kê theo tháng</CardTitle>
          <CardDescription>Tháng 1 - Tháng 6 2024</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={barConfig}>
            <BarChart accessibilityLayer data={barData}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="month"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                tickFormatter={(value) => value}
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent indicator="dashed" />}
              />
              <Bar dataKey="visitor" fill="hsl(var(--chart-1))" radius={4} />
              <Bar dataKey="book" fill="hsl(var(--chart-2))" radius={4} />
            </BarChart>
          </ChartContainer>
        </CardContent>
        <CardFooter className="flex-col items-start gap-2 text-sm">
          <div className="flex gap-2 font-medium leading-none">
            Tăng 5.2% so với tháng trước <TrendingUp className="h-4 w-4" />
          </div>
          <div className="leading-none text-muted-foreground">
            Thống kê lượt tham quan và sách mới trong 6 tháng qua
          </div>
        </CardFooter>
      </Card>

      {/* Pie Chart Container */}
      <Card className="flex-1">
        <CardHeader className="items-center pb-0">
          <CardTitle>Phân loại sách</CardTitle>
          <CardDescription>Tháng 1 - Tháng 6 2024</CardDescription>
        </CardHeader>
        <CardContent className="flex-1 pb-0">
          <ChartContainer
            config={pieConfig}
            className="mx-auto aspect-square max-h-[250px]"
          >
            <PieChart>
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Pie
                data={pieData}
                dataKey="visitors"
                nameKey="category"
                innerRadius={60}
                strokeWidth={5}
              >
                <Label
                  content={({ viewBox }) => {
                    if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
                      return (
                        <text
                          x={viewBox.cx}
                          y={viewBox.cy}
                          textAnchor="middle"
                          dominantBaseline="middle"
                        >
                          <tspan
                            x={viewBox.cx}
                            y={viewBox.cy}
                            className="fill-foreground text-3xl font-bold"
                          >
                            {totalBooks.toLocaleString()}
                          </tspan>
                          <tspan
                            x={viewBox.cx}
                            y={(viewBox.cy || 0) + 24}
                            className="fill-muted-foreground"
                          >
                            Tổng số sách
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
        <CardFooter className="flex-col gap-2 text-sm">
          <div className="flex items-center gap-2 font-medium leading-none">
            Tăng 5.2% so với tháng trước <TrendingUp className="h-4 w-4" />
          </div>
          <div className="leading-none text-muted-foreground">
            Thống kê tổng số sách theo thể loại
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};
export default ChartsSection;
