'use client';

import Link from 'next/link';

export default function UnauthorizedPage() {
  const goBack = () => {
    window.history.back();
  };

  return (
    <div className='flex min-h-screen flex-col items-center justify-center bg-gray-50 p-5'>
      <div className='w-full max-w-md overflow-hidden rounded-lg bg-background shadow-md'>
        <div className='h-2 bg-red-500'></div>
        <div className='p-8'>
          <div className='mb-6 flex justify-center'>
            <div className='rounded-full bg-red-100 p-3'>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                className='h-12 w-12 text-red-500'
                fill='none'
                viewBox='0 0 24 24'
                stroke='currentColor'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z'
                />
              </svg>
            </div>
          </div>

          <h1 className='mb-3 text-center text-2xl font-bold text-zinc-800'>
            Truy cập bị từ chối
          </h1>

          <p className='mb-6 text-center text-zinc-600'>
            Bạn không có quyền truy cập vào trang này. Vui lòng liên hệ quản trị
            viên nếu bạn cho rằng đây là lỗi.
          </p>

          <div className='flex flex-col justify-center gap-3 sm:flex-row'>
            <button
              onClick={goBack}
              className='rounded-md bg-gray-200 px-4 py-2 text-zinc-800 transition-colors hover:bg-gray-300'
            >
              Quay lại
            </button>

            <Link
              href='/'
              className='rounded-md bg-blue-600 px-4 py-2 text-center text-white transition-colors hover:bg-blue-700'
            >
              Về trang chủ
            </Link>
          </div>
        </div>
      </div>

      <div className='mt-6 text-sm text-zinc-500'>
        Cần trợ giúp?{' '}
        <Link href='/contact' className='text-blue-500 hover:underline'>
          Liên hệ hỗ trợ
        </Link>
      </div>
    </div>
  );
}
