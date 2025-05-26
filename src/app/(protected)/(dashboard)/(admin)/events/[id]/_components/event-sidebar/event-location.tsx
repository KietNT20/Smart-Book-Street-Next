import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Zone } from '@/types/zone-types';
import { MapPin } from 'lucide-react';

interface EventLocationProps {
  zone?: Zone;
}

export default function EventLocation({ zone }: EventLocationProps) {
  if (!zone) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className='flex items-center gap-2'>
          <MapPin className='h-5 w-5' />
          Địa điểm
        </CardTitle>
      </CardHeader>
      <CardContent className='space-y-4'>
        <div>
          <h5 className='font-semibold text-primary'>{zone?.zoneName}</h5>
          <p className='mt-1 text-sm text-muted-foreground'>
            {zone.street?.address}
          </p>
        </div>
        <Separator />
        <div className='space-y-2'>
          <h5 className='font-semibold'>Về địa điểm</h5>
          <p className='text-sm text-muted-foreground'>{zone?.description}</p>
        </div>
      </CardContent>
    </Card>
  );
}
