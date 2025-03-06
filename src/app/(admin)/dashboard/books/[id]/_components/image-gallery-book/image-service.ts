'use client';

import { useImagesMutation } from '@/hooks/use-images';
import { getPublicIdFromUrl } from '../../_lib/action';

export const useImageService = () => {
  const { deleteImageMutation } = useImagesMutation();

  const deleteFromCloudinary = async (publicId: string) => {
    const response = await fetch('/api/sign-cloudinary-params', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ publicId })
    });

    if (!response.ok) {
      throw new Error('Failed to delete from Cloudinary');
    }

    return response.json();
  };

  const onDelete = async (id: string, url: string) => {
    try {
      const publicId = await getPublicIdFromUrl(url);
      if (!publicId) {
        throw new Error('Could not extract public ID from URL');
      }
      await deleteFromCloudinary(publicId);
      await deleteImageMutation.mutateAsync(id);
    } catch (error) {
      console.error('Error deleting image:', error);
    }
  };

  return {
    onDelete,
    deleteImageMutation
  };
};
