import { categoryService } from '@/services/categoryService';
import { useMutation, useQuery } from '@tanstack/react-query';

export const useGetCategoryById = (id: string) => {
  return useQuery({
    queryKey: ['category', id],
    queryFn: () => categoryService.getById(id),
  });
};

export const useCategoryMutation = () => {
  const searchCategoryName = useMutation({
    mutationKey: ['search-category-name'],
    mutationFn: (payload: { categoryName: string }) =>
      categoryService.search(payload),
  });

  return {
    searchCategoryName,
  };
};
