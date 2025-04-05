import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { searchBookSchema, type SearchBookFormValues } from '@/lib/zod';
import { BookSearchCriteria } from '@/types/book-types';
import { zodResolver } from '@hookform/resolvers/zod';
import { DatePicker } from 'antd';
import dayjs from 'dayjs';
import { Controller, useForm } from 'react-hook-form';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSearch: (criteria: Partial<BookSearchCriteria>) => void;
};

const { RangePicker } = DatePicker;

export function SearchBookModal({ isOpen, onClose, onSearch }: Props) {
  const form = useForm<SearchBookFormValues>({
    resolver: zodResolver(searchBookSchema),
    defaultValues: {
      code: '',
      title: '',
      status: '',
      languages: '',
      price: 0,
      startDate: '',
      endDate: ''
    }
  });

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    reset
  } = form;

  const handleSearch = (values: SearchBookFormValues) => {
    const searchCriteria: Partial<BookSearchCriteria> = {
      code: values.code || undefined,
      title: values.title || undefined,
      status: values.status,
      languages: values.languages,
      startDate: values.startDate
        ? new Date(values.startDate).toISOString()
        : undefined,
      endDate: values.endDate
        ? new Date(values.endDate).toISOString()
        : undefined,
      price: values.price
    };

    // Remove empty values
    Object.keys(searchCriteria).forEach((key) => {
      if (
        searchCriteria[key as keyof BookSearchCriteria] === undefined ||
        searchCriteria[key as keyof BookSearchCriteria] === ''
      ) {
        delete searchCriteria[key as keyof BookSearchCriteria];
      }
    });

    onSearch(searchCriteria);
    onClose();
  };

  const handleReset = () => {
    reset();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='sm:max-w-[600px]'>
        <DialogHeader>
          <DialogTitle>Tìm kiếm nâng cao</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(handleSearch)} className='space-y-4'>
          <div className='grid gap-4 py-4'>
            {/* Code field */}
            <div className='grid grid-cols-4 items-center gap-4'>
              <Label htmlFor='code' className='text-right'>
                Mã sách
              </Label>
              <div className='col-span-3'>
                <Input
                  id='code'
                  {...register('code')}
                  className={cn(errors.code && 'border-red-500')}
                />
                {errors.code && (
                  <span className='text-sm text-red-500'>
                    {errors.code.message}
                  </span>
                )}
              </div>
            </div>

            {/* Title field */}
            <div className='grid grid-cols-4 items-center gap-4'>
              <Label htmlFor='title' className='text-right'>
                Tên sách
              </Label>
              <div className='col-span-3'>
                <Input
                  id='title'
                  {...register('title')}
                  className={cn(errors.title && 'border-red-500')}
                />
                {errors.title && (
                  <span className='text-sm text-red-500'>
                    {errors.title.message}
                  </span>
                )}
              </div>
            </div>

            {/* Date Range Picker */}
            <div className='grid grid-cols-4 items-center gap-4'>
              <Label className='text-right'>Thời gian</Label>
              <div className='col-span-3'>
                <Controller
                  control={control}
                  name='startDate'
                  render={() => (
                    <RangePicker
                      className='w-full px-3 py-2'
                      onChange={(dates, dateStrings) => {
                        if (dates) {
                          form.setValue('startDate', dateStrings[0]);
                          form.setValue('endDate', dateStrings[1]);
                        } else {
                          form.setValue('startDate', '');
                          form.setValue('endDate', '');
                        }
                      }}
                      value={[
                        form.getValues('startDate')
                          ? dayjs(form.getValues('startDate'))
                          : null,
                        form.getValues('endDate')
                          ? dayjs(form.getValues('endDate'))
                          : null
                      ]}
                    />
                  )}
                />
              </div>
            </div>

            {/* Status field */}
            <div className='grid grid-cols-4 items-center gap-4'>
              <Label htmlFor='status' className='text-right'>
                Trạng thái
              </Label>
              <div className='col-span-3'>
                <Input
                  id='status'
                  {...register('status')}
                  className={cn(errors.status && 'border-red-500')}
                />
                {errors.status && (
                  <span className='text-sm text-red-500'>
                    {errors.status.message}
                  </span>
                )}
              </div>
            </div>

            {/* Languages field */}
            <div className='grid grid-cols-4 items-center gap-4'>
              <Label htmlFor='languages' className='text-right'>
                Ngôn ngữ
              </Label>
              <div className='col-span-3'>
                <Input
                  id='languages'
                  {...register('languages')}
                  className={cn(errors.languages && 'border-red-500')}
                />
                {errors.languages && (
                  <span className='text-sm text-red-500'>
                    {errors.languages.message}
                  </span>
                )}
              </div>
            </div>

            {/* Price field */}
            <div className='grid grid-cols-4 items-center gap-4'>
              <Label className='text-right'>Giá</Label>
              <div className='col-span-3'>
                <Input
                  type='number'
                  placeholder='Nhập giá'
                  {...register('price', { valueAsNumber: true })}
                  className={cn(errors.price && 'border-red-500')}
                />
                {errors.price && (
                  <span className='text-sm text-red-500'>
                    {errors.price.message}
                  </span>
                )}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type='button' variant='outline' onClick={handleReset}>
              Đặt lại
            </Button>
            <Button type='submit'>Tìm kiếm</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
