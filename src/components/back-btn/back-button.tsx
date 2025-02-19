'use client';

import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Button } from '../ui/button';

type Props = {
  routeTo?: string;
};

const BackButton = ({ routeTo }: Props) => {
  const router = useRouter();
  const _onClick = () => {
    if (routeTo) {
      router.push(routeTo);
    } else {
      router.back();
    }
  };
  return (
    <Button variant='ghost' className='gap-2' onClick={_onClick}>
      <ArrowLeft className='h-4 w-4' />
      Quay lại
    </Button>
  );
};

export default BackButton;
