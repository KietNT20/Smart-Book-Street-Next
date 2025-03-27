'use client';

import { Button } from '@/components/ui/button';
import { Google } from '../ui/google';

const GoogleBtn = () => {
  const handleLoginWithGoogle = (): void => {
    window.location.href = `${process.env.NEXT_PUBLIC_API_GOOGLE_LOGIN}`;
  };

  return (
    <Button
      variant='outline'
      className='flex w-full items-center justify-center gap-2'
      onClick={handleLoginWithGoogle}
    >
      <Google />
      Đăng nhập bằng Google
    </Button>
  );
};

export default GoogleBtn;
