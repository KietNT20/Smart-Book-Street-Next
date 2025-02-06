import { auth } from '@/auth';
import { PATH } from '@/enums/path';
import { redirect } from 'next/navigation';

const Page = async () => {
  try {
    const session = await auth();
    redirect(session ? PATH.DASHBOARD : PATH.LOGIN);
  } catch (error) {
    console.error('Auth check error:', error);
    redirect(PATH.LOGIN);
  }
};

export default Page;
