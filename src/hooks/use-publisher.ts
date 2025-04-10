import { publisherService } from '@/services/publisherService';
import { PublisherSearch } from '@/types/publisher-types';
import { useMutation, useQuery } from '@tanstack/react-query';

export const usePublishers = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['publishers'],
    queryFn: () => publisherService.getAll(),
  });

  return {
    publishers: data?.results || [],
    isLoadingPublishers: isLoading,
    errorPublishers: error,
  };
};

export const usePublisherMutation = () => {
  const searchPublisher = useMutation({
    mutationFn: (search: Partial<PublisherSearch>) =>
      publisherService.search(search),
  });
  return { searchPublisher };
};
