'use client';

import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
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

  const handleToggleAttendance = (checked: boolean) => {
    setIsChecked(checked);

    checkedAttendend([
      {
        id: user.id,
        ticketCode: null,
        isAttended: checked,
      },
    ]);
  };

  return (
    <div className='flex items-center space-x-2'>
      <Checkbox
        id={`checkbox-${user.id}`}
        checked={isChecked}
        onCheckedChange={(checked) =>
          handleToggleAttendance(checked as boolean)
        }
        disabled={isCheckingPending}
      />
      <Label
        htmlFor={`checkbox-${user.id}`}
        className='cursor-pointer text-sm font-medium'
      >
        {isChecked ? 'Có' : 'Vắng'}
      </Label>

      {isCheckingPending && <Loader2 className='ml-2 size-4 animate-spin' />}
    </div>
  );
};

export default CheckedInput;
