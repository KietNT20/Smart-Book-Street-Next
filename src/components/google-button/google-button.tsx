import { loginGoogleAction } from '@/app/(guest)/auth/login/_lib/action';
import { Button } from '../ui/button';
import { Google } from '../ui/google';

type Props = {
  signInText?: boolean;
};

const GoogleButton = ({ signInText = false }: Props) => {
  return (
    <form action={loginGoogleAction}>
      <Button type='submit' variant='outline' className='w-full'>
        <Google />
        Đăng {signInText ? 'nhập' : 'ký'} bằng Google
      </Button>
    </form>
  );
};

export default GoogleButton;
