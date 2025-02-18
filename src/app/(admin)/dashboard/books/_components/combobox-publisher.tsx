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
import { usePublisherQuery } from '@/hooks/use-publisher';
import useDebounce from '@/hooks/useDebounce';
import { cn } from '@/lib/utils';
import { Publisher } from '@/types/publisher-types';

type Props = {
  name: string;
  label?: string;
};

export function PublisherCombobox({ name, label = 'Nhà xuất bản' }: Props) {
  const [open, setOpen] = React.useState(false);
  const [inputValue, setInputValue] = React.useState<string>('');
  const debouncedInput = useDebounce<string>(inputValue, 300);

  const form = useFormContext();
  const { getAllPublishers } = usePublisherQuery();
  const { data: resAllPublishers, isLoading, error } = getAllPublishers;
  const publishers: Publisher[] = resAllPublishers?.results;

  const filteredPublishers = React.useMemo(() => {
    const search = debouncedInput.toLowerCase();
    return publishers?.filter(
      (publisher: Publisher) =>
        publisher.publisherName.toLowerCase()?.includes(search) ||
        (publisher.email && publisher.email.toLowerCase().includes(search))
    );
  }, [publishers, debouncedInput]);

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>
            {label} <span className='text-red-400'>*</span>
          </FormLabel>
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  variant='outline'
                  role='combobox'
                  disabled={isLoading}
                  className={cn(
                    'w-full justify-between',
                    !field.value && 'text-muted-foreground'
                  )}
                >
                  {isLoading
                    ? 'Đang tải...'
                    : field.value
                      ? publishers?.find(
                          (publisher) => publisher.id === field.value
                        )?.publisherName
                      : 'Chọn nhà xuất bản'}
                  <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent
              className='pointer-events-auto w-[400px] p-0'
              align='start'
            >
              <Command shouldFilter={false}>
                <CommandInput
                  placeholder='Tìm theo tên hoặc email...'
                  value={inputValue}
                  onValueChange={setInputValue}
                />
                <CommandList>
                  {error ? (
                    <CommandEmpty>Có lỗi xảy ra khi tải dữ liệu</CommandEmpty>
                  ) : filteredPublishers?.length === 0 ? (
                    <CommandEmpty>Không tìm thấy nhà xuất bản</CommandEmpty>
                  ) : (
                    <CommandGroup className='max-h-[300px] overflow-y-auto'>
                      {filteredPublishers?.map((publisher: Publisher) => (
                        <CommandItem
                          key={publisher.id}
                          value={publisher.id}
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
                              field.value === publisher.id
                                ? 'opacity-100'
                                : 'opacity-0'
                            )}
                          />
                          <div className='flex flex-col'>
                            <span>{publisher.publisherName}</span>
                            {publisher.email && (
                              <span className='text-sm text-muted-foreground'>
                                {publisher.email}
                              </span>
                            )}
                          </div>
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
