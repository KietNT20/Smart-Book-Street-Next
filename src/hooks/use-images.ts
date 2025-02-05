import { imageService } from '@/services/imageService';
import { ImagePayload } from '@/types/image-types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useToast } from './use-toast';

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
  const { toast } = useToast();

  const addImageMutation = useMutation({
    mutationFn: (payload: Array<ImagePayload>) => imageService.add(payload),
    onSuccess: (data) => {
      if (data) {
        toast({
          title: 'Success',
          description: 'Thêm ảnh thành công',
          variant: 'success',
        });
      }
      queryClient.invalidateQueries({ queryKey: ['images'] });
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Thêm ảnh thất bại',
        variant: 'destructive',
      });
    },
  });

  const deleteImageMutation = useMutation({
    mutationFn: (id: string) => imageService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['images'] });
      toast({
        title: 'Success',
        description: 'Xóa ảnh thành công',
        variant: 'success',
      });
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Xóa ảnh thất bại',
        variant: 'destructive',
      });
    },
  });

  return {
    addImageMutation,
    deleteImageMutation,
  };
};
