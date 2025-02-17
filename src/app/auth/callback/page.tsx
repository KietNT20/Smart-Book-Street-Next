'use client';
import { API_ENDPOINT } from '@/constant/api-url';
import { BASE_URL } from '@/constant/environment';
import { GoogleLoginResponse } from '@/types/auth-types';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function CallbackPage() {
  const router = useRouter();
  //   const searchParams = useSearchParams();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const response = await fetch(
          `${BASE_URL}${API_ENDPOINT.USERS.GOOGLE_RESPONSE}`
        );
        const data: GoogleLoginResponse = await response.json();

        if (data.isSuccess) {
          // Lưu token và thông tin user vào localStorage
          localStorage.setItem('access_token', data.token);
          localStorage.setItem('user', JSON.stringify(data.result));

          // Redirect to dashboard
          router.push('/dashboard');
        } else {
          console.error('Login failed:', data.message);
          router.push('/login');
        }
      } catch (error) {
        console.error('Error during login:', error);
        router.push('/auth/login');
      }
    };

    handleCallback();
  }, [router]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div>Đang xử lý đăng nhập...</div>
    </div>
  );
}
