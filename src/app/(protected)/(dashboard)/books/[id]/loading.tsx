'use client';

import LoadingSpinner from '@/components/spin/loading-spinner';
import { Separator } from '@/components/ui/separator';

export default function Loading() {
  return (
    <div className='space-y-6'>
      <div className='h-10 w-24'></div>
      <Separator />
      <div className='flex items-center justify-between'>
        <h2 className='text-2xl font-bold'>Chi tiết sách</h2>
        <div className='flex gap-4'>
          <div className='h-10 w-32 animate-pulse rounded-md bg-gray-200'></div>
          <div className='h-10 w-32 animate-pulse rounded-md bg-gray-200'></div>
          <div className='h-10 w-32 animate-pulse rounded-md bg-gray-200'></div>
        </div>
      </div>
      <Separator />
      <div className='flex gap-4'>
        <div className='max-w-[40vw]'>
          <div className='grid gap-4 md:grid-flow-col'>
            {[1, 2].map((_, index) => (
              <div
                key={index}
                className='h-64 w-48 animate-pulse rounded-md bg-gray-200'
              ></div>
            ))}
          </div>
        </div>
        <div className='flex-1 space-y-4'>
          {[1, 2, 3, 4, 5, 6].map((_, index) => (
            <div key={index} className='space-y-2'>
              <div className='h-5 w-24 animate-pulse rounded-md bg-gray-200'></div>
              <div className='h-8 w-full animate-pulse rounded-md bg-gray-200'></div>
            </div>
          ))}
        </div>
      </div>
      <div className='flex justify-center'>
        <LoadingSpinner />
      </div>
    </div>
  );
}
