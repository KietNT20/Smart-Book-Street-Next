'use client';

import { Badge } from '@/components/ui/badge';
import { CheckCircle, Clock, XCircle } from 'lucide-react';

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
  message?: string;
};

const EventStatusBadge = ({ type, value, message }: Props) => {
  const getContent = () => {
    switch (type) {
      case 'approve':
        if (value) {
          return {
            text: 'Đã duyệt',
            variant: 'default' as BadgeVariant,
            icon: <CheckCircle className='mr-1 h-3 w-3' />,
          };
        } else if (message) {
          return {
            text: 'Bị từ chối',
            variant: 'destructive' as BadgeVariant,
            icon: <XCircle className='mr-1 h-3 w-3' />,
          };
        } else {
          return {
            text: 'Chưa duyệt',
            variant: 'secondary' as BadgeVariant,
            icon: <Clock className='mr-1 h-3 w-3' />,
          };
        }

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
