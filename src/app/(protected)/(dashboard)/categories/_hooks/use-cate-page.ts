'use client';

import { useCategoryMutation, useGetCategories } from '@/hooks/use-category';
import { CategoryFormValues } from '@/lib/zod';
import { useState } from 'react';
import { CategoryCol } from '../columns';

export const useCategoriesPage = () => {
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

  return {
    categoriesData,
    isLoading,
    isModalOpen,
    setIsModalOpen,
    selectedCategory,
    setSelectedCategory,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    categoryToDelete,
    setCategoryToDelete,
    createCategoryPending,
    updateCategoryPending,
    deleteCategoryPending,
    handleCreate,
    handleEdit,
    handleDelete,
    confirmDelete,
    handleSubmit,
  };
};
