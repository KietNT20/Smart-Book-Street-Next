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
import { BookSearchCriteria } from '@/types/book-types';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { CalendarIcon } from 'lucide-react';
import { useState } from 'react';

interface SearchFormState {
  code?: string;
  title?: string;
  status?: string;
  languages?: string;
  priceFrom?: number | '';
  priceTo?: number | '';
  publicationDate?: Date | null;
}

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSearch: (criteria: Partial<BookSearchCriteria>) => void;
}

export function SearchBookModal({
  isOpen,
  onClose,
  onSearch,
}: SearchModalProps) {
  const [formState, setFormState] = useState<SearchFormState>({});

  const handleSearch = () => {
    // Convert form state to API criteria
    const searchCriteria: Partial<BookSearchCriteria> = {
      code: formState.code,
      title: formState.title,
      status: formState.status,
      languages: formState.languages,
      publicationDate: formState.publicationDate
        ? formState.publicationDate.toISOString()
        : undefined,
    };

    // Handle price range
    if (formState.priceFrom && formState.priceTo) {
      searchCriteria.price = Number(formState.priceFrom);
    } else if (formState.priceFrom) {
      searchCriteria.price = Number(formState.priceFrom);
    }

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
    setFormState({});
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Tìm kiếm nâng cao</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {/* Code field */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="code" className="text-right">
              Mã sách
            </Label>
            <Input
              id="code"
              value={formState.code || ''}
              onChange={(e) =>
                setFormState((prev) => ({ ...prev, code: e.target.value }))
              }
              className="col-span-3"
            />
          </div>

          {/* Title field */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="title" className="text-right">
              Tên sách
            </Label>
            <Input
              id="title"
              value={formState.title || ''}
              onChange={(e) =>
                setFormState((prev) => ({ ...prev, title: e.target.value }))
              }
              className="col-span-3"
            />
          </div>

          {/* Publication Date field */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Ngày xuất bản</Label>
            <div className="col-span-3">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      'w-full justify-start text-left font-normal',
                      !formState.publicationDate && 'text-muted-foreground'
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formState.publicationDate ? (
                      format(formState.publicationDate, 'PPP', { locale: vi })
                    ) : (
                      <span>Chọn ngày</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                  className="pointer-events-auto w-auto p-0"
                  align="start"
                >
                  <Calendar
                    mode="single"
                    selected={formState.publicationDate || undefined}
                    locale={vi}
                    onSelect={(date) =>
                      setFormState((prev) => ({
                        ...prev,
                        publicationDate: date
                          ? new Date(date.setHours(17, 0, 0, 0))
                          : null,
                      }))
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* Status field */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="status" className="text-right">
              Trạng thái
            </Label>
            <Select
              value={formState.status}
              onValueChange={(value) =>
                setFormState((prev) => ({ ...prev, status: value }))
              }
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Chọn trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="new">Sách mới</SelectItem>
                <SelectItem value="used">Đã qua sử dụng</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Languages field */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="languages" className="text-right">
              Ngôn ngữ
            </Label>
            <Select
              value={formState.languages}
              onValueChange={(value) =>
                setFormState((prev) => ({ ...prev, languages: value }))
              }
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Chọn ngôn ngữ" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="vi">Tiếng Việt</SelectItem>
                <SelectItem value="en">Tiếng Anh</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Price range fields */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Giá</Label>
            <div className="col-span-3 flex gap-2">
              <Input
                type="number"
                min={0}
                placeholder="Từ"
                value={formState.priceFrom ?? ''}
                onChange={(e) =>
                  setFormState((prev) => ({
                    ...prev,
                    priceFrom: e.target.value ? Number(e.target.value) : '',
                  }))
                }
              />
              <Input
                type="number"
                min={0}
                placeholder="Đến"
                value={formState.priceTo ?? ''}
                onChange={(e) =>
                  setFormState((prev) => ({
                    ...prev,
                    priceTo: e.target.value ? Number(e.target.value) : '',
                  }))
                }
              />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={handleReset}>
            Đặt lại
          </Button>
          <Button onClick={handleSearch}>Tìm kiếm</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
