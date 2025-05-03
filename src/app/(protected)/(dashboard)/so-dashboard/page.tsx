import LoadingSpinner from '@/components/spin/loading-spinner';
import dynamic from 'next/dynamic';
import { Suspense } from 'react';

const OrderStatisticsPage = dynamic(
  () => import('./_components/order-statics'),
  {
    ssr: false,
  }
);

const SectionCards = dynamic(
  () =>
    import('./_components/section-cards').then((mod) => ({
      default: mod.SectionCards,
    })),
  {
    ssr: false,
  }
);

const StoreDashboardPage = () => {
  return (
    <div className='flex flex-1 flex-col'>
      <div className='@container/main flex flex-1 flex-col gap-2'>
        <div className='flex flex-col gap-4 py-4 md:gap-6 md:py-6'>
          <Suspense fallback={<LoadingSpinner />}>
            <SectionCards />
          </Suspense>
        </div>
        <div>
          <Suspense fallback={<LoadingSpinner />}>
            <OrderStatisticsPage />
          </Suspense>
        </div>
      </div>
    </div>
  );
};

export default StoreDashboardPage;
