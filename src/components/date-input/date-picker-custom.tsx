'use client';

import { format, getMonth, getYear, setMonth, setYear } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import * as React from 'react';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { vi } from 'date-fns/locale';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';

type DatePickerProps = {
  startYear?: number;
  endYear?: number;
  value?: Date;
  onChange?: (date: Date) => void;
};

export function DatePickerCompVN({
  startYear = getYear(new Date()) - 100,
  endYear = getYear(new Date()) + 100,
  value,
  onChange,
}: DatePickerProps) {
  const [date, setDate] = React.useState<Date | undefined>(value);
  const [calendarMonth, setCalendarMonth] = React.useState<Date>(
    value || new Date()
  );

  React.useEffect(() => {
    setDate(value);
    if (value) {
      setCalendarMonth(value);
    }
  }, [value]);

  const months = [
    'Tháng Một',
    'Tháng Hai',
    'Tháng Ba',
    'Tháng Tư',
    'Tháng Năm',
    'Tháng Sáu',
    'Tháng Bảy',
    'Tháng Tám',
    'Tháng Chín',
    'Tháng Mười',
    'Tháng Mười Một',
    'Tháng Mười Hai',
  ];

  const years = Array.from({ length: endYear - startYear + 1 }, (_, i) => {
    return startYear + i;
  });

  const handleMonthChange = (month: string) => {
    const newDate = setMonth(calendarMonth, months.indexOf(month));
    setCalendarMonth(newDate);
    if (date) {
      const updatedDate = setMonth(date, months.indexOf(month));
      setDate(updatedDate);
      onChange?.(updatedDate);
    }
  };

  const handleYearChange = (year: string) => {
    const newDate = setYear(calendarMonth, parseInt(year));
    setCalendarMonth(newDate);
    if (date) {
      const updatedDate = setYear(date, parseInt(year));
      setDate(updatedDate);
      onChange?.(updatedDate);
    }
  };

  const handleSelect = (selectedDate: Date | undefined) => {
    if (selectedDate) {
      setDate(selectedDate);
      setCalendarMonth(selectedDate);
      onChange?.(selectedDate);
    }
  };

  const formatDate = (date: Date | undefined) => {
    if (!date) return 'Chọn ngày';
    try {
      return format(date, 'dd MMMM yyyy', { locale: vi });
    } catch (error) {
      console.error('Invalid date:', error);
      return 'Chọn ngày';
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={'outline'}
          className={cn(
            'w-[280px] justify-start text-left font-normal',
            !date && 'text-muted-foreground'
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {formatDate(date)}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="pointer-events-auto w-auto p-0" align="start">
        <div className="flex p-2">
          <div className="m-1 w-full">
            <Select
              onValueChange={handleMonthChange}
              value={months[getMonth(calendarMonth)]}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Chọn tháng" />
              </SelectTrigger>
              <SelectContent>
                {months.map((month) => (
                  <SelectItem key={month} value={month}>
                    {month}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="m-1 w-full">
            <Select
              onValueChange={handleYearChange}
              value={getYear(calendarMonth).toString()}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Chọn năm" />
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
        <Calendar
          mode="single"
          selected={date}
          onSelect={handleSelect}
          initialFocus
          locale={vi}
          month={calendarMonth}
          onMonthChange={setCalendarMonth}
          className="rounded-md border"
        />
      </PopoverContent>
    </Popover>
  );
}
