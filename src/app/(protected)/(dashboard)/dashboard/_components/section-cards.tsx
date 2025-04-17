import TrendIcon from '@/components/trend-icon';
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useGetAverageMinute, useGetPersonTotal } from '@/hooks/use-person';
import { Trend } from '@/types/person-types';
import { BookOpen, Clock, UserCheck, Users } from 'lucide-react';
import { useEffect, useState } from 'react';

const SectionCards = () => {
  const [formattedTotal, setFormattedTotal] = useState<string>('');
  const { averageMinute, isLoading: isLoadingAverageMinute } =
    useGetAverageMinute();
  const { totalPerson, isLoading: isLoadingTotalPerson } = useGetPersonTotal();
  const total = totalPerson?.total || 0;
  const isLoading = isLoadingTotalPerson || isLoadingAverageMinute;
  const changeDirection = totalPerson?.changeDirection || Trend.STABLE;
  const percentChange = totalPerson?.currentMonthPercentChange;

  const formatNumber = (num: number): string => {
    if (!num) return '';
    return new Intl.NumberFormat().format(num);
  };

  useEffect(() => {
    if (!isLoading && total !== undefined) {
      setFormattedTotal(formatNumber(total));
    }
  }, [total, isLoading]);

  const getTrendMessage = (trend: Trend): string => {
    switch (trend) {
      case Trend.INCREASE:
        return 'Tăng so với tháng trước';
      case Trend.DECREASE:
        return 'Giảm so với tháng trước';
      case Trend.STABLE:
      default:
        return 'Không thay đổi so với tháng trước';
    }
  };

  const getChangeMessage = (
    trend: Trend,
    total: number,
    percentChange?: number
  ): string => {
    if (!percentChange) {
      return getTrendMessage(trend);
    }

    const absoluteChange = Math.round((total * Math.abs(percentChange)) / 100);
    const formattedChange = new Intl.NumberFormat().format(absoluteChange);

    switch (trend) {
      case Trend.INCREASE:
        return `+ ${formattedChange} người so với tháng trước`;
      case Trend.DECREASE:
        return `- ${formattedChange} người so với tháng trước`;
      case Trend.STABLE:
      default:
        return 'Không thay đổi so với tháng trước';
    }
  };

  // Tính tỉ lệ nam/nữ để hiển thị trên biểu đồ
  const calculateGenderRatio = () => {
    if (!averageMinute?.chartData) return { male: 50, female: 50 };

    const maleCount = averageMinute.chartData[0].value;
    const femaleCount = averageMinute.chartData[1].value;
    const total = maleCount + femaleCount;

    return {
      male: (maleCount / total) * 100,
      female: (femaleCount / total) * 100,
    };
  };

  const genderRatio = calculateGenderRatio();

  return (
    <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
      <Card className='shadow-xs bg-chart-1 from-primary/5 to-card'>
        <CardHeader className='relative'>
          <CardDescription className='text-white'>
            Tổng số người camera phát hiện
          </CardDescription>
          <CardTitle className='flex items-center gap-4 text-2xl font-semibold tabular-nums text-white md:text-3xl'>
            {isLoading ? 'Đang tải' : formattedTotal}
            <TrendIcon trend={changeDirection} />
          </CardTitle>
          <div className='absolute right-4 top-4'>
            <Users className='text-blue-100' />
          </div>
        </CardHeader>
        <CardFooter className='flex-col items-start gap-1 text-sm'>
          <div className='line-clamp-1 flex gap-2 font-medium text-card'>
            <span>
              {getChangeMessage(changeDirection, total, percentChange)}
            </span>
          </div>
        </CardFooter>
      </Card>

      <Card className='shadow-xs bg-chart-2 from-primary/5 to-card'>
        <CardHeader className='relative'>
          <CardDescription className='text-white'>Tổng Số Sách</CardDescription>
          <CardTitle className='text-2xl font-semibold tabular-nums text-white md:text-3xl'>
            8,432
          </CardTitle>
          <div className='absolute right-4 top-4'>
            <BookOpen className='text-purple-100' />
          </div>
        </CardHeader>
        <CardFooter className='flex-col items-start gap-1 text-sm'>
          <div className='line-clamp-1 flex gap-2 font-medium text-purple-100'>
            +123 đầu sách mới trong tháng
          </div>
        </CardFooter>
      </Card>

      <Card className='shadow-xs bg-chart-3 from-primary/5 to-card'>
        <CardHeader className='relative'>
          <CardDescription className='text-white'>Các đối tác</CardDescription>
          <CardTitle className='text-2xl font-semibold tabular-nums text-white md:text-3xl'>
            46
          </CardTitle>
          <div className='absolute right-4 top-4'>
            <UserCheck className='text-green-100' />
          </div>
        </CardHeader>
        <CardFooter className='flex-col items-start gap-1 text-sm'>
          <div className='line-clamp-1 flex gap-2 font-medium text-purple-100'>
            +21 đối tác mới trong tháng
          </div>
        </CardFooter>
      </Card>

      <Card className='shadow-xs bg-chart-4 from-primary/5 to-card'>
        <CardHeader className='relative'>
          <CardDescription className='text-white'>
            Thời Gian Tham Quan Trung Bình
          </CardDescription>
          <CardTitle className='text-2xl font-semibold tabular-nums text-white md:text-3xl'>
            {isLoadingAverageMinute
              ? 'Đang tải...'
              : averageMinute?.averageTime || '45 phút'}
          </CardTitle>
          <div className='absolute right-4 top-4'>
            <Clock className='text-orange-100' />
          </div>
        </CardHeader>
        <CardFooter className='flex-col items-start gap-2 text-sm'>
          {!isLoadingAverageMinute && averageMinute && (
            <>
              {/* <div className='w-full'>
                <div className='mb-1 flex justify-between'>
                  <span className='flex items-center gap-1 font-medium text-card'>
                    <div className='flex h-3 w-3 items-center justify-center rounded-full bg-blue-500 text-xs text-white'></div>
                    Nam:
                  </span>
                  <span className='font-medium text-card'>
                    {averageMinute.averageTimeByGender.male}
                  </span>
                </div>
                <div className='flex justify-between'>
                  <span className='flex items-center gap-1 font-medium text-card'>
                    <div className='flex h-3 w-3 items-center justify-center rounded-full bg-pink-500 text-xs text-white'></div>
                    Nữ:
                  </span>
                  <span className='font-medium text-card'>
                    {averageMinute.averageTimeByGender.female}
                  </span>
                </div>
              </div> */}
              <div className='mt-1 w-full'>
                <div className='relative h-2 w-full overflow-hidden rounded-full bg-gray-700'>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <div
                          className='absolute left-0 top-0 h-full cursor-help bg-blue-400'
                          style={{ width: `${genderRatio.male}%` }}
                        />
                      </TooltipTrigger>
                      <TooltipContent>
                        Nam: {averageMinute.averageTimeByGender.male}
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <div
                          className='absolute right-0 top-0 h-full cursor-help bg-pink-400'
                          style={{ width: `${genderRatio.female}%` }}
                        />
                      </TooltipTrigger>
                      <TooltipContent>
                        Nữ: {averageMinute.averageTimeByGender.female}
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <div className='mt-1 flex justify-between text-xs'>
                  <span className='text-card'>
                    {averageMinute.chartData[0].value} người
                  </span>
                  <span className='text-card'>
                    {averageMinute.chartData[1].value} người
                  </span>
                </div>
              </div>
            </>
          )}
          {isLoadingAverageMinute && (
            <div className='line-clamp-1 flex gap-2 font-medium text-card'>
              Đang tải thông tin...
            </div>
          )}
        </CardFooter>
      </Card>
    </div>
  );
};

export default SectionCards;
