'use client';

import { ChartConfig } from '@/components/ui/chart';
import { useDailyRangeStatistics } from '@/hooks/use-person';
import dayjs from 'dayjs';
import BarchartCard from './barchart-card';

const barConfig = {
  male: {
    label: 'Nam',
    color: 'hsl(var(--chart-1))',
  },
  female: {
    label: 'Nữ',
    color: 'hsl(var(--chart-2))',
  },
} satisfies ChartConfig;

// Data cho Pie Chart
// const pieData = [
//   { category: 'vanHoc', visitors: 275, fill: 'hsl(var(--chart-1))' },
//   { category: 'thieuNhi', visitors: 200, fill: 'hsl(var(--chart-2))' },
//   { category: 'giaoKhoa', visitors: 287, fill: 'hsl(var(--chart-3))' },
//   { category: 'kyNang', visitors: 173, fill: 'hsl(var(--chart-4))' },
//   { category: 'other', visitors: 190, fill: 'hsl(var(--chart-5))' },
// ];

// const pieConfig = {
//   visitors: {
//     label: 'Số lượng',
//   },
//   vanHoc: {
//     label: 'Văn học',
//     color: 'hsl(var(--chart-1))',
//   },
//   thieuNhi: {
//     label: 'Thiếu nhi',
//     color: 'hsl(var(--chart-2))',
//   },
//   giaoKhoa: {
//     label: 'Giáo khoa',
//     color: 'hsl(var(--chart-3))',
//   },
//   kyNang: {
//     label: 'Kỹ năng',
//     color: 'hsl(var(--chart-4))',
//   },
//   other: {
//     label: 'Khác',
//     color: 'hsl(var(--chart-5))',
//   },
// } satisfies ChartConfig;

const ChartsSection = () => {
  const endDate = dayjs(new Date()).format('YYYY-MM-DD');
  const startDate = dayjs(new Date()).subtract(6, 'day').format('YYYY-MM-DD');
  const { barData, isLoading, error } = useDailyRangeStatistics({
    startDate: startDate,
    endDate: endDate,
  });

  // const totalMale = barData.reduce((sum, item) => sum + item.male, 0);
  // const totalFemale = barData.reduce((sum, item) => sum + item.female, 0);
  // const totalVisitors = totalMale + totalFemale;

  // const totalBooks = React.useMemo(() => {
  //   return pieData.reduce((acc, curr) => acc + curr.visitors, 0);
  // }, []);

  // const pieProps = {
  //   pieData,
  //   pieConfig,
  //   totalBooks,
  //   totalVisitors,
  // };

  return (
    <div className='gap-4 lg:flex'>
      {/* Bar Chart Container */}
      <BarchartCard
        barData={barData}
        barConfig={barConfig}
        isLoading={isLoading}
      />

      {/* Pie Chart Container */}
      {/* <PiechartCard {...pieProps} /> */}

      {error && (
        <div className='rounded bg-red-50 p-4 text-red-500'>
          {error.message}
        </div>
      )}
    </div>
  );
};

export default ChartsSection;
