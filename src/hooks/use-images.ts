import { imageService, UploadImagePayload } from '@/services/imageService';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

export const useGetImagesByEntityID = ({ entityId }: { entityId?: string }) => {
  const getImagesByEntityId = useQuery({
    queryKey: ['images', entityId],
    queryFn: async () => await imageService.getByTypeOrEntityID({ entityId }),
  });

  return {
    imagesDataEntityId: getImagesByEntityId.data,
    isPendingImages: getImagesByEntityId.isPending,
    errorImages: getImagesByEntityId.error,
  };
};

export const useImagesMutation = () => {
  const queryClient = useQueryClient();

  const createImageMutation = useMutation({
    mutationFn: (payload: UploadImagePayload) => imageService.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['books'] });
    },
  });

  const updateImageMutation = useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: Partial<UploadImagePayload>;
    }) => imageService.update(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['books'] });
      toast.success('Cập nhật ảnh thành công');
    },
  });

  const deleteImageMutation = useMutation({
    mutationFn: (id: string) => imageService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['books'] });
      toast.success('Xóa ảnh thành công');
    },
  });

  return {
    // Upload image
    uploadImage: createImageMutation.mutate,
    isUploading: createImageMutation.isPending,
    errorUpload: createImageMutation.error,

    // Update image
    updateImage: updateImageMutation.mutate,
    isUpdating: updateImageMutation.isPending,
    errorUpdate: updateImageMutation.error,

    // Delete image
    deleteImage: deleteImageMutation.mutate,
    isDeleting: deleteImageMutation.isPending,
    errorDelete: deleteImageMutation.error,
  };
};
