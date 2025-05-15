import { Skeleton } from '@/components/ui/skeleton';

const Loading = () => {
  return (
    <div className='mx-auto mt-8 max-w-6xl p-4'>
      <div className='mb-8 h-96 w-full'>
        <Skeleton className='h-full w-full rounded-xl' />
      </div>
      <div className='grid grid-cols-1 gap-8 md:grid-cols-3'>
        <div className='space-y-6 md:col-span-2'>
          <Skeleton className='h-64 w-full rounded-xl' />
          <Skeleton className='h-64 w-full rounded-xl' />
        </div>
        <div className='space-y-6'>
          <Skeleton className='h-48 w-full rounded-xl' />
          <Skeleton className='h-64 w-full rounded-xl' />
        </div>
      </div>
    </div>
  );
};

export default Loading;
