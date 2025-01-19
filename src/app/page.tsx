import { auth } from '@/auth';
import { PATH } from '@/constant/path';
import { redirect } from 'next/navigation';

const Page = async () => {
  const session = await auth();
  console.log('session homepage', session);
  if (session) {
    redirect(PATH.DASHBOARD);
  } else {
    redirect(PATH.LOGIN);
  }
};

export default Page;
