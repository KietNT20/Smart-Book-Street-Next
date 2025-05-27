'use client';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useEventOpenState } from '@/hooks/use-event';
import { Loader2, Lock, ToggleLeft, Unlock } from 'lucide-react';
import { useState } from 'react';

type Props = {
  eventId: string;
  currentState?: boolean;
  eventName?: string;
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'sm' | 'default' | 'lg';
  showStateText?: boolean;
};

const EventOpenStateButton = ({
  eventId,
  currentState,
  eventName = 'sự kiện này',
  variant = 'default',
  size = 'default',
  showStateText = true,
}: Props) => {
  const [showConfirmDialog, setShowConfirmDialog] = useState<boolean>(false);
  const { getEventOpenState, isGettingEventOpenState } = useEventOpenState();

  const handleToggleState = () => {
    getEventOpenState(eventId);
    setShowConfirmDialog(false);
  };

  const getStateInfo = () => {
    if (currentState === undefined) {
      return {
        icon: ToggleLeft,
        text: 'Cập nhật trạng thái',
        badgeText: 'Không xác định',
        badgeVariant: 'secondary' as const,
        actionText: 'cập nhật trạng thái',
        description:
          'Bạn có chắc chắn muốn cập nhật trạng thái sự kiện này không?',
      };
    }

    if (currentState) {
      return {
        icon: Unlock,
        text: 'Đóng sự kiện',
        badgeText: 'Đang mở',
        badgeVariant: 'default' as const,
        actionText: 'đóng sự kiện',
        description: 'Sự kiện sẽ được đóng và không cho phép đăng ký mới.',
      };
    } else {
      return {
        icon: Lock,
        text: 'Mở sự kiện',
        badgeText: 'Đã đóng',
        badgeVariant: 'destructive' as const,
        actionText: 'mở sự kiện',
        description: 'Sự kiện sẽ được mở và cho phép đăng ký mới.',
      };
    }
  };

  const stateInfo = getStateInfo();
  const IconComponent = stateInfo.icon;

  return (
    <div className='flex items-center gap-2'>
      {showStateText && currentState !== undefined && (
        <Badge variant={stateInfo.badgeVariant} className='text-xs'>
          {stateInfo.badgeText}
        </Badge>
      )}

      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogTrigger asChild>
          <Button
            variant={variant}
            size={size}
            disabled={isGettingEventOpenState}
            className='flex items-center gap-2'
          >
            {isGettingEventOpenState ? (
              <Loader2 className='size-4 animate-spin' />
            ) : (
              <IconComponent className='size-4' />
            )}
            {isGettingEventOpenState ? 'Đang xử lý...' : stateInfo.text}
          </Button>
        </AlertDialogTrigger>

        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className='flex items-center gap-2'>
              <IconComponent className='size-5' />
              Xác nhận {stateInfo.actionText}
            </AlertDialogTitle>
            <AlertDialogDescription className='space-y-2'>
              <p>
                Bạn có chắc chắn muốn <strong>{stateInfo.actionText}</strong>{' '}
                &quot;
                {eventName}&quot; không?
              </p>
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleToggleState}
              className='flex items-center gap-2'
            >
              <IconComponent className='size-4' />
              Xác nhận {stateInfo.actionText}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default EventOpenStateButton;
