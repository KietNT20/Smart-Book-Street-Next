'use client';

import { Button } from '@/components/ui/button';
import { signIn } from 'next-auth/react';
import { Google } from '../ui/google';

const GoogleBtn = () => {
  const handleLoginGoogle = async () => {
    await signIn('google', {
      callbackUrl: `${process.env.NEXT_PUBLIC_API_GOOGLE_LOGIN}`,
    });
  };

  return (
    <Button
      type='button'
      variant='outline'
      className='flex w-full items-center justify-center gap-2'
      onClick={handleLoginGoogle}
    >
      <Google />
      Đăng nhập bằng Google
    </Button>
  );
};

export default GoogleBtn;
