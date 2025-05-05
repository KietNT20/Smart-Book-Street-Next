'use client';

import { useCheckAttendend } from '@/hooks/use-event-registrations';
import { Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';

type UserSignEvent = {
  id: string;
  registrantName: string;
  registrantEmail: string;
  registrantPhoneNumber: string;
  isAttended: boolean;
};

type Props = {
  user: UserSignEvent;
};

const CheckedInput = ({ user }: Props) => {
  const { checkedAttendend, isCheckingPending } = useCheckAttendend();
  const [isChecked, setIsChecked] = useState(user.isAttended);

  useEffect(() => {
    setIsChecked(user.isAttended);
  }, [user.isAttended]);

  // This function is called when the checkbox is clicked
  const handleToggleAttendance = () => {
    const newStatus = !isChecked;
    setIsChecked(newStatus);

    // Update the attendance status on the server
    checkedAttendend([
      {
        id: user.id,
        ticketCode: null,
        isAttended: newStatus,
      },
    ]);
  };

  return (
    <div className='flex items-center space-x-2'>
      <div
        className={`h-4 w-4 rounded border ${
          isChecked ? 'bg-primary' : 'bg-transparent'
        } cursor-pointer border-primary ${isCheckingPending ? 'opacity-50' : ''}`}
        onClick={isCheckingPending ? undefined : handleToggleAttendance}
      >
        {isChecked && (
          <svg
            xmlns='http://www.w3.org/2000/svg'
            viewBox='0 0 24 24'
            fill='none'
            stroke='currentColor'
            strokeWidth='2'
            strokeLinecap='round'
            strokeLinejoin='round'
            className='h-4 w-4 text-white'
          >
            <polyline points='20 6 9 17 4 12' />
          </svg>
        )}
      </div>
      <span
        className={`cursor-pointer text-sm font-medium text-primary-foreground ${isCheckingPending ? 'opacity-50' : ''}`}
        onClick={isCheckingPending ? undefined : handleToggleAttendance}
      >
        {isChecked ? 'Có' : 'Vắng'}
      </span>

      {isCheckingPending && <Loader2 className='ml-2 size-4 animate-spin' />}
    </div>
  );
};

export default CheckedInput;
