'use client';

import { Loader } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { formatPrice } from '@/lib/utils';
import dayjs from 'dayjs';
import { useSectionCardSoDashboard } from '../_hooks/use-section-card';

export function SectionCards() {
  const {
    staticsStore,
    inventoriesByStoreLoading,
    storeContract,
    isLoadingStoreContract,
    orderStaticsYearlyStore,
    orderYearLoading,
    currentYear,
  } = useSectionCardSoDashboard();
  return (
    <div className='shadow-xs grid grid-cols-1 gap-4 bg-card px-4 md:grid-cols-2 lg:grid-cols-4 lg:px-6'>
      <Card className='@container/card'>
        <CardHeader className='relative'>
          <CardDescription>Tổng Sản Phẩm</CardDescription>
          <CardTitle className='@[250px]/card:text-4xl text-3xl font-semibold tabular-nums'>
            {inventoriesByStoreLoading ? (
              <Loader className='size-6 animate-spin' />
            ) : (
              staticsStore?.totalCount
            )}
          </CardTitle>
          {/* <div className='absolute right-4 top-4'>
            <Badge variant='outline' className='flex gap-1 rounded-lg text-xs'>
              <TrendingUpIcon className='size-3' />
              +12.5%
            </Badge>
          </div> */}
        </CardHeader>
        {/* <CardFooter className='flex-col items-start gap-1 text-sm'>
          <div className='line-clamp-1 flex gap-2 font-medium'>
            Trending up this month <TrendingUpIcon className='size-4' />
          </div>
          <div className='text-muted-foreground'>
            Visitors for the last 6 months
          </div>
        </CardFooter> */}
      </Card>
      <Card className='@container/card'>
        <CardHeader className='relative'>
          <CardDescription>Số Đơn Hàng</CardDescription>
          <CardTitle className='@[250px]/card:text-4xl text-3xl font-semibold tabular-nums'>
            {orderYearLoading ? (
              <Loader className='size-6 animate-spin' />
            ) : (
              orderStaticsYearlyStore?.totalOrder
            )}
          </CardTitle>
          <div className='absolute right-4 top-4'>
            <Badge variant='outline' className='flex gap-1 rounded-lg text-xs'>
              {currentYear}
            </Badge>
          </div>
        </CardHeader>
        {/* <CardFooter className='flex-col items-start gap-1 text-sm'>
          <div className='line-clamp-1 flex gap-2 font-medium'>
            Down 20% this period <TrendingDownIcon className='size-4' />
          </div>
          <div className='text-muted-foreground'>
            Acquisition needs attention
          </div>
        </CardFooter> */}
      </Card>
      <Card className='@container/card'>
        <CardHeader className='relative'>
          <CardDescription>Doanh Thu</CardDescription>
          <CardTitle className='@[250px]/card:text-4xl text-3xl font-semibold tabular-nums'>
            {isLoadingStoreContract ? (
              <Loader className='size-6 animate-spin' />
            ) : orderStaticsYearlyStore?.totalOrder ? (
              formatPrice(orderStaticsYearlyStore?.totalOrder)
            ) : (
              '0'
            )}
          </CardTitle>
          <div className='absolute right-4 top-4'>
            <Badge variant='outline' className='flex gap-1 rounded-lg text-xs'>
              {currentYear}
            </Badge>
          </div>
        </CardHeader>
        {/* <CardFooter className='flex-col items-start gap-1 text-sm'>
          <div className='line-clamp-1 flex gap-2 font-medium'>
            Strong user retention <TrendingUpIcon className='size-4' />
          </div>
          <div className='text-muted-foreground'>Engagement exceed targets</div>
        </CardFooter> */}
      </Card>
      <Card className='@container/card'>
        <CardHeader className='relative'>
          <CardDescription>Thời Hạn Hợp Đồng</CardDescription>
          <CardTitle className='@[250px]/card:text-4xl text-3xl font-semibold tabular-nums'>
            {isLoadingStoreContract ? (
              <Loader className='size-6 animate-spin' />
            ) : (
              dayjs(storeContract?.[0]?.endDate).format('DD/MM/YYYY')
            )}
          </CardTitle>
          {/* <div className='absolute right-4 top-4'>
            <Badge variant='outline' className='flex gap-1 rounded-lg text-xs'>
              <TrendingUpIcon className='size-3' />
              +4.5%
            </Badge>
          </div> */}
        </CardHeader>
        {/* <CardFooter className='flex-col items-start gap-1 text-sm'>
          <div className='line-clamp-1 flex gap-2 font-medium'>
            Steady performance <TrendingUpIcon className='size-4' />
          </div>
          <div className='text-muted-foreground'>Meets growth projections</div>
        </CardFooter> */}
      </Card>
    </div>
  );
}
