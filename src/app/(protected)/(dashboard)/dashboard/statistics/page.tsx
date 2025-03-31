'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Camera } from 'lucide-react';
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
  YAxis
} from 'recharts';

const ageData = [
  { name: '0-18', value: 250 },
  { name: '19-30', value: 450 },
  { name: '31-50', value: 300 },
  { name: '50+', value: 150 }
];

const weeklyData = [
  { day: 'Thứ 2', visitors: 120 },
  { day: 'Thứ 3', visitors: 150 },
  { day: 'Thứ 4', visitors: 180 },
  { day: 'Thứ 5', visitors: 200 },
  { day: 'Thứ 6', visitors: 250 },
  { day: 'Thứ 7', visitors: 300 },
  { day: 'CN', visitors: 280 }
];

const genderData = [
  { name: 'Nam', value: 170 },
  { name: 'Nữ', value: 87 }
];

const COLORS = [
  'hsl(var(--chart-1))',
  'hsl(var(--chart-2))',
  'hsl(var(--chart-3))',
  'hsl(var(--chart-4))'
];
const GENDER_COLORS = ['hsl(var(--chart-1))', 'hsl(var(--chart-2))'];

const StatisticsPage = () => {
  return (
    <div className='container mx-auto space-y-6 p-6'>
      <h1 className='mb-6 text-3xl font-bold'>Thống Kê Đường Sách</h1>

      {/* Camera Grid */}
      <div className='mb-6 grid grid-cols-3 gap-4'>
        {[1, 2, 3, 4, 5, 6].map((camera) => (
          <Card key={camera} className='relative'>
            <CardContent className='p-4'>
              <div className='flex aspect-video items-center justify-center rounded-lg bg-gray-200'>
                <Camera className='h-12 w-12 text-gray-400' />
                <span className='absolute left-2 top-2 rounded bg-black/50 px-2 py-1 text-sm text-white'>
                  Camera {camera}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Statistics Tabs */}
      <Tabs defaultValue='weekly' className='w-full'>
        <TabsList className='grid w-full grid-cols-3'>
          <TabsTrigger value='weekly'>Thống kê tuần</TabsTrigger>
          <TabsTrigger value='age'>Độ tuổi</TabsTrigger>
          <TabsTrigger value='gender'>Giới tính</TabsTrigger>
        </TabsList>

        {/* Weekly Statistics */}
        <TabsContent value='weekly'>
          <Card>
            <CardHeader>
              <CardTitle>Lượng khách trong tuần</CardTitle>
            </CardHeader>
            <CardContent>
              <div className='h-96'>
                <ResponsiveContainer width='100%' height='100%'>
                  <BarChart data={weeklyData}>
                    <CartesianGrid strokeDasharray='3 3' />
                    <XAxis dataKey='day' />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar
                      dataKey='visitors'
                      fill='hsl(var(--chart-2))'
                      name='Số lượng khách'
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Age Distribution */}
        <TabsContent value='age'>
          <Card>
            <CardHeader>
              <CardTitle>Phân bố độ tuổi</CardTitle>
            </CardHeader>
            <CardContent>
              <div className='h-96'>
                <ResponsiveContainer width='100%' height='100%'>
                  <PieChart>
                    <Pie
                      data={ageData}
                      cx='50%'
                      cy='50%'
                      labelLine={true}
                      label={({ name, percent }) =>
                        `${name} (${(percent * 100).toFixed(0)}%)`
                      }
                      outerRadius={120}
                      dataKey='value'
                    >
                      {ageData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Gender Distribution */}
        <TabsContent value='gender'>
          <Card>
            <CardHeader>
              <CardTitle>Phân bố giới tính</CardTitle>
            </CardHeader>
            <CardContent>
              <div className='h-96'>
                <ResponsiveContainer width='100%' height='100%'>
                  <PieChart>
                    <Pie
                      data={genderData}
                      cx='50%'
                      cy='50%'
                      labelLine={true}
                      label={({ name, percent }) =>
                        `${name} (${(percent * 100).toFixed(0)}%)`
                      }
                      outerRadius={120}
                      dataKey='value'
                    >
                      {genderData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={GENDER_COLORS[index % GENDER_COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default StatisticsPage;
