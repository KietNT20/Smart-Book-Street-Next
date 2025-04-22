import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
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
import { useCategoryMutation } from '@/hooks/use-category';
import useDebounce from '@/hooks/use-debounce';
import { cn } from '@/lib/utils';
import { Category } from '@/types/category-types';
import { Check, ChevronsUpDown } from 'lucide-react';
import { useState } from 'react';
import { Control, FieldValues, Path } from 'react-hook-form';
import SelectedCategory from './selected-category';

type Props<T extends FieldValues> = {
  name: Path<T>;
  control: Control<T>;
  disabled?: boolean;
};

const CategoryCombobox = <T extends FieldValues>({
  name,
  control,
  disabled = false,
}: Props<T>) => {
  const [input, setInput] = useState('');
  const [results, setResults] = useState<Category[]>([]);
  const { searchCategoryName } = useCategoryMutation();
  const debouncedResults = useDebounce(results, 300);

  const handleSearch = async (value: string) => {
    setInput(value);

    if (!value) {
      setResults([]);
      return;
    }

    try {
      const { results } = await searchCategoryName.mutateAsync({
        categoryName: value,
      });
      setResults(results);
    } catch (error) {
      console.error('Failed to search category:', error);
      setResults([]);
    }
  };

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>
            Danh mục <span className='text-red-400'>*</span>
          </FormLabel>
          <Popover>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  variant='outline'
                  role='combobox'
                  className='w-full justify-between'
                  disabled={disabled}
                >
                  {field.value?.length
                    ? `${field.value?.length} danh mục được chọn`
                    : 'Chọn danh mục...'}
                  <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent
              align='start'
              className='w-[200px] p-0 lg:w-[500px]'
            >
              <Command shouldFilter={false}>
                <CommandInput
                  placeholder='Tìm danh mục...'
                  value={input}
                  onValueChange={handleSearch}
                />
                <CommandList>
                  {field.value?.length > 0 && !input && (
                    <>
                      <CommandGroup heading='Đã chọn'>
                        {field.value.map((id: string) => (
                          <SelectedCategory
                            key={id}
                            id={id}
                            onDeselect={() => {
                              field.onChange(
                                field.value.filter(
                                  (categoryId: string) => categoryId !== id
                                )
                              );
                            }}
                          />
                        ))}
                      </CommandGroup>
                      <CommandSeparator />
                    </>
                  )}

                  <CommandGroup className='max-h-80 overflow-y-auto'>
                    {searchCategoryName.isPending && (
                      <CommandItem disabled className='text-muted-foreground'>
                        <span className='loading loading-spinner loading-sm mr-2' />
                        Đang tải...
                      </CommandItem>
                    )}
                    {!searchCategoryName.isPending &&
                      !debouncedResults?.length &&
                      input && (
                        <CommandEmpty>Không tìm thấy danh mục.</CommandEmpty>
                      )}
                    {!searchCategoryName.isPending &&
                      debouncedResults?.map((category) => (
                        <CommandItem
                          key={category.id}
                          onSelect={() => {
                            const values = (field.value as string[]) || [];
                            field.onChange(
                              values?.includes(category.id!)
                                ? values?.filter(
                                    (id: string) => id !== category.id
                                  )
                                : [...values, category.id]
                            );
                          }}
                        >
                          <Check
                            className={cn(
                              'mr-2 h-4 w-4',
                              (field.value as string[])?.includes(category.id!)
                                ? 'opacity-100'
                                : 'opacity-0'
                            )}
                          />
                          {category.categoryName}
                        </CommandItem>
                      ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default CategoryCombobox;
