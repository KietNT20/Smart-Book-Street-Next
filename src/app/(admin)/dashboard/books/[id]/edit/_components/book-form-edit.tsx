'use client';

import BookForm from '../../../_components/book-form';
import { useEditPage } from '../useEditPage';

const BookFormEdit = () => {
  const { book, router, handleSubmit, apiLoading } = useEditPage();

  return (
    <div className='relative'>
      {book && (
        <BookForm
          book={book?.result}
          onSubmit={handleSubmit}
          onCancel={() => router.back()}
          isLoading={apiLoading}
        />
      )}
    </div>
  );
};

export default BookFormEdit;
