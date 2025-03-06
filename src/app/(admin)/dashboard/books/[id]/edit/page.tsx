'use client';

import BackButton from '@/components/back-btn/back-button';
import { Separator } from '@/components/ui/separator';
import BookForm from '../../_components/book-form';
import { useEditPage } from './useEditPage';

export default function EditBookPage() {
  const { book, apiLoading, router, handleSubmit } = useEditPage();

  return (
    <div className='container relative mx-auto'>
      <div className='space-y-2'>
        <div className=''>
          <BackButton />
        </div>
        <div className='rounded-lg border-2 px-20 py-4'>
          <h3 className='text-2xl font-bold'>Cập nhật sách</h3>
          <Separator className='my-4' />
          <div className=''>
            {book && (
              <BookForm
                book={book?.result}
                onSubmit={handleSubmit}
                onCancel={() => router.back()}
                isLoading={apiLoading}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
