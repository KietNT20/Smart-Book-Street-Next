import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, Clock, UserCheck, Users } from 'lucide-react';
import ChartsSection from './_components/dashboard/charts-section';
import VisitorChartSection from './_components/dashboard/visitor-chart-section';

export default function DashboardPage() {
  return (
    <>
      <div className='grid gap-4 sm:grid-cols-2 md:grid-cols-4'>
        <Card className='bg-gradient-to-br from-blue-500 to-blue-600'>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium text-white'>
              Tổng Lượt Tham Quan
            </CardTitle>
            <Users className='text-blue-100' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold text-white'>15,234</div>
            <p className='text-xs text-blue-100'>+2,345 so với tháng trước</p>
          </CardContent>
        </Card>

        <Card className='bg-gradient-to-br from-purple-500 to-purple-600'>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium text-white'>
              Tổng Số Sách
            </CardTitle>
            <BookOpen className='text-purple-100' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold text-white'>8,432</div>
            <p className='text-xs text-purple-100'>
              +123 đầu sách mới trong tháng
            </p>
          </CardContent>
        </Card>

        <Card className='bg-gradient-to-br from-green-500 to-green-600'>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium text-white'>
              Người Dùng Đăng Ký
            </CardTitle>
            <UserCheck className='text-green-100' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold text-white'>3,573</div>
            <p className='text-xs text-green-100'>
              +251 người dùng mới tháng này
            </p>
          </CardContent>
        </Card>

        <Card className='bg-gradient-to-br from-orange-500 to-orange-600'>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium text-white'>
              Thời Gian Trung Bình
            </CardTitle>
            <Clock className='text-orange-100' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold text-white'>45 phút</div>
            <p className='text-xs text-orange-100'>
              Thời gian tham quan trung bình
            </p>
          </CardContent>
        </Card>
      </div>
      <div className='mt-4'>
        <ChartsSection />
      </div>
      <div className='mt-4'>
        <VisitorChartSection />
      </div>
    </>
  );
}
