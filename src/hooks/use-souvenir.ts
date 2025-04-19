import { PATH } from '@/enums/path';
import { souvenirService } from '@/services/souvenirService';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export const useSouvenirMutation = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  const createSouvenirMutation = useMutation({
    mutationKey: ['create-souvenir'],
    mutationFn: (data: FormData) => souvenirService.create(data),
    onSuccess: (data) => {
      if (data) {
        queryClient.invalidateQueries({ queryKey: ['souvenirs'] });
        toast.success('Tạo quà lưu niệm thành công');
        router.replace(PATH.SOUVENIRS);
      }
    },
    onError: (error) => {
      console.error('Error creating souvenir:', error);
      toast.error('Có lỗi xảy ra khi tạo quà lưu niệm');
    },
  });
  const updateSouvenirMutation = useMutation({
    mutationKey: ['update-souvenir'],
    mutationFn: ({ id, data }: { id: string; data: FormData }) =>
      souvenirService.update(id, data),
    onSuccess: (data) => {
      if (data) {
        queryClient.invalidateQueries({ queryKey: ['souvenirs'] });
        toast.success('Cập nhật quà lưu niệm thành công');
        router.replace(PATH.SOUVENIRS);
      }
    },
    onError: (error) => {
      console.error('Error updating souvenir:', error);
      toast.error('Có lỗi xảy ra khi cập nhật quà lưu niệm');
    },
  });

  const deleteSouvenirMutation = useMutation({
    mutationKey: ['delete-souvenir'],
    mutationFn: (id: string) => souvenirService.delete(id),
    onSuccess: (data) => {
      if (data) {
        queryClient.invalidateQueries({ queryKey: ['souvenirs'] });
        toast.success('Xóa quà lưu niệm thành công');
      }
    },
    onError: (error) => {
      console.error('Error deleting souvenir:', error);
      toast.error('Có lỗi xảy ra khi xóa quà lưu niệm');
    },
  });

  return {
    createSouvenir: createSouvenirMutation.mutate,
    isCreatingSouvenir: createSouvenirMutation.isPending,
    updateSouvenir: updateSouvenirMutation.mutate,
    isUpdatingSouvenir: updateSouvenirMutation.isPending,
    deleteSouvenir: deleteSouvenirMutation.mutate,
    isDeletingSouvenir: deleteSouvenirMutation.isPending,
  };
};
