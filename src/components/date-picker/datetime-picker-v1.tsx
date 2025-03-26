import { format, setHours, setMinutes, setMonth, setYear } from 'date-fns';
import { vi } from 'date-fns/locale';
import { Calendar as CalendarIcon, Clock } from 'lucide-react';
import { useState } from 'react';

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
import { hours, minutes, months, years } from './date-picker-utils';

interface DateTimePickerProps {
  value: Date;
  onChange: (date: Date) => void;
  className?: string;
}

export function DateTimePickerV1({
  value,
  onChange,
  className
}: DateTimePickerProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(value);

  // Xử lý khi chọn ngày
  const handleSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    if (date) {
      const newDate = new Date(value);
      newDate.setFullYear(date.getFullYear());
      newDate.setMonth(date.getMonth());
      newDate.setDate(date.getDate());
      onChange(newDate);
    }
  };

  const handleMonthChange = (monthIndex: string) => {
    const newDate = setMonth(value, parseInt(monthIndex));
    onChange(newDate);
  };

  const handleYearChange = (year: string) => {
    const newDate = setYear(value, parseInt(year));
    onChange(newDate);
  };

  const handleHourChange = (hour: string) => {
    const newDate = setHours(value, parseInt(hour));
    onChange(newDate);
  };

  const handleMinuteChange = (minute: string) => {
    const newDate = setMinutes(value, parseInt(minute));
    onChange(newDate);
  };

  return (
    <div className={cn('grid gap-2', className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id='date'
            variant={'outline'}
            className={cn(
              'w-full justify-start text-left font-normal',
              !value && 'text-muted-foreground'
            )}
          >
            <CalendarIcon className='mr-2 h-4 w-4' />
            {value ? (
              format(value, 'PPP p', { locale: vi })
            ) : (
              <span>Chọn ngày và giờ</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className='w-auto p-0' align='start'>
          <div className='flex justify-between border-b border-border p-3'>
            <div className='flex items-center space-x-2'>
              <Select
                value={value.getMonth().toString()}
                onValueChange={handleMonthChange}
              >
                <SelectTrigger className='w-[110px]'>
                  <SelectValue placeholder='Tháng' />
                </SelectTrigger>
                <SelectContent>
                  {months.map((month) => (
                    <SelectItem
                      key={month.value}
                      value={month.value.toString()}
                    >
                      {month.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                value={value.getFullYear().toString()}
                onValueChange={handleYearChange}
              >
                <SelectTrigger className='w-[90px]'>
                  <SelectValue placeholder='Năm' />
                </SelectTrigger>
                <SelectContent>
                  {years.map((year) => (
                    <SelectItem key={year} value={year.toString()}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className='flex'>
            <div>
              <Calendar
                mode='single'
                selected={selectedDate}
                onSelect={handleSelect}
                initialFocus
              />
            </div>

            <div className='flex min-w-[180px] flex-col justify-center border-l border-border p-2'>
              <div className='mb-1 flex items-center justify-center'>
                <Clock className='mr-2 h-4 w-4 text-muted-foreground' />
                <span className='text-sm font-medium'>Thời gian</span>
              </div>

              <div className='space-y-4'>
                <div className='space-y-2'>
                  <p className='text-center text-sm font-medium'>Giờ</p>
                  <Select
                    value={value.getHours().toString()}
                    onValueChange={handleHourChange}
                  >
                    <SelectTrigger className='w-full'>
                      <SelectValue placeholder='Giờ' />
                    </SelectTrigger>
                    <SelectContent>
                      {hours.map((hour) => (
                        <SelectItem key={hour} value={hour.toString()}>
                          {hour.toString().padStart(2, '0')}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className='space-y-2'>
                  <p className='text-center text-sm font-medium'>Phút</p>
                  <Select
                    value={(Math.floor(value.getMinutes() / 5) * 5).toString()}
                    onValueChange={handleMinuteChange}
                  >
                    <SelectTrigger className='w-full'>
                      <SelectValue placeholder='Phút' />
                    </SelectTrigger>
                    <SelectContent>
                      {minutes.map((minute) => (
                        <SelectItem key={minute} value={minute.toString()}>
                          {minute.toString().padStart(2, '0')}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className='mt-4 border-t border-border pt-4'>
                  <p className='mb-2 text-center text-sm font-medium'>
                    Hiện tại
                  </p>
                  <Button
                    className='w-full'
                    onClick={() => onChange(new Date())}
                  >
                    Đặt thời gian hiện tại
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
