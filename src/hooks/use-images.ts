import { imageService } from '@/services/imageService';
import { ImagePayload } from '@/types/image-types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

export const useGetImageByTypeAndEntityID = ({
  type,
  entityID,
}: {
  type?: string;
  entityID?: string;
}) => {
  return useQuery({
    queryKey: ['images', type, entityID],
    queryFn: () => imageService.getByTypeAndEntityID(type, entityID),
  });
};

export const useImagesMutation = () => {
  const queryClient = useQueryClient();

  const addImageMutation = useMutation({
    mutationFn: (payload: Array<ImagePayload>) => imageService.add(payload),
    onSuccess: (data) => {
      console.log('data', data);
      if (data?.isSuccess) {
        toast.success('Thêm ảnh thành công');
      }
      queryClient.invalidateQueries({ queryKey: ['images'] });
    },
    onError: () => {
      toast.error('Thêm ảnh thất bại');
    },
  });

  const deleteImageMutation = useMutation({
    mutationFn: (id: string) => imageService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['images'] });
      toast.success('Xóa ảnh thành công');
    },
    onError: () => {
      toast.error('Xóa ảnh thất bại');
    },
  });

  return {
    addImageMutation,
    deleteImageMutation,
  };
};
