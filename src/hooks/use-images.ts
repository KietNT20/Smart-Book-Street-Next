import { imageService, UploadImagePayload } from '@/services/imageService';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export const useGetImagesByEntityID = ({ entityId }: { entityId?: string }) => {
  const getImagesByEntityId = useQuery({
    queryKey: ['images', entityId],
    queryFn: async () => await imageService.getByTypeOrEntityID({ entityId })
  });

  return {
    imagesDataEntityId: getImagesByEntityId.data,
    isPendingImages: getImagesByEntityId.isPending,
    errorImages: getImagesByEntityId.error
  };
};

export const useImagesMutation = () => {
  const queryClient = useQueryClient();

  const createImageMutation = useMutation({
    mutationFn: (payload: UploadImagePayload) => imageService.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['images'] });
    }
  });

  const deleteImageMutation = useMutation({
    mutationFn: (id: string) => imageService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['images'] });
    }
  });

  return {
    // Upload image
    uploadImage: createImageMutation.mutate,
    isUploading: createImageMutation.isPending,
    errorUpload: createImageMutation.error,

    // Delete image
    deleteImage: deleteImageMutation.mutate,
    isDeleting: deleteImageMutation.isPending,
    errorDelete: deleteImageMutation.error
  };
};
