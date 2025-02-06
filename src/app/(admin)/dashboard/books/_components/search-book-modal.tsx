import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
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
import { endOfDay, format, startOfDay } from 'date-fns';
import { vi } from 'date-fns/locale';
import { CalendarIcon } from 'lucide-react';
import { useForm } from 'react-hook-form';

type SearchModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSearch: (criteria: Partial<BookSearchCriteria>) => void;
};

export function SearchBookModal({
  isOpen,
  onClose,
  onSearch,
}: SearchModalProps) {
  const form = useForm<SearchBookFormValues>({
    resolver: zodResolver(searchBookSchema),
    defaultValues: {
      code: '',
      title: '',
      status: '',
      languages: '',
      price: 0,
      startDate: undefined,
      endDate: undefined,
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
      startDate: values.startDate?.toISOString(),
      endDate: values.endDate?.toISOString(),
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
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Tìm kiếm nâng cao</DialogTitle>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(handleSearch)} className="space-y-4">
          <div className="grid gap-4 py-4">
            {/* Code field */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="code" className="text-right">
                Mã sách
              </Label>
              <div className="col-span-3">
                <Input
                  id="code"
                  {...form.register('code')}
                  className={cn(errors.code && 'border-red-500')}
                />
                {errors.code && (
                  <span className="text-sm text-red-500">
                    {errors.code.message}
                  </span>
                )}
              </div>
            </div>

            {/* Title field */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="title" className="text-right">
                Tên sách
              </Label>
              <div className="col-span-3">
                <Input
                  id="title"
                  {...form.register('title')}
                  className={cn(errors.title && 'border-red-500')}
                />
                {errors.title && (
                  <span className="text-sm text-red-500">
                    {errors.title.message}
                  </span>
                )}
              </div>
            </div>

            <div className="space-y-4">
              {/* Start Date field */}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Ngày bắt đầu</Label>
                <div className="col-span-3">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          'w-full justify-start text-left font-normal',
                          !form.watch('startDate') && 'text-muted-foreground',
                          errors.startDate && 'border-red-500'
                        )}
                        type="button"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {(() => {
                          const date = form.watch('startDate');
                          return date ? (
                            format(date, 'PPP', { locale: vi })
                          ) : (
                            <span>Chọn ngày</span>
                          );
                        })()}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent
                      className="pointer-events-auto w-auto p-0"
                      align="start"
                    >
                      <Calendar
                        mode="single"
                        locale={vi}
                        selected={form.watch('startDate')}
                        onSelect={(date) =>
                          form.setValue(
                            'startDate',
                            date ? startOfDay(date) : undefined
                          )
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  {errors.startDate && (
                    <span className="text-sm text-red-500">
                      {errors.startDate.message}
                    </span>
                  )}
                </div>
              </div>

              {/* End Date field */}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Ngày kết thúc</Label>
                <div className="col-span-3">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          'w-full justify-start text-left font-normal',
                          !form.watch('endDate') && 'text-muted-foreground',
                          errors.endDate && 'border-red-500'
                        )}
                        type="button"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {(() => {
                          const date = form.watch('endDate');
                          return date ? (
                            format(date, 'PPP', { locale: vi })
                          ) : (
                            <span>Chọn ngày</span>
                          );
                        })()}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent
                      className="pointer-events-auto w-auto p-0"
                      align="start"
                    >
                      <Calendar
                        mode="single"
                        locale={vi}
                        selected={form.watch('endDate')}
                        onSelect={(date) =>
                          form.setValue(
                            'endDate',
                            date ? endOfDay(date) : undefined
                          )
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  {errors.endDate && (
                    <span className="text-sm text-red-500">
                      {errors.endDate.message}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Status field */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="status" className="text-right">
                Trạng thái
              </Label>
              <div className="col-span-3">
                <Select
                  value={form.watch('status')}
                  onValueChange={(value) => form.setValue('status', value)}
                >
                  <SelectTrigger
                    className={cn(errors.status && 'border-red-500')}
                  >
                    <SelectValue placeholder="Chọn trạng thái" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="new">Sách mới</SelectItem>
                    <SelectItem value="used">Đã qua sử dụng</SelectItem>
                  </SelectContent>
                </Select>
                {errors.status && (
                  <span className="text-sm text-red-500">
                    {errors.status.message}
                  </span>
                )}
              </div>
            </div>

            {/* Languages field */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="languages" className="text-right">
                Ngôn ngữ
              </Label>
              <div className="col-span-3">
                <Select
                  value={form.watch('languages')}
                  onValueChange={(value) => form.setValue('languages', value)}
                >
                  <SelectTrigger
                    className={cn(errors.languages && 'border-red-500')}
                  >
                    <SelectValue placeholder="Chọn ngôn ngữ" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="vi">Tiếng Việt</SelectItem>
                    <SelectItem value="en">Tiếng Anh</SelectItem>
                  </SelectContent>
                </Select>
                {errors.languages && (
                  <span className="text-sm text-red-500">
                    {errors.languages.message}
                  </span>
                )}
              </div>
            </div>

            {/* Price field */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Giá</Label>
              <div className="col-span-3">
                <Input
                  type="number"
                  placeholder="Nhập giá"
                  {...form.register('price', { valueAsNumber: true })}
                  className={cn(errors.price && 'border-red-500')}
                />
                {errors.price && (
                  <span className="text-sm text-red-500">
                    {errors.price.message}
                  </span>
                )}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleReset}>
              Đặt lại
            </Button>
            <Button type="submit">Tìm kiếm</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
