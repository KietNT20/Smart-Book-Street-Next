'use client';

const LoadingSpinner = () => {
  return (
    <div className='flex min-h-screen items-center justify-center'>
      <div className='h-16 w-16 animate-spin rounded-full border-b-4 border-t-4 border-blue-500'></div>
      <span className='ml-4 text-lg'>Đang tải...</span>
    </div>
  );
};

export default LoadingSpinner;
