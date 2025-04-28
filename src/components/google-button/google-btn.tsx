'use client';

import { Button } from '@/components/ui/button';
import { Google } from '../ui/google';

const GoogleBtn = () => {
  return (
    <Button
      variant='outline'
      className='flex w-full items-center justify-center gap-2'
    >
      <Google />
      Đăng nhập bằng Google
    </Button>
  );
};

export default GoogleBtn;
