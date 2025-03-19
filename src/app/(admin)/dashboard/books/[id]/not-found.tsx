import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { PATH } from '@/enums/path';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className='space-y-6'>
      {/* <BackButton /> */}
      <Separator />
      <div className='flex flex-col items-center justify-center space-y-6 py-12'>
        <div className='rounded-full bg-red-100 p-4'>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            className='h-16 w-16 text-red-500'
            fill='none'
            viewBox='0 0 24 24'
            stroke='currentColor'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M6 18L18 6M6 6l12 12'
            />
          </svg>
        </div>
        <h2 className='text-3xl font-bold text-gray-900'>
          Không tìm thấy sách
        </h2>
        <p className='max-w-md text-center text-gray-600'>
          Sách bạn đang tìm kiếm không tồn tại hoặc đã bị xóa. Vui lòng kiểm tra
          lại.
        </p>
        <div className='flex gap-4'>
          <Button variant='outline' onClick={() => window.history.back()}>
            Quay lại
          </Button>
          <Link href={PATH.BOOKS}>
            <Button>Danh sách sách</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
