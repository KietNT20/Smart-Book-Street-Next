'use client';

import { Button } from '@/components/ui/button';
import { API_ENDPOINT } from '@/constant/api-url';
import { BASE_URL } from '@/constant/environment';
import axios from '@/utils/axiosInstance';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

const GoogleBtn = () => {
  const router = useRouter();

  useEffect(() => {
    const checkGoogleResponse = async () => {
      try {
        const response = await axios.get(API_ENDPOINT.USERS.GOOGLE_RESPONSE);
        if (response.data) {
          // Lưu token và data nếu cần
          localStorage.setItem('token', response.data.token);
          // Chuyển hướng sau khi đăng nhập thành công
          router.push('/dashboard');
        }
      } catch (error: unknown) {
        console.error('Google response error:', error);
      }
    };

    checkGoogleResponse();
  }, [router]);

  const handleGoogleLogin = () => {
    window.location.href = `${BASE_URL}${API_ENDPOINT.USERS.GOOGLE_LOGIN}`;
  };

  return (
    <Button
      type="button"
      onClick={handleGoogleLogin}
      variant="outline"
      className="flex w-full items-center justify-center gap-2"
    >
      Đăng nhập bằng Google
    </Button>
  );
};

export default GoogleBtn;
