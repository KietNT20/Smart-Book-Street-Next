import { PATH } from '@/enums/path';
import { publisherService } from '@/services/publisherService';
import { PublisherParams, PublisherSearch } from '@/types/publisher-types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export const usePublishers = ({
  result,
  sortField,
  sortOrder,
  pageSize,
  pageNumber,
}: PublisherParams) => {
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: [
      'publishers',
      result,
      sortField,
      sortOrder,
      pageSize,
      pageNumber,
    ],
    queryFn: () =>
      publisherService.getAllParams({
        result,
        sortField,
        sortOrder,
        pageSize,
        pageNumber,
      }),
  });

  // Prefetch data for pagination
  const totalPage = data?.totalPages || 1;

  if (pageNumber < totalPage) {
    queryClient.prefetchQuery({
      queryKey: [
        'publishers',
        result,
        sortField,
        sortOrder,
        pageSize,
        pageNumber + 1,
      ],
      queryFn: () =>
        publisherService.getAllParams({
          result,
          sortField,
          sortOrder,
          pageSize,
          pageNumber: pageNumber + 1,
        }),
    });
  }

  if (pageNumber > 1) {
    queryClient.prefetchQuery({
      queryKey: [
        'publishers',
        result,
        sortField,
        sortOrder,
        pageSize,
        pageNumber - 1,
      ],
      queryFn: () =>
        publisherService.getAllParams({
          result,
          sortField,
          sortOrder,
          pageSize,
          pageNumber: pageNumber - 1,
        }),
    });
  }

  return {
    publishers: data?.results || [],
    isLoadingPublishers: isLoading,
    errorPublishers: error,
    totalPage,
  };
};

export const usePublisherMutation = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  const searchPublisher = useMutation({
    mutationKey: ['publisher-search'],
    mutationFn: (search: Partial<PublisherSearch>) =>
      publisherService.search(search),
  });

  const createPublisherMutation = useMutation({
    mutationKey: ['publisher-create'],
    mutationFn: (formData: FormData) => publisherService.create(formData),
    onSuccess: (data) => {
      if (data) {
        queryClient.invalidateQueries({ queryKey: ['publishers'] });
        toast.success('Tạo nhà xuất bản thành công');
        router.replace(PATH.PUBLISHERS);
      }
    },
    onError: (error: Error) => {
      toast.error('Tạo nhà xuất bản thất bại');
      console.error('Error creating publisher:', error);
    },
  });

  const updatePublisherMutation = useMutation({
    mutationKey: ['publisher-update'],
    mutationFn: ({ id, formData }: { id: string; formData: FormData }) =>
      publisherService.update(id, formData),
    onSuccess: (data) => {
      if (data) {
        queryClient.invalidateQueries({ queryKey: ['publishers'] });
        toast.success('Cập nhật nhà xuất bản thành công');
        router.replace(PATH.PUBLISHERS);
      }
    },
    onError: (error: Error) => {
      toast.error('Cập nhật nhà xuất bản thất bại');
      console.error('Error updating publisher:', error);
    },
  });

  const deletePublisherMutation = useMutation({
    mutationKey: ['publisher-delete'],
    mutationFn: (id: string) => publisherService.delete(id),
    onSuccess: (data) => {
      if (data) {
        queryClient.invalidateQueries({ queryKey: ['publishers'] });
        toast.success('Xóa nhà xuất bản thành công');
      }
    },
    onError: (error: Error) => {
      toast.error('Xóa nhà xuất bản thất bại');
      console.error('Error deleting publisher:', error);
    },
  });

  return {
    searchPublisher,
    // Create Publisher
    createPublisher: createPublisherMutation.mutate,
    createPublisherPending: createPublisherMutation.isPending,
    createPublisherError: createPublisherMutation.error,
    // Update Publisher
    updatePublisher: updatePublisherMutation.mutate,
    updatePublisherPending: updatePublisherMutation.isPending,
    updatePublisherError: updatePublisherMutation.error,
    // Delete Publisher
    deletePublisher: deletePublisherMutation.mutate,
    deletePublisherPending: deletePublisherMutation.isPending,
    deletePublisherError: deletePublisherMutation.error,
  };
};

export const usePublisherById = (id: string) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['publisher', id],
    queryFn: () => publisherService.getById(id),
    enabled: !!id,
  });

  return {
    publisher: data?.result,
    isLoadingPublisher: isLoading,
    errorPublisher: error,
  };
};
