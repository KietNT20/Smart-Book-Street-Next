import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useExportStatisticEventRegistrations } from '@/hooks/use-event-registrations';
import { Download, Loader2, Mail } from 'lucide-react';
import { useState } from 'react';
import { z } from 'zod';

const emailSchema = z.object({
  email: z
    .string()
    .email('Email không hợp lệ')
    .min(1, 'Email không được để trống'),
});

type Props = {
  eventId: string;
  defaultEmail: string;
};

const ExportStatisticsComp = ({ eventId, defaultEmail }: Props) => {
  const [email, setEmail] = useState<string>(defaultEmail);
  const [emailError, setEmailError] = useState<string>('');
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const { exportStatistic, isExportingPending } =
    useExportStatisticEventRegistrations();

  const validateEmail = (emailValue: string) => {
    const result = emailSchema.safeParse({ email: emailValue.trim() });
    if (!result.success) {
      const errorMessage =
        result.error.errors[0]?.message || 'Email không hợp lệ';
      setEmailError(errorMessage);
      return false;
    }
    setEmailError('');
    return true;
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEmail = e.target.value;
    setEmail(newEmail);

    // Only validate if there's content
    if (newEmail.trim()) {
      validateEmail(newEmail);
    } else {
      setEmailError('');
    }
  };

  const handleExport = () => {
    if (!validateEmail(email)) {
      return;
    }

    exportStatistic({
      eventId,
      email: email.trim(),
    });

    setIsDialogOpen(false);
  };

  const canExport = email.trim() && !emailError && !isExportingPending;

  const handleDialogChange = (open: boolean) => {
    setIsDialogOpen(open);
    if (open) {
      setEmail(defaultEmail);
      setEmailError('');
    }
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={handleDialogChange}>
      <DialogTrigger asChild>
        <Button variant='outline' className='flex items-center gap-2'>
          <Download className='size-4' />
          Xuất thống kê
        </Button>
      </DialogTrigger>
      <DialogContent>
        <Card className='w-full max-w-md border-none shadow-none'>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <Download className='h-5 w-5' />
              Xuất thống kê
            </CardTitle>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='space-y-2'>
              <Label htmlFor='export-email' className='flex items-center gap-2'>
                <Mail className='h-4 w-4' />
                Email nhận thống kê
              </Label>
              <Input
                id='export-email'
                type='email'
                placeholder='Nhập email để nhận thống kê'
                value={email}
                onChange={handleEmailChange}
                disabled={isExportingPending}
                className={emailError ? 'border-destructive' : ''}
              />
              {emailError && (
                <p className='text-sm text-destructive'>{emailError}</p>
              )}
            </div>

            <Button
              onClick={handleExport}
              disabled={!canExport}
              className='w-full'
            >
              {isExportingPending ? (
                <>
                  <Loader2 className='mr-2 size-4 animate-spin' />
                  Đang xuất...
                </>
              ) : (
                <>
                  <Download className='mr-2 size-4' />
                  Xuất thống kê
                </>
              )}
            </Button>

            <p className='text-xs text-muted-foreground'>
              Thống kê sẽ được gửi qua email trong vài phút
            </p>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
};

export default ExportStatisticsComp;
