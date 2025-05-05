'use client';

import { Button } from '@/components/ui/button';
import { useCheckAttendend } from '@/hooks/use-event-registrations';
import { Loader2 } from 'lucide-react';
import { UserSignEvent } from '../columns';

type BatchAttendanceProps = {
  data: UserSignEvent[];
};

const BatchAttendanceButton = ({ data }: BatchAttendanceProps) => {
  const { checkedAttendend, isCheckingPending } = useCheckAttendend();

  const handleAttendanceAll = () => {
    const attendanceData = data.map((user) => ({
      id: user.id,
      ticketCode: null,
      isAttended: user.isAttended,
    }));

    checkedAttendend(attendanceData);
  };

  const handleMarkAllPresent = () => {
    const attendanceData = data.map((user) => ({
      id: user.id,
      ticketCode: null,
      isAttended: true,
    }));

    checkedAttendend(attendanceData);
  };

  const handleMarkAllAbsent = () => {
    const attendanceData = data.map((user) => ({
      id: user.id,
      ticketCode: null,
      isAttended: false,
    }));

    checkedAttendend(attendanceData);
  };

  return (
    <div className='flex items-center space-x-4 py-4'>
      <Button
        onClick={handleAttendanceAll}
        disabled={isCheckingPending || data.length === 0}
      >
        {isCheckingPending ? (
          <>
            <Loader2 className='ml-2 size-4 animate-spin' />
            Đang điểm danh...
          </>
        ) : (
          'Cập nhật điểm danh'
        )}
      </Button>

      <Button
        variant='outline'
        onClick={handleMarkAllPresent}
        disabled={isCheckingPending || data.length === 0}
      >
        Có mặt tất cả
      </Button>

      <Button
        variant='outline'
        onClick={handleMarkAllAbsent}
        disabled={isCheckingPending || data.length === 0}
      >
        Vắng mặt tất cả
      </Button>
    </div>
  );
};

export default BatchAttendanceButton;
