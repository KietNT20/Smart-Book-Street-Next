import { categoryService } from '@/services/categoryService';
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { toast } from 'sonner';

export const useGetCategories = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['categories'],
    queryFn: () => categoryService.getAll(),
    placeholderData: keepPreviousData,
  });
  return {
    categoriesData: data?.results || [],
    isLoading,
    error,
  };
};

export const useGetCategoryById = (id: string) => {
  return useQuery({
    queryKey: ['categories', id],
    queryFn: () => categoryService.getById(id),
    enabled: !!id,
  });
};

export const useCategoryMutation = () => {
  const queryClient = useQueryClient();

  const searchCategoryName = useMutation({
    mutationKey: ['search-category-name'],
    mutationFn: (payload: { categoryName: string }) =>
      categoryService.search(payload),
    onSuccess: (data) => {
      if (data) {
        queryClient.invalidateQueries({ queryKey: ['categories'] });
      }
    },
  });

  const createCategoryMutation = useMutation({
    mutationKey: ['create-category'],
    mutationFn: (payload: { categoryName: string; description?: string }) =>
      categoryService.create(payload),
    onSuccess: (data) => {
      if (data) {
        toast.success('Thêm danh mục thành công');
        queryClient.invalidateQueries({ queryKey: ['categories'] });
      }
    },
    onError: (error) => {
      toast.error('Đã xảy ra lỗi khi thêm danh mục');
      console.error('Error creating category:', error);
    },
  });

  const updateCategoryMutation = useMutation({
    mutationKey: ['update-category'],
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: { categoryName: string; description?: string };
    }) => categoryService.update(id, payload),
    onSuccess: (data) => {
      if (data) {
        toast.success('Cập nhật danh mục thành công');
        queryClient.invalidateQueries({ queryKey: ['categories'] });
      }
    },
    onError: (error) => {
      toast.error('Đã xảy ra lỗi khi cập nhật danh mục');
      console.error('Error updating category:', error);
    },
  });

  const deleteCategoryMutation = useMutation({
    mutationKey: ['delete-category'],
    mutationFn: (categoryId: string) => categoryService.delete(categoryId),
    onSuccess: (data) => {
      if (data) {
        toast.success('Xóa danh mục thành công');
        queryClient.invalidateQueries({ queryKey: ['categories'] });
      }
    },
    onError: (error) => {
      toast.error('Đã xảy ra lỗi khi xóa danh mục');
      console.error('Error deleting category:', error);
    },
  });

  return {
    searchCategoryName,
    // Create Category
    createCategory: createCategoryMutation.mutate,
    createCategoryPending: createCategoryMutation.isPending,
    // Update Category
    updateCategory: updateCategoryMutation.mutate,
    updateCategoryPending: updateCategoryMutation.isPending,
    // Delete Category
    deleteCategory: deleteCategoryMutation.mutate,
    deleteCategoryPending: deleteCategoryMutation.isPending,
  };
};
