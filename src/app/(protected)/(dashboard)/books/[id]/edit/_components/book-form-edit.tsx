'use client';

import { useGetBookByID } from '@/hooks/use-book-search';
import { useParams } from 'next/navigation';
import { Suspense } from 'react';
import BookForm from '../../../_components/book-form';
import Loading from '../loading';

const BookFormEdit = () => {
  const params = useParams();
  const bookId = params.id as string;

  const { data: book } = useGetBookByID(bookId);

  return (
    <Suspense fallback={<Loading />}>
      <div className='relative'>
        {book && <BookForm book={book.result} mode='edit' />}
      </div>
    </Suspense>
  );
};

export default BookFormEdit;
