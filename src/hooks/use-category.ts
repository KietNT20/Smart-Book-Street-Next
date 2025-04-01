import { categoryService } from '@/services/categoryService';
import { CategorySearchPagination } from '@/types/category-types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export const useGetCategoryById = (id: string) => {
  return useQuery({
    queryKey: ['category', id],
    queryFn: () => categoryService.getById(id)
  });
};

export const useGetAndSearchCategory = (params: CategorySearchPagination) => {
  return useQuery({
    queryKey: ['categories', params],
    queryFn: () => categoryService.searchPagination(params)
  });
};

export const useCategoryMutation = () => {
  const queryClient = useQueryClient();

  const searchCategoryName = useMutation({
    mutationKey: ['search-category-name'],
    mutationFn: (payload: { categoryName: string }) =>
      categoryService.search(payload)
  });

  const createCategory = useMutation({
    mutationKey: ['create-category'],
    mutationFn: (payload: { categoryName: string; description: string }) =>
      categoryService.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    }
  });

  const updateCategory = useMutation({
    mutationKey: ['update-category'],
    mutationFn: ({
      id,
      payload
    }: {
      id: string;
      payload: { categoryName: string; description: string };
    }) => categoryService.update(id, payload)
  });

  const deleteCategory = useMutation({
    mutationKey: ['delete-category'],
    mutationFn: (categoryId: string) => categoryService.delete(categoryId)
  });

  return {
    searchCategoryName,
    createCategory,
    updateCategory,
    deleteCategory
  };
};
