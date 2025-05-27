'use client';

import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle } from 'lucide-react';

type BadgeVariant =
  | 'default'
  | 'destructive'
  | 'secondary'
  | 'outline'
  | 'darker'
  | 'matcha';

type Props = {
  type: 'approve' | 'open' | 'ads';
  value: boolean;
};

const EventStatusBadge = ({ type, value }: Props) => {
  const getContent = () => {
    switch (type) {
      case 'approve':
        return {
          text: value ? 'Đã duyệt' : 'Chưa duyệt',
          variant: (value ? 'default' : 'destructive') as BadgeVariant,
          icon: value ? (
            <CheckCircle className='mr-1 h-3 w-3' />
          ) : (
            <XCircle className='mr-1 h-3 w-3' />
          ),
        };
      case 'open':
        return {
          text: value ? 'Đang mở' : 'Đã đóng',
          variant: (value ? 'default' : 'secondary') as BadgeVariant,
          icon: null,
        };
      case 'ads':
        return {
          text: value ? 'Có' : 'Không',
          variant: (value ? 'default' : 'secondary') as BadgeVariant,
          icon: null,
        };
    }
  };

  const content = getContent();

  return (
    <Badge variant={content.variant}>
      {content.icon}
      {content.text}
    </Badge>
  );
};

export default EventStatusBadge;
