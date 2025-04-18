import { Skeleton } from '@/components/ui/skeleton';

function UserDetailSkeleton() {
  return (
    <div className='container py-8'>
      <div className='mb-6 flex items-center'>
        <Skeleton className='mr-4 h-10 w-24' />
        <Skeleton className='h-8 w-48' />
      </div>

      <div className='grid gap-6 md:grid-cols-3'>
        <div className='md:col-span-2'>
          <Skeleton className='h-[400px] w-full rounded-lg' />
        </div>
        <Skeleton className='h-[400px] w-full rounded-lg' />
      </div>
    </div>
  );
}

export default UserDetailSkeleton;
