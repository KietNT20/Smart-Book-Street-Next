'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import DOMPurify from 'isomorphic-dompurify';

interface EventDescriptionProps {
  description: string | undefined;
}

export default function EventDescription({
  description,
}: EventDescriptionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Thông tin chi tiết</CardTitle>
      </CardHeader>
      <CardContent>
        <div
          dangerouslySetInnerHTML={{
            __html: DOMPurify.sanitize(description || ''),
          }}
        />
      </CardContent>
    </Card>
  );
}
