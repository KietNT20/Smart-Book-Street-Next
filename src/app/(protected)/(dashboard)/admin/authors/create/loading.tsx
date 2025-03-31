import { Skeleton } from '@/components/ui/skeleton';

const Loading = () => {
  return (
    <div className='flex flex-col space-y-3'>
      <div className='space-y-2'>
        <Skeleton className='h-4 w-full' />
        <Skeleton className='h-4 w-full' />
      </div>
      <div className='space-y-2'>
        <Skeleton className='h-4 w-full' />
        <Skeleton className='h-4 w-full' />
      </div>
      <Skeleton className='h-32 w-full rounded-xl' />
    </div>
  );
};

export default Loading;
