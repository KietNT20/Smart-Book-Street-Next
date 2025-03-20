'use client';

import BookForm from '../../../_components/book-form';
import { useEditPage } from '../use-edit-page';

const BookFormEdit = () => {
  const { book, router, handleSubmitUpdate, apiLoading } = useEditPage();

  return (
    <div className='relative'>
      {book && (
        <BookForm
          book={book?.result}
          onSubmit={handleSubmitUpdate}
          onCancel={() => router.back()}
          isLoading={apiLoading}
        />
      )}
    </div>
  );
};

export default BookFormEdit;
