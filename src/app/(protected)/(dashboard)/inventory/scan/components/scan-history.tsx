'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ScanHistoryItem {
  isbn: string;
  quantity: number;
  timestamp: Date;
}

interface ScanHistoryProps {
  items: ScanHistoryItem[];
}

export const ScanHistory = ({ items }: ScanHistoryProps) => {
  return (
    <Card className='mt-6'>
      <CardHeader>
        <CardTitle>Lịch sử quét gần đây</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className='space-y-2'>
          {items.map((item, index) => (
            <li key={index} className='flex items-center justify-between'>
              <span className='text-sm font-medium'>{item.isbn}</span>
              <span className='text-sm text-muted-foreground'>
                SL: {item.quantity} -{' '}
                {new Date(item.timestamp).toLocaleTimeString()}
              </span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};
