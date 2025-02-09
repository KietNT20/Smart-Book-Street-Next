import { Check, ChevronsUpDown } from 'lucide-react';
import * as React from 'react';
import { useFormContext } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { useGetAllAuthors } from '@/hooks/use-author';
import useDebounce from '@/hooks/useDebounce';
import { cn } from '@/lib/utils';
import { Author } from '@/types/author-types';

type AuthorComboboxProps = {
  name: string;
  label?: string;
};

export function AuthorCombobox({
  name,
  label = 'Tác giả',
}: AuthorComboboxProps) {
  const [open, setOpen] = React.useState(false);
  const [inputValue, setInputValue] = React.useState<string>('');
  const debouncedInput = useDebounce<string>(inputValue, 300);

  const form = useFormContext();
  const { data: resAllAuthors, isLoading, error } = useGetAllAuthors();
  const authors: Author[] = resAllAuthors?.results;

  const filteredAuthors = React.useMemo(() => {
    if (!authors) return [];

    const search = debouncedInput?.toLowerCase() || '';
    return authors.filter((author: Author) =>
      author?.authorName?.toLowerCase()?.includes(search)
    );
  }, [authors, debouncedInput]);

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>
            {label} <span className="text-red-400">*</span>
          </FormLabel>
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  variant="outline"
                  role="combobox"
                  disabled={isLoading}
                  className={cn(
                    'w-full justify-between',
                    !field.value && 'text-muted-foreground'
                  )}
                >
                  {isLoading
                    ? 'Đang tải...'
                    : field.value
                      ? authors?.find((author) => author.id === field.value)
                          ?.authorName
                      : 'Chọn Tác giả'}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent
              className="pointer-events-auto w-[400px] p-0"
              align="start"
            >
              <Command shouldFilter={false}>
                <CommandInput
                  placeholder="Tìm theo tên tác giả..."
                  value={inputValue}
                  onValueChange={setInputValue}
                />
                <CommandList>
                  {error ? (
                    <CommandEmpty>Có lỗi xảy ra khi tải dữ liệu</CommandEmpty>
                  ) : filteredAuthors?.length === 0 ? (
                    <CommandEmpty>Không tìm thấy tác giả</CommandEmpty>
                  ) : (
                    <CommandGroup className="max-h-[300px] overflow-y-auto">
                      {filteredAuthors?.map((author: Author) => (
                        <CommandItem
                          key={author.id}
                          value={author.id}
                          onSelect={(currentValue) => {
                            field.onChange(
                              currentValue === field.value ? '' : currentValue
                            );
                            setOpen(false);
                          }}
                        >
                          <Check
                            className={cn(
                              'mr-2 h-4 w-4',
                              field.value === author.id
                                ? 'opacity-100'
                                : 'opacity-0'
                            )}
                          />
                          <p>{author.authorName}</p>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  )}
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
