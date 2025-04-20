'use client';

import { LoginForm } from '@/components/form/login-form';
import { PATH } from '@/enums/path';
import tokenMethod from '@/utils/token';
import { GalleryVerticalEnd } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Suspense, useEffect } from 'react';

export default function LoginPage() {
  const router = useRouter();

  useEffect(() => {
    if (tokenMethod.get()) {
      router.push(PATH.DASHBOARD);
    }
  }, [router]);

  return (
    <Suspense>
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
