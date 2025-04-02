'use client';

import { Button } from '@/components/ui/button';

type Props = {
  authorId?: string;
  _onPending: boolean;
};

const AuthorSubmitBtn = ({ authorId, _onPending }: Props) => {
  return (
    <Button type='submit' disabled={_onPending}>
      {authorId ? 'Cập nhật' : 'Thêm mới'}
    </Button>
  );
};

export default AuthorSubmitBtn;
