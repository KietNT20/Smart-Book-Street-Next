import { publisherService } from '@/services/publisherService';
import { PublisherSearch } from '@/types/publisher-types';
import { useMutation, useQuery } from '@tanstack/react-query';

export const usePublisherQuery = () => {
  const getAllPublishers = useQuery({
    queryKey: ['publishers'],
    queryFn: () => publisherService.getAll(),
  });

  return {
    getAllPublishers,
  };
};

export const usePublisherMutation = () => {
  const searchPublisher = useMutation({
    mutationFn: (search: Partial<PublisherSearch>) =>
      publisherService.search(search),
  });
  return { searchPublisher };
};
