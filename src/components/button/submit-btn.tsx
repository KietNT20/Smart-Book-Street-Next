'use client';

import { Loader2 } from 'lucide-react';
import { Button } from '../ui/button';

type Props = {
  ID?: string;
  _onPending: boolean;
};

const SubmitBtn = ({ ID, _onPending }: Props) => {
  return (
    <Button type='submit' disabled={_onPending} className='px-7'>
      {_onPending ? (
        <>
          <Loader2 className='mr-2 h-4 w-4 animate-spin' />
          Đang xử lý...
        </>
      ) : ID ? (
        'Cập nhật'
      ) : (
        'Thêm mới'
      )}
    </Button>
  );
};

export default SubmitBtn;
