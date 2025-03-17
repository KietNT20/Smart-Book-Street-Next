import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { Calendar as CalendarIcon } from 'lucide-react';
import * as React from 'react';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { cn } from '@/lib/utils';

interface DatePickerProps {
  date: Date | undefined;
  setDate: (date: Date | undefined) => void;
  className?: string;
  placeholder?: string;
}

export function DatePickerV1({
  date,
  setDate,
  className,
  placeholder = 'Chọn ngày'
}: DatePickerProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [month, setMonth] = React.useState<number>(
    date ? date.getMonth() : new Date().getMonth()
  );
  const [year, setYear] = React.useState<number>(
    date ? date.getFullYear() : new Date().getFullYear()
  );

  // Tạo các mảng tháng và năm để hiển thị trong select
  const months = [
    { value: 0, label: 'Tháng 1' },
    { value: 1, label: 'Tháng 2' },
    { value: 2, label: 'Tháng 3' },
    { value: 3, label: 'Tháng 4' },
    { value: 4, label: 'Tháng 5' },
    { value: 5, label: 'Tháng 6' },
    { value: 6, label: 'Tháng 7' },
    { value: 7, label: 'Tháng 8' },
    { value: 8, label: 'Tháng 9' },
    { value: 9, label: 'Tháng 10' },
    { value: 10, label: 'Tháng 11' },
    { value: 11, label: 'Tháng 12' }
  ];

  // Tạo mảng năm từ năm hiện tại đến 10 năm trước và 10 năm sau
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 21 }, (_, i) => currentYear - 10 + i);

  // Xử lý khi chọn tháng
  const handleMonthChange = (value: string) => {
    setMonth(parseInt(value));
  };

  // Xử lý khi chọn năm
  const handleYearChange = (value: string) => {
    setYear(parseInt(value));
  };

  // Cập nhật tháng và năm khi date thay đổi từ bên ngoài
  React.useEffect(() => {
    if (date) {
      setMonth(date.getMonth());
      setYear(date.getFullYear());
    }
  }, [date]);

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant='outline'
          className={cn(
            'w-full justify-start text-left font-normal',
            !date && 'text-muted-foreground',
            className
          )}
        >
          <CalendarIcon className='mr-2 h-4 w-4' />
          {date ? (
            format(date, 'PPP', { locale: vi })
          ) : (
            <span>{placeholder}</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-auto p-0' align='start'>
        <div className='flex items-center justify-between space-x-2 p-3'>
          <Select value={month.toString()} onValueChange={handleMonthChange}>
            <SelectTrigger className='w-[130px]'>
              <SelectValue placeholder='Chọn tháng' />
            </SelectTrigger>
            <SelectContent>
              {months.map((m) => (
                <SelectItem key={m.value} value={m.value.toString()}>
                  {m.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={year.toString()} onValueChange={handleYearChange}>
            <SelectTrigger className='w-[100px]'>
              <SelectValue placeholder='Chọn năm' />
            </SelectTrigger>
            <SelectContent>
              {years.map((y) => (
                <SelectItem key={y} value={y.toString()}>
                  {y}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Calendar
          mode='single'
          selected={date}
          onSelect={(day) => {
            setDate(day);
            setIsOpen(false);
          }}
          month={new Date(year, month)}
          onMonthChange={(date) => {
            setMonth(date.getMonth());
            setYear(date.getFullYear());
          }}
          locale={vi}
          className='border-t'
        />
      </PopoverContent>
    </Popover>
  );
}
