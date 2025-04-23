'use client';

import { Plus } from 'lucide-react';
import { useState } from 'react';

import { ConfirmModal } from '@/components/confirm-modal';
import LoadingSpinner from '@/components/spin/loading-spinner';
import { Button } from '@/components/ui/button';
import { useCategoryMutation, useGetCategories } from '@/hooks/use-category';
import { CategoryFormValues } from '@/lib/zod';
import { Empty } from 'antd';
import { CategoryFormModal } from './_components/cate-form-modal';
import { CategoryCol, columns } from './columns';
import { DataTable } from './data-table';

export default function CategoriesPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<CategoryCol | null>(
    null
  );

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState<boolean>(false);
  const [categoryToDelete, setCategoryToDelete] = useState<string | null>(null);

  const { categoriesData, isLoading } = useGetCategories();
  const {
    createCategory,
    createCategoryPending,
    updateCategory,
    updateCategoryPending,
    deleteCategory,
    deleteCategoryPending,
  } = useCategoryMutation();

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
      },
    });
  };

  const handleSubmit = (values: CategoryFormValues) => {
    if (selectedCategory) {
      updateCategory(
        {
          id: selectedCategory.id,
          payload: values,
        },
        {
          onSuccess: () => {
            setIsModalOpen(false);
            setSelectedCategory(null);
          },
        }
      );
    } else {
      createCategory(values, {
        onSuccess: () => {
          setIsModalOpen(false);
        },
      });
    }
  };

  if (!categoriesData) {
    return <Empty description={'Chưa có dữ liệu'} />;
  }

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className='container mx-auto py-10'>
      <div className='flex items-center justify-between'>
        <h2 className='text-2xl font-bold'>Quản lý danh mục</h2>
        <Button onClick={handleCreate}>
          <Plus className='mr-2 h-4 w-4' />
          Thêm danh mục
        </Button>
      </div>

      <DataTable
        columns={columns({
          onEdit: handleEdit,
          onDelete: handleDelete,
        })}
        data={categoriesData}
      />

      <CategoryFormModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
        initialData={selectedCategory}
        isSubmitting={createCategoryPending || updateCategoryPending}
      />

      <ConfirmModal
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={confirmDelete}
        title='Bạn có chắc chắn muốn xóa?'
        confirmText='Xác nhận xóa'
        description={`Hành động này không thể hoàn tác. Danh mục này sẽ bị xóa khỏi hệ thống.`}
        variant='destructive'
        isLoading={deleteCategoryPending}
      />
    </div>
  );
}
