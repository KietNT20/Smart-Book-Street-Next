'use client';

import { Button } from '@/components/ui/button';
import { useFormStatus } from 'react-dom';

type Props = {
  authorId?: string;
  _onPending: boolean;
};

const AuthorSubmitBtn = ({ authorId, _onPending }: Props) => {
  const { pending } = useFormStatus();
  return (
    <Button type='submit' disabled={pending || _onPending}>
      {authorId ? 'Cập nhật' : 'Thêm mới'}
    </Button>
  );
};

export default AuthorSubmitBtn;
