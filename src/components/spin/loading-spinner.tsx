'use client';

import { Loader2 } from 'lucide-react';

const LoadingSpinner = () => {
  return (
    <div className='flex min-h-screen items-center justify-center'>
      <Loader2 className='h-14 w-14 animate-spin text-primary' />
      <span className='ml-4 text-lg'>Đang tải...</span>
    </div>
  );
};

export default LoadingSpinner;
