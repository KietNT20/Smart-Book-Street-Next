import { useCheckAttendend } from '@/hooks/use-event-registrations';
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

  // Handle checkbox change
  const handleCheckboxChange = () => {
    // Toggle the checked state
    const newAttendanceStatus = !isChecked;

    // Call the attendance checking function with id and new status
    checkedAttendend({
      id: user.id,
      isAttended: newAttendanceStatus,
    });

    // Update local state
    setIsChecked(newAttendanceStatus);
  };

  // Update local state if the prop changes
  useEffect(() => {
    setIsChecked(user.isAttended);
  }, [user.isAttended]);

  return (
    <div className='flex items-center space-x-2'>
      <input
        type='checkbox'
        id={`attendance-${user.id}`}
        checked={isChecked}
        onChange={handleCheckboxChange}
        disabled={isCheckingPending}
        className='h-4 w-4 rounded border text-primary focus:ring-ring'
      />
      <label
        htmlFor={`attendance-${user.id}`}
        className='cursor-pointer text-sm font-medium text-primary-foreground'
      >
        {isChecked ? 'Có' : 'Vắng'}
      </label>

      {isCheckingPending && (
        <div className='ml-2'>
          <div className='h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent'></div>
        </div>
      )}
    </div>
  );
};

export default CheckedInput;
