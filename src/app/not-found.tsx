'use client';

import { Button } from '@/components/ui/button';
import { PATH } from '@/enums/path';
import { ArrowLeftIcon, FileX2Icon, HomeIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function NotFound() {
  const router = useRouter();

  return (
    <div className='flex min-h-screen flex-col items-center justify-center bg-background p-6'>
      <div className='w-full max-w-md space-y-8 text-center'>
        {/* Error Code and Icon */}
        <div className='relative'>
          <h1 className='text-[150px] font-bold leading-none text-primary/20'>
            404
          </h1>
          <div className='absolute inset-0 flex items-center justify-center'>
            <FileX2Icon className='h-24 w-24 text-primary' />
          </div>
        </div>

        {/* Error Message */}
        <div className='space-y-3'>
          <h2 className='text-2xl font-semibold text-foreground'>
            Trang không tìm thấy
          </h2>
          <p className='text-muted-foreground'>
            Trang bạn đang tìm kiếm không tồn tại hoặc đã bị di chuyển.
          </p>
        </div>

        {/* Divider */}
        <div className='flex items-center justify-center'>
          <div className='h-px w-16 bg-border'></div>
          <div className='px-3 text-muted-foreground'>hoặc</div>
          <div className='h-px w-16 bg-border'></div>
        </div>

        {/* Action Buttons */}
        <div className='flex flex-col justify-center gap-4 sm:flex-row'>
          <Button
            variant='outline'
            className='flex items-center gap-2'
            onClick={() => router.back()}
          >
            <ArrowLeftIcon className='size-4' />
            Quay lại
          </Button>
          <Button
            className='flex items-center gap-2 bg-primary text-primary-foreground'
            onClick={() => router.push(PATH.HOME)}
          >
            <HomeIcon className='size-4' />
            Về Dashboard
          </Button>
        </div>
      </div>

      {/* Footer */}
      <div className='mt-12 text-sm text-muted-foreground'>
        &copy; {new Date().getFullYear()}
      </div>
    </div>
  );
}
