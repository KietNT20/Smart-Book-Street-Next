'use client';

import {
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { cn } from '@/lib/utils';
import { BookFormValues } from '@/lib/zod';
import { DatePicker, Radio, Space } from 'antd';
import dayjs from 'dayjs';
import { useState } from 'react';
import { Control, Controller } from 'react-hook-form';

type DateFormat = 'year' | 'month' | 'date';

interface Props {
  control: Control<BookFormValues>;
  disabled?: boolean;
}

const BookPublicationDate = ({ control, disabled = false }: Props) => {
  const [dateFormat, setDateFormat] = useState<DateFormat>('date');

  return (
    <Controller
      control={control}
      name='publicationDate'
      render={({ field, fieldState }) => {
        const dateValue = field.value ? dayjs(field.value) : null;

        const handleDateChange = (date: dayjs.Dayjs | null) => {
          if (!date) {
            field.onChange(null);
            return;
          }

          let formattedDate;
          switch (dateFormat) {
            case 'year':
              formattedDate = date.format('YYYY');
              break;
            case 'month':
              formattedDate = date.format('YYYY-MM');
              break;
            case 'date':
            default:
              formattedDate = date.format('YYYY-MM-DD');
          }

          field.onChange(formattedDate);
        };

        // Set picker options based on format
        const getPickerProps = () => {
          switch (dateFormat) {
            case 'year':
              return { picker: 'year' as const };
            case 'month':
              return { picker: 'month' as const };
            case 'date':
            default:
              return {};
          }
        };

        return (
          <FormItem>
            <FormLabel>
              Ngày xuất bản <span className='text-red-400'>*</span>
            </FormLabel>
            <div className='space-y-2'>
              <Radio.Group
                value={dateFormat}
                onChange={(e) => setDateFormat(e.target.value)}
                className='mb-2'
                disabled={disabled}
              >
                <Space>
                  <Radio.Button value='date'>Ngày/Tháng/Năm</Radio.Button>
                  <Radio.Button value='month'>Tháng/Năm</Radio.Button>
                  <Radio.Button value='year'>Năm</Radio.Button>
                </Space>
              </Radio.Group>

              <FormControl>
                <DatePicker
                  {...getPickerProps()}
                  format={
                    dateFormat === 'year'
                      ? 'YYYY'
                      : dateFormat === 'month'
                        ? 'YYYY-MM'
                        : 'YYYY-MM-DD'
                  }
                  value={dateValue}
                  onChange={handleDateChange}
                  placeholder={
                    dateFormat === 'year'
                      ? 'Chọn năm xuất bản'
                      : dateFormat === 'month'
                        ? 'Chọn tháng/năm xuất bản'
                        : 'Chọn ngày xuất bản'
                  }
                  className={cn(
                    'h-10 w-full px-3 py-2',
                    fieldState.error && 'border-red-500'
                  )}
                  onBlur={field.onBlur}
                  disabled={disabled}
                />
              </FormControl>
            </div>
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
};

export default BookPublicationDate;
