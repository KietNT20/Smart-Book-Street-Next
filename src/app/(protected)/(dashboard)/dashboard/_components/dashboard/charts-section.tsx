'use client';

import { ChartConfig } from '@/components/ui/chart';
import axios from 'axios';
import * as React from 'react';
import BarchartCard from './barchart-card';
import PiechartCard from './piechart-card';

interface DailyVisitorsApiResponse {
  success: boolean;
  data: {
    date: string;
    male: number;
    female: number;
  }[];
}

type BarData = {
  date: string;
  male: number;
  female: number;
}[];

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
  const [barData, setBarData] = React.useState<BarData>([]);
  const [isLoading, setIsLoading] = React.useState<boolean>(true);
  const [error, setError] = React.useState<string | null>(null);

  const totalBooks = React.useMemo(() => {
    return pieData.reduce((acc, curr) => acc + curr.visitors, 0);
  }, []);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);

        const endDate = new Date();
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - 6); // 6 ngày trước + ngày hiện tại = 7 ngày

        const formattedStartDate = startDate.toISOString().split('T')[0];
        const formattedEndDate = endDate.toISOString().split('T')[0];

        const response = await axios.get<DailyVisitorsApiResponse>(
          `/api/visitors/daily-statistics?startDate=${formattedStartDate}&endDate=${formattedEndDate}`
        );

        if (response.data.success) {
          setBarData(response.data.data);
        } else {
          setError('Không thể tải dữ liệu');
        }
      } catch (err) {
        console.error('Lỗi khi tải thống kê khách tham quan:', err);
        setError('Lỗi khi tải dữ liệu');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const pieProps = {
    pieData,
    pieConfig,
    totalBooks,
  };

  return (
    <div className='mt-4 gap-4 lg:flex'>
      {/* Bar Chart Container */}
      <BarchartCard
        barData={barData}
        barConfig={barConfig}
        isLoading={isLoading}
      />

      {/* Pie Chart Container */}
      <PiechartCard {...pieProps} />

      {error && (
        <div className='rounded bg-red-50 p-4 text-red-500'>{error}</div>
      )}
    </div>
  );
};

export default ChartsSection;
