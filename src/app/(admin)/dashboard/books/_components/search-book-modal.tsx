import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { searchBookSchema, type SearchBookFormValues } from '@/lib/zod';
import { BookSearchCriteria } from '@/types/book-types';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSearch: (criteria: Partial<BookSearchCriteria>) => void;
};

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
      endDate: '',
    },
  });

  const {
    formState: { errors },
    reset,
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
      price: values.price,
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
        <form onSubmit={form.handleSubmit(handleSearch)} className='space-y-4'>
          <div className='grid gap-4 py-4'>
            {/* Code field */}
            <div className='grid grid-cols-4 items-center gap-4'>
              <Label htmlFor='code' className='text-right'>
                Mã sách
              </Label>
              <div className='col-span-3'>
                <Input
                  id='code'
                  {...form.register('code')}
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
                  {...form.register('title')}
                  className={cn(errors.title && 'border-red-500')}
                />
                {errors.title && (
                  <span className='text-sm text-red-500'>
                    {errors.title.message}
                  </span>
                )}
              </div>
            </div>

            <div className='space-y-4'>
              {/* Start Date field */}
              <div className='grid grid-cols-4 items-center gap-4'>
                <Label className='text-right'>Ngày bắt đầu</Label>
                <div className='col-span-3'>
                  <Input
                    id='startDate'
                    type='date'
                    {...form.register('startDate')}
                    className={cn(errors.startDate && 'border-red-500')}
                  />
                  {errors.startDate && (
                    <span className='text-sm text-red-500'>
                      {errors.startDate.message}
                    </span>
                  )}
                </div>
              </div>

              {/* End Date field */}
              <div className='grid grid-cols-4 items-center gap-4'>
                <Label className='text-right'>Ngày kết thúc</Label>
                <div className='col-span-3'>
                  <Input
                    id='endDate'
                    type='date'
                    {...form.register('endDate')}
                    className={cn(errors.endDate && 'border-red-500')}
                  />
                  {errors.endDate && (
                    <span className='text-sm text-red-500'>
                      {errors.endDate.message}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Status field */}
            <div className='grid grid-cols-4 items-center gap-4'>
              <Label htmlFor='status' className='text-right'>
                Trạng thái
              </Label>
              <div className='col-span-3'>
                <Select
                  value={form.watch('status')}
                  onValueChange={(value) => form.setValue('status', value)}
                >
                  <SelectTrigger
                    className={cn(errors.status && 'border-red-500')}
                  >
                    <SelectValue placeholder='Chọn trạng thái' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='new'>Sách mới</SelectItem>
                    <SelectItem value='used'>Đã qua sử dụng</SelectItem>
                  </SelectContent>
                </Select>
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
                  {...form.register('languages')}
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
                  {...form.register('price', { valueAsNumber: true })}
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
