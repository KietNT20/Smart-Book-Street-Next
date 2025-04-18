'use client';

import { useRouter } from 'next/navigation';
import { Button } from '../ui/button';

type Props = {
  _isPending: boolean;
  routerReplace?: boolean;
  pathUrl?: string;
};

const CancelButton = ({
  _isPending,
  routerReplace = false,
  pathUrl = '#',
}: Props) => {
  const router = useRouter();
  const _onClick = () => {
    if (routerReplace) {
      router.replace(pathUrl);
    } else {
      router.back();
    }
  };
  return (
    <Button variant={'outline'} disabled={_isPending} onClick={_onClick}>
      Hủy
    </Button>
  );
};

export default CancelButton;
