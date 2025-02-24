'use client';

import { Button } from '@/components/ui/button';
import { BookFormValues } from '@/lib/zod';
import { useFormStatus } from 'react-dom';

type Props = { book?: BookFormValues; _onPending: boolean };

const BookSubmitBtn = ({ book, _onPending }: Props) => {
  const { pending } = useFormStatus();
  return (
    <Button disabled={pending || _onPending} type='submit' className='px-7'>
      {book ? 'Cập nhật' : 'Thêm mới'}
    </Button>
  );
};

export default BookSubmitBtn;
