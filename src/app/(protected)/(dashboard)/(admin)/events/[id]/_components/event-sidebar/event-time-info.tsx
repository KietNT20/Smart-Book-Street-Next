import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import dayjs from 'dayjs';
import { Calendar } from 'lucide-react';

interface EventTimeInfoProps {
  startDate: string | Date | null | undefined;
  endDate: string | Date | null | undefined;
}

export default function EventTimeInfo({
  startDate,
  endDate,
}: EventTimeInfoProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className='flex items-center gap-2'>
          <Calendar className='h-5 w-5' />
          Thời gian
        </CardTitle>
      </CardHeader>
      <CardContent className='space-y-4'>
        <div className='flex items-center justify-between'>
          <div>
            <p className='text-sm text-muted-foreground'>Ngày bắt đầu</p>
            <p className='font-medium'>
              {dayjs(startDate).format('DD/MM/YYYY')}
            </p>
          </div>
          <div>
            <p className='text-sm text-muted-foreground'>Ngày kết thúc</p>
            <p className='font-medium'>{dayjs(endDate).format('DD/MM/YYYY')}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
