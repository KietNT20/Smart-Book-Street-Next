'use server';

import { signIn } from '@/auth';
import { PATH } from '@/enums/path';

export async function loginGoogleAction() {
  await signIn('google', { redirectTo: PATH.DASHBOARD });
}
