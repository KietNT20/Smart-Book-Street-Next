'use client';

import { Suspense } from 'react';
import BookForm from '../../../_components/book-form';
import Loading from '../loading';
import { useEditPage } from '../use-edit-page';

const BookFormEdit = () => {
  const { book, router } = useEditPage();

  return (
    <Suspense fallback={<Loading />}>
      <div className='relative'>
        {book && (
          <BookForm
            book={book.result}
            onCancel={() => router.back()}
            mode='edit'
          />
        )}
      </div>
    </Suspense>
  );
};

export default BookFormEdit;
