'use client';

import { Button } from '@/components/ui/button';
import { Google } from '../ui/google';

const GoogleBtn = () => {
  return (
    <a href={`${process.env.NEXT_PUBLIC_API_GOOGLE_LOGIN}`}>
      <Button
        type='button'
        variant='outline'
        className='flex w-full items-center justify-center gap-2'
      >
        <Google />
        Đăng nhập bằng Google
      </Button>
    </a>
  );
};

export default GoogleBtn;
