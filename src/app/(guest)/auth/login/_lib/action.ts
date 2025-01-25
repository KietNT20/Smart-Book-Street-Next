'use server';

import { signIn } from '@/auth';
import { PATH } from '@/constant/path';

export async function loginGoogleAction() {
  await signIn('google', { redirectTo: PATH.DASHBOARD });
}
