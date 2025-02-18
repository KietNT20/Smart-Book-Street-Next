// components/date-input-custom.tsx
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { CalendarIcon } from 'lucide-react';
import { forwardRef } from 'react';

interface DateInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  containerClassName?: string;
}

const DateInput = forwardRef<HTMLInputElement, DateInputProps>(
  ({ className, containerClassName, ...props }, ref) => {
    return (
      <div className={cn('relative', containerClassName)}>
        <Input ref={ref} type='date' className={cn(className)} {...props} />
        <CalendarIcon className='pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground' />
      </div>
    );
  }
);
DateInput.displayName = 'DateInput';

export { DateInput };
