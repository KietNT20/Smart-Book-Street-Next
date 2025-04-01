import { Skeleton } from '@/components/ui/skeleton';

export default function Loading() {
  return (
    <div className='flex h-screen w-full flex-col bg-gray-50 dark:bg-gray-900'>
      {/* Top navigation */}
      <div className='w-full border-b border-gray-200 bg-white p-3 dark:border-gray-800 dark:bg-gray-950'>
        <div className='flex items-center justify-between'>
          <Skeleton className='h-6 w-28' />
          <div className='flex items-center gap-3'>
            <Skeleton className='h-8 w-8 rounded-full' />
            <Skeleton className='h-5 w-24' />
          </div>
        </div>
      </div>

      <div className='flex flex-1 overflow-hidden'>
        {/* Sidebar */}
        <div className='w-60 flex-shrink-0 border-r border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-950'>
          <div className='border-b border-gray-200 p-4 dark:border-gray-800'>
            <Skeleton className='mb-1 h-8 w-36' />
            <Skeleton className='h-4 w-24' />
          </div>

          <div className='p-3'>
            <Skeleton className='mb-4 h-5 w-24' />

            <div className='space-y-3'>
              {[...Array(5)].map((_, i) => (
                <div key={i} className='flex items-center gap-3'>
                  <Skeleton className='h-5 w-5' />
                  <Skeleton className='h-5 w-32' />
                </div>
              ))}
            </div>

            <Skeleton className='my-4 h-5 w-16' />

            <div className='space-y-3'>
              {[...Array(4)].map((_, i) => (
                <div key={i} className='flex items-center gap-3'>
                  <Skeleton className='h-5 w-5' />
                  <Skeleton className='h-5 w-32' />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className='flex-1 overflow-auto p-6'>
          {/* Breadcrumb */}
          <div className='mb-6 flex items-center gap-2'>
            <Skeleton className='h-5 w-16' />
            <Skeleton className='h-4 w-4' />
            <Skeleton className='h-5 w-24' />
          </div>

          {/* Stat cards */}
          <div className='mb-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4'>
            {/* Card 1 - Visits */}
            <div className='rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-950'>
              <div className='flex justify-between'>
                <div>
                  <Skeleton className='mb-2 h-4 w-32' />
                  <Skeleton className='mb-1 h-8 w-24' />
                  <Skeleton className='h-3 w-28' />
                </div>
                <Skeleton className='h-10 w-10 rounded-full' />
              </div>
            </div>

            {/* Card 2 - Books */}
            <div className='rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-950'>
              <div className='flex justify-between'>
                <div>
                  <Skeleton className='mb-2 h-4 w-24' />
                  <Skeleton className='mb-1 h-8 w-24' />
                  <Skeleton className='h-3 w-32' />
                </div>
                <Skeleton className='h-10 w-10 rounded-full' />
              </div>
            </div>

            {/* Card 3 - Users */}
            <div className='rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-950'>
              <div className='flex justify-between'>
                <div>
                  <Skeleton className='mb-2 h-4 w-36' />
                  <Skeleton className='mb-1 h-8 w-20' />
                  <Skeleton className='h-3 w-32' />
                </div>
                <Skeleton className='h-10 w-10 rounded-full' />
              </div>
            </div>

            {/* Card 4 - Average Time */}
            <div className='rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-950'>
              <div className='flex justify-between'>
                <div>
                  <Skeleton className='mb-2 h-4 w-40' />
                  <Skeleton className='mb-1 h-8 w-20' />
                  <Skeleton className='h-3 w-36' />
                </div>
                <Skeleton className='h-10 w-10 rounded-full' />
              </div>
            </div>
          </div>

          {/* Chart sections */}
          <div className='grid grid-cols-1 gap-6 lg:grid-cols-2'>
            {/* Bar Chart */}
            <div className='rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-950'>
              <div className='mb-6 flex items-center justify-between'>
                <div>
                  <Skeleton className='h-6 w-40' />
                  <Skeleton className='mt-1 h-4 w-32' />
                </div>
                <Skeleton className='h-8 w-36 rounded-md' />
              </div>
              <div className='flex h-64 items-end space-x-2 px-2'>
                {[...Array(12)].map((_, i) => (
                  <div key={i} className='flex flex-1 space-x-1'>
                    <Skeleton
                      className={`w-full h-${20 + Math.floor(Math.random() * 40)}`}
                    />
                    <Skeleton
                      className={`w-full h-${20 + Math.floor(Math.random() * 30)}`}
                    />
                  </div>
                ))}
              </div>
              <div className='mt-2 flex justify-between px-2'>
                <Skeleton className='h-4 w-8' />
                <Skeleton className='h-4 w-8' />
                <Skeleton className='h-4 w-8' />
                <Skeleton className='h-4 w-8' />
                <Skeleton className='h-4 w-8' />
                <Skeleton className='h-4 w-8' />
              </div>
            </div>

            {/* Donut Chart */}
            <div className='rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-950'>
              <div className='mb-6 flex items-center justify-between'>
                <div>
                  <Skeleton className='h-6 w-36' />
                  <Skeleton className='mt-1 h-4 w-32' />
                </div>
                <Skeleton className='h-8 w-36 rounded-md' />
              </div>
              <div className='relative flex h-64 items-center justify-center'>
                <Skeleton className='h-48 w-48 rounded-full' />
                <div className='absolute inset-0 flex flex-col items-center justify-center'>
                  <Skeleton className='h-10 w-28 rounded-md' />
                  <Skeleton className='mt-2 h-4 w-16' />
                </div>
              </div>
              <div className='mt-4'>
                <Skeleton className='mt-2 h-4 w-full' />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
