'use server';

import { signIn } from '@/auth';
import { LoginCredentials } from '@/types/auth.types';
import { AuthError } from 'next-auth';

export async function handleCredentialsLogin(formData: FormData) {
  try {
    // Handle Google OAuth
    if (formData.get('provider') === 'google') {
      await signIn('google', { redirectTo: '/' });
      return;
    }

    // Handle credentials login
    const credentials: LoginCredentials = {
      usernameOrEmail: formData.get('usernameOrEmail') as string,
      password: formData.get('password') as string,
    };

    await signIn('credentials', {
      ...credentials,
      redirectTo: '/',
    });
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return { error: 'Tài khoản hoặc mật khẩu không chính xác' };
        default:
          return { error: 'Đã có lỗi xảy ra' };
      }
    }
    throw error;
  }
}
