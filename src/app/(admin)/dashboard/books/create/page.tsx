import BackButton from '@/components/back-btn/back-button';
import { Separator } from '@/components/ui/separator';
import { PATH } from '@/enums/path';
import BookFormCreate from './_components/book-form-create';

export default function CreateBookPage() {
  return (
    <div className='container relative mx-auto'>
      <div className='space-y-2'>
        <BackButton routeTo={PATH.BOOKS} />
        <div className='rounded-lg border-2 md:px-20 md:pb-7 md:pt-10'>
          <h3 className='text-2xl font-bold'>Thêm sách mới</h3>
          <Separator className='my-4' />
          <BookFormCreate />
        </div>
      </div>
    </div>
  );
}
