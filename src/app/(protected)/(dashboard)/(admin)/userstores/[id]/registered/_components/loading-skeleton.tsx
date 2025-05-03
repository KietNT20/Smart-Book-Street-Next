import { Skeleton } from '@/components/ui/skeleton';

const LoadingSkeleton = () => {
  return (
    <div className='container mx-auto'>
      <div className='mb-6 flex items-center justify-between'>
        <div>
          <Skeleton className='h-10 w-64' />
          <Skeleton className='mt-2 h-5 w-40' />
        </div>
        <Skeleton className='h-8 w-24' />
      </div>

      <Skeleton className='h-12 w-full' />

      <Skeleton className='mt-6 h-96 w-full' />
    </div>
  );
};

export default LoadingSkeleton;
