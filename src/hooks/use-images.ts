import { imageService } from '@/services/imageService';
import { ImagePayload } from '@/types/image-types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

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

export const useAddImage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: Array<ImagePayload>) => imageService.add(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['images'] });
    },
  });
};
