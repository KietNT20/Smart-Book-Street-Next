'use client';

import { Button } from '@/components/ui/button';
import axios from 'axios';
import { Google } from '../ui/google';

const GoogleBtn = () => {
  const handleLoginWithGoogle = async () => {
    try {
      const ressponse = await axios.get(
        `${process.env.NEXT_PUBLIC_API_GOOGLE_LOGIN}`
      );
      const { url } = ressponse.data;
      window.location.href = url;
    } catch (error) {
      console.log('Error logging in with Google:', error);
    }
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
