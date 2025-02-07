'use client';

import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Button } from '../ui/button';

const BackButton = () => {
  const router = useRouter();
  return (
    <Button variant="ghost" className="gap-2" onClick={() => router.back()}>
      <ArrowLeft className="h-4 w-4" />
      Quay lại
    </Button>
  );
};

export default BackButton;
