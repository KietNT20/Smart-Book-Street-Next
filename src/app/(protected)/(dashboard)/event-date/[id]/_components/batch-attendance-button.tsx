'use client';

import { Button } from '@/components/ui/button';
import { useCheckAttendend } from '@/hooks/use-event-registrations';
import { UserSignEvent } from '../columns';

type BatchAttendanceProps = {
  data: UserSignEvent[];
};

const BatchAttendanceButton = ({ data }: BatchAttendanceProps) => {
  const { checkedAttendend, isCheckingPending } = useCheckAttendend();

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
        variant='darker'
        onClick={handleMarkAllPresent}
        disabled={isCheckingPending || data.length === 0}
        className='w-full md:w-auto'
      >
        Có mặt tất cả
      </Button>

      <Button
        variant='secondary'
        onClick={handleMarkAllAbsent}
        disabled={isCheckingPending || data.length === 0}
        className='w-full md:w-auto'
      >
        Vắng mặt tất cả
      </Button>
    </div>
  );
};

export default BatchAttendanceButton;
