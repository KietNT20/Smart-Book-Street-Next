import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { TrendingUp } from 'lucide-react';
import { useState } from 'react';
import { Label, Pie, PieChart } from 'recharts';

type TimeRange =
  | '1'
  | '2'
  | '3'
  | '4'
  | '5'
  | '6'
  | '7'
  | '8'
  | '9'
  | '10'
  | '11'
  | '12'
  | 'this-quarter'
  | 'last-quarter'
  | 'this-6-months'
  | 'last-6-months'
  | 'this-year'
  | 'last-year';

type Props = {
  pieData: { category: string; visitors: number; fill: string }[];
  pieConfig: {
    visitors: { label: string };
    vanHoc: { label: string; color: string };
    thieuNhi: { label: string; color: string };
    giaoKhoa: { label: string; color: string };
    kyNang: { label: string; color: string };
    other: { label: string; color: string };
  };
  totalBooks: number;
  onTimeRangeChange?: (range: TimeRange) => void;
};

const timeRangeOptions = [
  { value: '1', label: 'Tháng 1' },
  { value: '2', label: 'Tháng 2' },
  { value: '3', label: 'Tháng 3' },
  { value: '4', label: 'Tháng 4' },
  { value: '5', label: 'Tháng 5' },
  { value: '6', label: 'Tháng 6' },
  { value: '7', label: 'Tháng 7' },
  { value: '8', label: 'Tháng 8' },
  { value: '9', label: 'Tháng 9' },
  { value: '10', label: 'Tháng 10' },
  { value: '11', label: 'Tháng 11' },
  { value: '12', label: 'Tháng 12' },
  { value: 'this-quarter', label: 'Quý này' },
  { value: 'last-quarter', label: 'Quý trước' },
  { value: 'this-6-months', label: '6 tháng này' },
  { value: 'last-6-months', label: '6 tháng trước' },
  { value: 'this-year', label: 'Năm nay' },
  { value: 'last-year', label: 'Năm trước' },
] as const;

const getTimeRangeLabel = (range: TimeRange) => {
  const option = timeRangeOptions.find((opt) => opt.value === range);
  return option?.label || 'Chọn thời gian';
};

const PiechartCard = ({
  pieData,
  pieConfig,
  totalBooks,
  onTimeRangeChange,
}: Props) => {
  const [timeRange, setTimeRange] = useState<TimeRange>('this-6-months');

  const handleTimeRangeChange = (value: TimeRange) => {
    setTimeRange(value);
    onTimeRangeChange?.(value);
  };

  const getDescriptionText = (range: TimeRange) => {
    if (
      ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'].includes(
        range
      )
    ) {
      return `Dữ liệu ${getTimeRangeLabel(range)} năm 2024`;
    }
    return `Dữ liệu theo ${getTimeRangeLabel(range)}`;
  };

  return (
    <Card className="flex-1">
      <CardHeader className="pb-0">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Phân loại sách</CardTitle>
            <CardDescription>{getDescriptionText(timeRange)}</CardDescription>
          </div>
          <Select value={timeRange} onValueChange={handleTimeRangeChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Chọn thời gian" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Theo tháng</SelectLabel>
                {timeRangeOptions.slice(0, 12).map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectGroup>
              <SelectGroup>
                <SelectLabel>Theo khoảng thời gian</SelectLabel>
                {timeRangeOptions.slice(12).map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
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
          Tăng 5.2% so với kỳ trước <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Thống kê tổng số sách theo thể loại trong{' '}
          {getTimeRangeLabel(timeRange).toLowerCase()}
        </div>
      </CardFooter>
    </Card>
  );
};

export default PiechartCard;
