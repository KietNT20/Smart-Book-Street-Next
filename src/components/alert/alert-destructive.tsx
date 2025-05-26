import { AlertCircle } from 'lucide-react';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

type Props = {
  title?: string;
  description?: string;
};

export function AlertDestructive({ title, description }: Props) {
  return (
    <Alert variant='destructive'>
      <AlertCircle className='size-4' />
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription>{description}</AlertDescription>
    </Alert>
  );
}
