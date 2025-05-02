'use client';

import { Separator } from '@/components/ui/separator';
import { PATH } from '@/enums/path';
import { useGetBookByID } from '@/hooks/use-book-search';
import { useEntityBreadcrumb } from '@/hooks/use-breadcrumb-page';
import BookForm from '../../_components/book-form';

export default function EditBookPage({ params }: { params: { id: string } }) {
  const { bookData } = useGetBookByID(params.id);
  useEntityBreadcrumb(PATH.BOOKS, 'Sách', params.id, bookData?.title, true);
  return (
    <div className='container relative mx-auto overflow-hidden'>
      <div className='rounded-lg border-2 md:px-20 md:pb-7 md:pt-10'>
        <h3 className='text-2xl font-bold'>Cập nhật sách</h3>
        <Separator className='my-4' />
        <div className='relative'>
          {bookData && <BookForm book={bookData} mode='edit' />}
        </div>
      </div>
    </div>
  );
}
