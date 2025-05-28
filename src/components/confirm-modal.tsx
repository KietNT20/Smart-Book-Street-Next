import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { AlertTriangle, CheckCircle, Info, XCircle } from 'lucide-react';
import { Button } from './ui/button';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'default' | 'destructive' | 'success' | 'warning';
  isLoading?: boolean;
  icon?: 'warning' | 'error' | 'success' | 'info' | 'none';
};

export const ConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = 'Xác nhận',
  cancelText = 'Hủy',
  variant = 'destructive',
  isLoading = false,
  icon = 'warning',
}: Props) => {
  const getIcon = () => {
    if (icon === 'none') return null;

    const iconClasses = 'size-6';

    switch (icon) {
      case 'warning':
        return <AlertTriangle className={`${iconClasses} text-yellow-500`} />;
      case 'error':
        return <XCircle className={`${iconClasses} text-destructive`} />;
      case 'success':
        return <CheckCircle className={`${iconClasses} text-green-500`} />;
      case 'info':
        return <Info className={`${iconClasses} text-blue-500`} />;
      default:
        return <AlertTriangle className={`${iconClasses} text-yellow-500`} />;
    }
  };

  const getButtonVariant = () => {
    switch (variant) {
      case 'destructive':
        return 'destructive';
      case 'success':
        return 'default';
      case 'warning':
        return 'default';
      default:
        return 'default';
    }
  };

  const getButtonClasses = () => {
    switch (variant) {
      case 'destructive':
        return 'bg-destructive hover:bg-destructive/90 text-destructive-foreground';
      case 'success':
        return 'bg-green-600 hover:bg-green-700 text-white';
      case 'warning':
        return 'bg-yellow-600 hover:bg-yellow-700 text-white';
      default:
        return '';
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className='max-w-md'>
        <AlertDialogHeader className='space-y-4'>
          {getIcon() && (
            <div className='flex justify-center'>
              <div className='rounded-full bg-muted p-3'>{getIcon()}</div>
            </div>
          )}
          <div className='space-y-2 text-center'>
            <AlertDialogTitle className='text-lg font-semibold'>
              {title}
            </AlertDialogTitle>
            <AlertDialogDescription className='text-sm leading-relaxed text-muted-foreground'>
              {description}
            </AlertDialogDescription>
          </div>
        </AlertDialogHeader>

        <AlertDialogFooter className='gap-2 sm:gap-2'>
          <AlertDialogCancel
            disabled={isLoading}
            onClick={onClose}
            className='flex-1'
          >
            {cancelText}
          </AlertDialogCancel>

          <AlertDialogAction asChild>
            <Button
              onClick={onConfirm}
              disabled={isLoading}
              variant={getButtonVariant()}
              className={`flex-1 ${getButtonClasses()}`}
            >
              {isLoading ? (
                <div className='flex items-center gap-2'>
                  <div className='size-4 animate-spin rounded-full border-2 border-current border-t-transparent' />
                  <span>Đang xử lý...</span>
                </div>
              ) : (
                confirmText
              )}
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
