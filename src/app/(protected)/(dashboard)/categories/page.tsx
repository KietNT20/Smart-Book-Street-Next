'use client';

import { ConfirmModal } from '@/components/confirm-modal';
import LoadingSpinner from '@/components/spin/loading-spinner';
import { Button } from '@/components/ui/button';
import { Empty } from 'antd';
import { Plus } from 'lucide-react';
import { CategoryFormModal } from './_components/cate-form-modal';
import { useCategoriesPage } from './_hooks/use-cate-page';
import { columns } from './columns';
import { DataTable } from './data-table';

export default function CategoriesPage() {
  const {
    categoriesData,
    isLoading,
    isModalOpen,
    setIsModalOpen,
    selectedCategory,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    createCategoryPending,
    updateCategoryPending,
    deleteCategoryPending,
    handleCreate,
    handleEdit,
    handleDelete,
    confirmDelete,
    handleSubmit,
  } = useCategoriesPage();

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
