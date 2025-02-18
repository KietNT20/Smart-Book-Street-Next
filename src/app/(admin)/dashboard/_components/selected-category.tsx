import { CommandItem } from '@/components/ui/command';
import { useGetCategoryById } from '@/hooks/use-category';
import { Check } from 'lucide-react';

type Props = {
  id: string;
  onDeselect: () => void;
};

const SelectedCategory = ({ id, onDeselect }: Props) => {
  const { data: categoryRes, isLoading } = useGetCategoryById(id);
  const categories = categoryRes?.result;

  if (isLoading) {
    return (
      <CommandItem disabled className='text-muted-foreground'>
        <span className='loading loading-spinner loading-sm mr-2' />
        Đang tải...
      </CommandItem>
    );
  }

  if (!categories) return null;

  return (
    <CommandItem onSelect={onDeselect}>
      <Check className='mr-2 h-4 w-4 opacity-100' />
      {categories?.categoryName}
    </CommandItem>
  );
};
export default SelectedCategory;
