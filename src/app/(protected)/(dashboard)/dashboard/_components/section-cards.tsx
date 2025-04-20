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
import useDebounce from '@/hooks/use-debounce';
import { useEventStaticsInMonth } from '@/hooks/use-event';
import { useGetAverageMinute, useGetPersonTotal } from '@/hooks/use-person';
import { useStoreStaticsTotal } from '@/hooks/use-store';
import { Trend } from '@/types/person-types';
import { BookOpen, Clock, UserCheck, Users } from 'lucide-react';
import { useEffect, useState } from 'react';

const SectionCards = () => {
  const [formattedTotal, setFormattedTotal] = useState('');
  // Get current month (1-12)
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth() + 1;

  const { averageMinute, isLoading: isLoadingAverageMinute } =
    useGetAverageMinute();
  const { eventStaticsDataMonth, eventStaticsLoading } =
    useEventStaticsInMonth(currentMonth); // Just use the current month
  const { staticsStore, isLoading: isLoadingStatics } = useStoreStaticsTotal();
  const totalStores = staticsStore?.total || 0;
  const changeDirectionStore = staticsStore?.changeDirection || Trend.STABLE;
  const percentChangeStore = staticsStore?.currentMonthPercentChange;
  const { totalPerson, isLoading: isLoadingTotalPerson } = useGetPersonTotal();
  const totalVisitors = totalPerson?.total || 0;
  const changeDirectionPerson = totalPerson?.changeDirection || Trend.STABLE;
  const percentChangePerson = totalPerson?.currentMonthPercentChange;

  // Total events data
  const totalEvents = eventStaticsDataMonth?.total || 0;
  const eventChangeDirection =
    eventStaticsDataMonth?.direction === 'increase'
      ? Trend.INCREASE
      : eventStaticsDataMonth?.direction === 'decrease'
        ? Trend.DECREASE
        : Trend.STABLE;
  const eventChange = eventStaticsDataMonth?.change || 0;

  const isLoading = useDebounce(
    isLoadingTotalPerson ||
      isLoadingAverageMinute ||
      isLoadingStatics ||
      eventStaticsLoading,
    300
  );

  const formatNumber = (num: number): string => {
    if (!num) return '';
    return new Intl.NumberFormat().format(num);
  };

  useEffect(() => {
    if (!isLoading && totalVisitors !== undefined) {
      setFormattedTotal(formatNumber(totalVisitors));
    }
  }, [totalVisitors, isLoading]);

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

    let absoluteChange: number;
    switch (trend) {
      case Trend.INCREASE:
        const previousValueIncrease = total / (1 + percentChange / 100);
        absoluteChange = total - previousValueIncrease;
        break;
      case Trend.DECREASE:
        const previousValueDecrease = total / (1 - percentChange / 100);
        absoluteChange = previousValueDecrease - total;
        break;
      case Trend.STABLE:
      default:
        absoluteChange = 0;
        break;
    }

    absoluteChange = Math.round(absoluteChange);
    const formattedChange = new Intl.NumberFormat().format(absoluteChange);

    switch (trend) {
      case Trend.INCREASE:
        return `+ ${formattedChange} so với tháng trước`;
      case Trend.DECREASE:
        return `- ${formattedChange} so với tháng trước`;
      case Trend.STABLE:
      default:
        return 'Không thay đổi so với tháng trước';
    }
  };

  // Custom function for event change message
  const getEventChangeMessage = (direction: Trend, change: number): string => {
    const formattedChange = new Intl.NumberFormat().format(change);
    switch (direction) {
      case Trend.INCREASE:
        return `+ ${formattedChange} sự kiện so với tháng trước`;
      case Trend.DECREASE:
        return `- ${formattedChange} sự kiện so với tháng trước`;
      case Trend.STABLE:
      default:
        return 'Không thay đổi so với tháng trước';
    }
  };

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
            Tổng Số Người Qua Camera
          </CardDescription>
          <CardTitle className='flex items-center gap-4 text-2xl font-semibold tabular-nums text-white md:text-3xl'>
            {isLoading ? 'Đang tải' : formattedTotal}
            <TrendIcon trend={changeDirectionPerson} />
          </CardTitle>
          <div className='absolute right-4 top-4'>
            <Users className='text-blue-100' />
          </div>
        </CardHeader>
        <CardFooter className='flex-col items-start gap-1 text-sm'>
          <div className='line-clamp-1 flex gap-2 font-medium text-card'>
            <span>
              {getChangeMessage(
                changeDirectionPerson,
                totalVisitors,
                percentChangePerson
              )}
            </span>
          </div>
        </CardFooter>
      </Card>

      <Card className='shadow-xs bg-chart-2 from-primary/5 to-card'>
        <CardHeader className='relative'>
          <CardDescription className='text-white'>
            Tổng Số Sự Kiện Tổ Chức
          </CardDescription>
          <CardTitle className='flex items-center gap-4 text-2xl font-semibold tabular-nums text-white md:text-3xl'>
            {eventStaticsLoading ? 'Đang tải...' : totalEvents}
            <TrendIcon trend={eventChangeDirection} />
          </CardTitle>
          <div className='absolute right-4 top-4'>
            <BookOpen className='text-purple-100' />
          </div>
        </CardHeader>
        <CardFooter className='flex-col items-start gap-1 text-sm'>
          <div className='line-clamp-1 flex gap-2 font-medium text-purple-100'>
            {eventStaticsLoading
              ? 'Đang tải thông tin...'
              : getEventChangeMessage(eventChangeDirection, eventChange)}
          </div>
        </CardFooter>
      </Card>

      <Card className='shadow-xs bg-chart-3 from-primary/5 to-card'>
        <CardHeader className='relative'>
          <CardDescription className='text-white'>
            Tổng Số Cửa Hàng
          </CardDescription>
          <CardTitle className='flex items-center gap-4 text-2xl font-semibold tabular-nums text-white md:text-3xl'>
            {isLoading ? 'Đang tải...' : totalStores}
            <TrendIcon trend={changeDirectionStore} />
          </CardTitle>
          <div className='absolute right-4 top-4'>
            <UserCheck className='text-green-100' />
          </div>
        </CardHeader>
        <CardFooter className='flex-col items-start gap-1 text-sm'>
          <div className='line-clamp-1 flex gap-2 font-medium text-purple-100'>
            {getChangeMessage(
              changeDirectionStore,
              totalStores,
              percentChangeStore
            )}
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
