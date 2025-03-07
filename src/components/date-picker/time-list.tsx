import { format } from 'date-fns';
import { Button } from '../ui/button';
import { ScrollArea } from '../ui/scroll-area';

type TimeOption = {
  display: string;
  hours: number;
  minutes: number;
};

const TimeList = ({
  timeOptions,
  selectedTime,
  onTimeSelect,
  isMounted,
  formatPattern
}: {
  timeOptions: TimeOption[];
  selectedTime: Date;
  onTimeSelect: (option: TimeOption) => void;
  isMounted: boolean;
  formatPattern: string;
}) => (
  <ScrollArea className='h-72'>
    <div className='flex flex-col gap-1'>
      {timeOptions.map((option) => (
        <Button
          key={option.display}
          variant={
            isMounted && format(selectedTime, formatPattern) === option.display
              ? 'default'
              : 'outline'
          }
          size='sm'
          onClick={() => onTimeSelect(option)}
          className='justify-center'
        >
          {option.display}
        </Button>
      ))}
    </div>
  </ScrollArea>
);

export default TimeList;
