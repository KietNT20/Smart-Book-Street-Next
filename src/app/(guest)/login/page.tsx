'use client';

import LoadingSpinner from '@/components/spin/loading-spinner';
import { GalleryVerticalEnd } from 'lucide-react';
import { lazy, Suspense } from 'react';

const LoginForm = lazy(() => import('@/components/form/login-form'));

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className='flex h-screen items-center justify-center'>
          <LoadingSpinner />
        </div>
      }
    >
      <div className='flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10'>
        <div className='flex w-full max-w-sm flex-col gap-6'>
          <a
            href='#'
            className='flex items-center gap-2 self-center font-medium'
          >
            <div className='flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground'>
              <GalleryVerticalEnd className='size-4' />
            </div>
            Acme Inc.
          </a>
          <LoginForm />
        </div>
      </div>
    </Suspense>
  );
}
