import { Separator } from '@/components/ui/separator';
import dynamic from 'next/dynamic';

const BookFormCreate = dynamic(() => import('./_components/book-form-create'), {
  ssr: false,
});

export default function CreateBookPage() {
  return (
    <div className='container relative mx-auto overflow-hidden py-10'>
      <div className='rounded-lg border-2 px-4 py-2 md:px-20 md:pb-7 md:pt-10'>
        <h3 className='text-2xl font-bold'>Thêm sách mới</h3>
        <Separator className='my-4' />
        <BookFormCreate />
      </div>
    </div>
  );
}
