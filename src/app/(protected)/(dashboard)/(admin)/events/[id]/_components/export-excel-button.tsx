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

export interface EventDetailResponse {
  event: Event;
  registrationStats: EventRegistrationStatistic;
}

export interface EventDetailError {
  error: string;
}

type Props = {
  eventId: string;
};

const StatisticsExportButton = ({ eventId }: Props) => {
  const [exporting, setExporting] = useState<boolean>(false);
  const [showDialog, setShowDialog] = useState<boolean>(false);
  const [email, setEmail] = useState<string>('');
  const [error, setError] = useState<string>('');

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

  const isValidEmail = (email: string): boolean =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const sendStatistics = async (): Promise<void> => {
    if (!isValidEmail(email)) {
      setError('Vui lòng nhập email hợp lệ');
      return;
    }

    if (!eventDetail) {
      toast.error('Không thể lấy thông tin sự kiện');
      return;
    }

    setError('');
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
          organizerEmail: email,
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
        success: () => `Đã gửi thống kê qua email ${email} thành công!`,
        error: 'Không thể xuất thống kê. Vui lòng thử lại sau.',
        finally: () => setExporting(false),
      }
    );
  };

  // Show loading state while fetching data
  if (isLoading) {
    return (
      <Button variant='outline' className='flex items-center gap-2' disabled>
        <Loader2 className='h-4 w-4 animate-spin' />
        Đang tải...
      </Button>
    );
  }

  // Show error state if failed to fetch
  if (isError || !eventDetail) {
    return (
      <Button variant='outline' className='flex items-center gap-2' disabled>
        <FileSpreadsheet className='h-4 w-4' />
        Không thể tải dữ liệu
      </Button>
    );
  }

  // Disable button if no registrations
  const hasRegistrations = eventDetail.registrationStats.totalRegistrations > 0;

  return (
    <>
      <Button
        variant='outline'
        className='flex items-center gap-2'
        onClick={() => setShowDialog(true)}
        disabled={exporting || !hasRegistrations}
        title={!hasRegistrations ? 'Chưa có đăng ký nào' : undefined}
      >
        {exporting ? (
          <Loader2 className='h-4 w-4 animate-spin' />
        ) : (
          <>
            <FileSpreadsheet className='h-4 w-4' />
            <Mail className='ml-1 h-4 w-4' />
          </>
        )}
        {exporting ? 'Đang xử lý...' : 'Xuất & Gửi Thống Kê'}
      </Button>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
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
              <Label htmlFor='email'>Email</Label>
              <Input
                id='email'
                type='email'
                placeholder='email@example.com'
                value={email}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setEmail(e.target.value);
                  setError('');
                }}
                autoComplete='off'
              />
              {error && <p className='text-sm text-red-500'>{error}</p>}
            </div>
          </div>

          <DialogFooter>
            <Button variant='outline' onClick={() => setShowDialog(false)}>
              Hủy
            </Button>
            <Button onClick={sendStatistics}>Gửi thống kê</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default StatisticsExportButton;
