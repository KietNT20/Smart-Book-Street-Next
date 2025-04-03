'use client';

import { Plus } from 'lucide-react';
import { useState } from 'react';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { useCategoryMutation, useGetCategories } from '@/hooks/use-category';
import { CategoryFormValues } from '@/lib/zod';
import { CategoryFormModal } from './_components/cate-form-modal';
import { CategoryCol, columns } from './columns';
import { DataTable } from './data-table';

export default function CategoriesPage() {
  const { data: categoriesRes, isLoading } = useGetCategories();
  const {
    createCategory,
    createCategoryPending,
    updateCategory,
    updateCategoryPending,
    deleteCategory,
    deleteCategoryPending
  } = useCategoryMutation();

  // State for modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<CategoryCol | null>(
    null
  );

  // State for delete confirmation
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<string | null>(null);

  const handleCreate = () => {
    setSelectedCategory(null);
    setIsModalOpen(true);
  };

  const handleEdit = (category: CategoryCol) => {
    setSelectedCategory(category);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    setCategoryToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (!categoryToDelete) return;
    deleteCategory(categoryToDelete, {
      onSuccess: () => {
        setIsDeleteDialogOpen(false);
        setCategoryToDelete(null);
      }
    });
  };

  const handleSubmit = (values: CategoryFormValues) => {
    if (selectedCategory) {
      updateCategory(
        {
          id: selectedCategory.id,
          payload: values
        },
        {
          onSuccess: () => {
            setIsModalOpen(false);
            setSelectedCategory(null);
          }
        }
      );
    } else {
      // Create
      createCategory(values, {
        onSuccess: () => {
          setIsModalOpen(false);
        }
      });
    }
  };

  if (isLoading) {
    return <div className='container mx-auto py-10'>Đang tải dữ liệu...</div>;
  }

  if (!categoriesRes) {
    return (
      <div className='container mx-auto py-10'>Không tìm thấy dữ liệu</div>
    );
  }

  return (
    <div className='container mx-auto py-10'>
      <div className='mb-6 flex items-center justify-between'>
        <h2 className='text-3xl font-bold'>Quản lý danh mục</h2>
        <Button onClick={handleCreate}>
          <Plus className='mr-2 h-4 w-4' />
          Tạo danh mục
        </Button>
      </div>

      <DataTable
        columns={columns({
          onEdit: handleEdit,
          onDelete: handleDelete
        })}
        data={categoriesRes?.results || []}
      />

      <CategoryFormModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
        initialData={selectedCategory}
        isSubmitting={createCategoryPending || updateCategoryPending}
      />

      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Bạn có chắc chắn muốn xóa?</AlertDialogTitle>
            <AlertDialogDescription>
              Hành động này không thể hoàn tác. Danh mục này sẽ bị xóa vĩnh viễn
              khỏi hệ thống.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteCategoryPending}>
              Hủy
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              disabled={deleteCategoryPending}
              className='bg-red-600 hover:bg-red-700'
            >
              Xóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
