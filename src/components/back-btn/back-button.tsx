'use client';

import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Button } from '../ui/button';

type Props = {
  routeTo?: string;
  namePage?: string;
};

const BackButton = ({ routeTo, namePage = '' }: Props) => {
  const router = useRouter();
  const _onClick = () => {
    if (routeTo) {
      router.replace(routeTo);
    } else {
      router.back();
    }
  };
  return (
    <Button type='button' variant='ghost' className='gap-2' onClick={_onClick}>
      <ArrowLeft className='h-4 w-4' />
      Quay lại {namePage}
    </Button>
  );
};

export default BackButton;
