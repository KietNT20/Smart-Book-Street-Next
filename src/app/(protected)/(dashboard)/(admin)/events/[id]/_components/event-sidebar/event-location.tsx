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
          <h4 className='font-semibold'>{zone?.zoneName}</h4>
          <p className='mt-1 text-sm text-muted-foreground'>
            {zone.street?.address}
          </p>
        </div>

        <div className='h-48 overflow-hidden rounded-lg bg-card'>
          {/* Map placeholder */}
          <div className='flex h-full w-full items-center justify-center bg-card'>
            <MapPin className='h-8 w-8 text-muted-foreground' />
          </div>
        </div>

        <Separator />

        <div className='space-y-2'>
          <h4 className='font-semibold'>Về địa điểm</h4>
          <p className='text-sm text-muted-foreground'>{zone?.description}</p>
        </div>
      </CardContent>
    </Card>
  );
}
