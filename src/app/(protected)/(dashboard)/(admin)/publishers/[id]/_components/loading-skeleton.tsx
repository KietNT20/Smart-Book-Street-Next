import { Skeleton } from '@/components/ui/skeleton';

export const LoadingSkeleton = () => {
  return (
    <div className='container mx-auto p-4'>
      <div className='flex flex-col gap-6'>
        <div className='flex flex-col gap-6 md:flex-row'>
          <Skeleton className='h-64 w-full rounded-lg md:w-1/4' />
          <div className='w-full space-y-4 md:w-3/4'>
            <Skeleton className='h-10 w-3/4' />
            <Skeleton className='h-4 w-full' />
            <Skeleton className='h-4 w-full' />
            <Skeleton className='h-4 w-2/3' />
            <div className='grid grid-cols-2 gap-4'>
              <div className='space-y-2'>
                <Skeleton className='h-4 w-full' />
                <Skeleton className='h-4 w-full' />
                <Skeleton className='h-4 w-full' />
              </div>
              <div className='space-y-2'>
                <Skeleton className='h-4 w-full' />
                <Skeleton className='h-4 w-full' />
                <Skeleton className='h-4 w-full' />
              </div>
            </div>
          </div>
        </div>
        <Skeleton className='h-10 w-64' />
        <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
          {Array(8)
            .fill(0)
            .map((_, i) => (
              <div key={i} className='space-y-4'>
                <Skeleton className='h-48 w-full rounded-lg' />
                <Skeleton className='h-6 w-3/4' />
                <Skeleton className='h-4 w-1/2' />
                <Skeleton className='h-4 w-full' />
                <Skeleton className='h-10 w-1/2' />
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};
