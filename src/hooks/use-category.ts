import { categoryService } from '@/services/categoryService';
import { SearchPaginationCategory } from '@/types/category-types';
import { useMutation, useQuery } from '@tanstack/react-query';

export const useGetCategoryById = (id: string) => {
  return useQuery({
    queryKey: ['category', id],
    queryFn: () => categoryService.getById(id)
  });
};

export const useGetAndSearchCategory = (params: SearchPaginationCategory) => {
  return useQuery({
    queryKey: ['categories', params],
    queryFn: () => categoryService.searchPagination(params)
  });
};

export const useCategoryMutation = () => {
  const searchCategoryName = useMutation({
    mutationKey: ['search-category-name'],
    mutationFn: (payload: { categoryName: string }) =>
      categoryService.search(payload)
  });

  const createCategory = useMutation({
    mutationKey: ['create-category'],
    mutationFn: (payload: { categoryName: string; description: string }) =>
      categoryService.create(payload)
  });

  const updateCategory = useMutation({
    mutationKey: ['update-category'],
    mutationFn: (payload: {
      id: string;
      categoryName: string;
      description: string;
    }) => categoryService.update(payload)
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
