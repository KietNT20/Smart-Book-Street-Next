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
import { Event } from '@/types/event-types';
import { FileSpreadsheet, Loader2, Mail } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

interface StatisticsExportButtonProps {
  eventId: string;
  eventData?: Event;
}

const StatisticsExportButton = ({
  eventId,
  eventData,
}: StatisticsExportButtonProps) => {
  const [exporting, setExporting] = useState<boolean>(false);
  const [showDialog, setShowDialog] = useState<boolean>(false);
  const [email, setEmail] = useState<string>('');
  const [error, setError] = useState<string>('');

  const isValidEmail = (email: string): boolean =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const sendStatistics = async (): Promise<void> => {
    if (!isValidEmail(email)) {
      setError('Vui lòng nhập email hợp lệ');
      return;
    }

    setError('');
    setShowDialog(false);
    setExporting(true);

    try {
      toast.promise(
        fetch(NextJS_API.EXPORT_STATISTICS, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            eventId,
            eventName: eventData?.eventName,
            statistics: {
              totalRegistrations: eventData?.totalRegistrations || 0,
              ageChart: eventData?.ageChart || [],
              genderChart: eventData?.genderChart || [],
              referenceChart: eventData?.referenceChart || [],
              addressChart: eventData?.addressChart || [],
            },
            organizerEmail: email,
            zoneInfo: eventData?.zone,
            dateRange: {
              startDate: eventData?.startDate,
              endDate: eventData?.endDate,
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
        }
      );
    } catch (error) {
      console.error('Export error:', error);
    } finally {
      setExporting(false);
    }
  };

  return (
    <>
      <Button
        variant='outline'
        className='flex items-center gap-2'
        onClick={() => setShowDialog(true)}
        disabled={exporting}
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
              Thống kê sự kiện sẽ được gửi đến email này
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
