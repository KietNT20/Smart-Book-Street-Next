'use client';

import { Separator } from '@/components/ui/separator';
import { useGetBookByID } from '@/hooks/use-book-search';
import BookForm from '../../_components/book-form';

export default function EditBookPage({ params }: { params: { id: string } }) {
  const { data: book } = useGetBookByID(params.id as string);
  return (
    <div className='container relative mx-auto overflow-hidden'>
      <div className='rounded-lg border-2 md:px-20 md:pb-7 md:pt-10'>
        <h3 className='text-2xl font-bold'>Cập nhật sách</h3>
        <Separator className='my-4' />
        <div className='relative'>
          {book && <BookForm book={book.result} mode='edit' />}
        </div>
      </div>
    </div>
  );
}
