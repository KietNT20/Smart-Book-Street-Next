'use client';

import { ChartConfig } from '@/components/ui/chart';
import * as React from 'react';
import BarchartCard from './barchart-card';
import PiechartCard from './piechart-card';

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

const barProps = {
  barData,
  barConfig,
};

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

const pieProps = {
  pieData,
  pieConfig,
};

const ChartsSection = () => {
  const totalBooks = React.useMemo(() => {
    return pieData.reduce((acc, curr) => acc + curr.visitors, 0);
  }, []);

  return (
    <div className='mt-4 gap-4 lg:flex'>
      {/* Bar Chart Container */}
      <BarchartCard {...barProps} />
      {/* Pie Chart Container */}
      <PiechartCard {...pieProps} totalBooks={totalBooks} />
    </div>
  );
};
export default ChartsSection;
