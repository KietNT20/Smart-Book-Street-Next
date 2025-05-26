'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { NextJS_API } from '@/enums/endpoint';
import { EventRegistrationStatistic } from '@/types/event-registrations-types';
import { Event } from '@/types/event-types';
import { useQuery } from '@tanstack/react-query';
import { FileSpreadsheet, Loader2, Mail } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { z } from 'zod';

export interface EventDetailResponse {
  event: Event;
  registrationStats: EventRegistrationStatistic;
}

export interface EventDetailError {
  error: string;
}

const emailSchema = z.object({
  email: z
    .string()
    .email('Email không hợp lệ')
    .min(1, 'Email không được để trống'),
});

type Props = {
  eventId: string;
  defaultEmail?: string;
};

const StatisticsExportButton = ({ eventId, defaultEmail = '' }: Props) => {
  const [exporting, setExporting] = useState<boolean>(false);
  const [showDialog, setShowDialog] = useState<boolean>(false);
  const [email, setEmail] = useState<string>(defaultEmail);
  const [emailError, setEmailError] = useState<string>('');

  const {
    data: eventDetail,
    isLoading,
    isError,
  } = useQuery<EventDetailResponse>({
    queryKey: ['event-report-detail', eventId],
    queryFn: async () => {
      const response = await fetch(`/api/event-report/${eventId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch event details');
      }
      return response.json();
    },
    enabled: !!eventId,
  });

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

    if (newEmail.trim()) {
      validateEmail(newEmail);
    } else {
      setEmailError('');
    }
  };

  const handleDialogChange = (open: boolean) => {
    setShowDialog(open);
    if (open) {
      setEmail(defaultEmail);
      setEmailError('');
    }
  };

  const sendStatistics = async (): Promise<void> => {
    if (!validateEmail(email)) {
      return;
    }

    if (!eventDetail) {
      toast.error('Không thể lấy thông tin sự kiện');
      return;
    }

    setShowDialog(false);
    setExporting(true);

    toast.promise(
      fetch(NextJS_API.EXPORT_STATISTICS, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          eventId,
          eventName: eventDetail.event.eventName,
          description: eventDetail.event.description,
          statistics: {
            success: eventDetail.registrationStats.success,
            totalRegistrations:
              eventDetail.registrationStats.totalRegistrations || 0,
            ageChart: eventDetail.registrationStats.ageChart || [],
            genderChart: eventDetail.registrationStats.genderChart || [],
            referenceChart: eventDetail.registrationStats.referenceChart || [],
            addressChart: eventDetail.registrationStats.addressChart || [],
            attendedBeforeChart:
              eventDetail.registrationStats.attendedBeforeChart || [],
            participation: eventDetail.registrationStats.participation || 0,
            participationRate:
              eventDetail.registrationStats.participationRate || '0%',
            attendedChart: eventDetail.registrationStats.attendedChart || [],
          },
          organizerEmail: email.trim(),
          zoneInfo: eventDetail.event.zone,
          dateRange: {
            startDate: eventDetail.event.startDate,
            endDate: eventDetail.event.endDate,
          },
          emailSubject: `Thống kê sự kiện: ${eventDetail.event.eventName}`,
          emailMessage: `Xin chào,\n\nĐây là báo cáo thống kê chi tiết cho sự kiện "${eventDetail.event.eventName}".`,
          customOptions: {
            includeGeneral: true,
            includeAge: true,
            includeGender: true,
            includeReference: true,
            includeAddress: true,
          },
        }),
      }).then((res) => {
        if (!res.ok) throw new Error('Có lỗi xảy ra khi xuất thống kê');
        return res.json();
      }),
      {
        loading: 'Đang xuất Excel và gửi email...',
        success: () => `Đã gửi thống kê qua email ${email.trim()} thành công!`,
        error: 'Không thể xuất thống kê. Vui lòng thử lại sau.',
        finally: () => setExporting(false),
      }
    );
  };

  if (isLoading) {
    return (
      <Button variant='outline' className='flex items-center gap-2' disabled>
        <Loader2 className='size-4 animate-spin' />
        Đang tải...
      </Button>
    );
  }

  if (isError || !eventDetail) {
    return (
      <Button variant='outline' className='flex items-center gap-2' disabled>
        <FileSpreadsheet className='size-4' />
        Không thể tải dữ liệu
      </Button>
    );
  }

  const hasRegistrations = eventDetail.registrationStats.totalRegistrations > 0;
  const canSend = email.trim() && !emailError && !exporting;

  return (
    <>
      <Button
        variant='outline'
        className='flex items-center gap-2'
        onClick={() => handleDialogChange(true)}
        disabled={exporting || !hasRegistrations}
        title={!hasRegistrations ? 'Chưa có đăng ký nào' : undefined}
      >
        {exporting ? (
          <Loader2 className='size-4 animate-spin' />
        ) : (
          <>
            <FileSpreadsheet className='size-4' />
            <Mail className='ml-1 size-4' />
          </>
        )}
        {exporting ? 'Đang xử lý...' : 'Xuất & Gửi Thống Kê'}
      </Button>

      <Dialog open={showDialog} onOpenChange={handleDialogChange}>
        <DialogContent className='sm:max-w-[425px]'>
          <DialogHeader>
            <DialogTitle>Nhập email nhận thống kê</DialogTitle>
            <DialogDescription>
              Thống kê sự kiện &quot;{eventDetail.event.eventName}&quot; sẽ được
              gửi đến email này
            </DialogDescription>
          </DialogHeader>

          <div className='py-4'>
            <div className='grid items-center gap-2'>
              <Label htmlFor='email' className='flex items-center gap-2'>
                <Mail className='size-4' />
                Email nhận thống kê
              </Label>
              <Input
                id='email'
                type='email'
                placeholder='Nhập email để nhận thống kê'
                value={email}
                onChange={handleEmailChange}
                autoComplete='off'
                className={emailError ? 'border-destructive' : ''}
              />
              {emailError && (
                <p className='text-sm text-destructive'>{emailError}</p>
              )}
              {defaultEmail && (
                <p className='text-xs text-muted-foreground'>
                  Email mặc định: {defaultEmail}
                </p>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button variant='outline' onClick={() => handleDialogChange(false)}>
              Hủy
            </Button>
            <Button onClick={sendStatistics} disabled={!canSend}>
              Gửi thống kê
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default StatisticsExportButton;
