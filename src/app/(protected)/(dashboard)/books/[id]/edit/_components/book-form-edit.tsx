'use client';

import BookForm from '../../../_components/book-form';
import { useEditPage } from '../use-edit-page';

const BookFormEdit = () => {
  const { book, router } = useEditPage();

  return (
    <div className='relative'>
      {book && <BookForm book={book.result} onCancel={() => router.back()} />}
    </div>
  );
};

export default BookFormEdit;
