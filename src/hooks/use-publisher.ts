import { publisherService } from '@/services/publisherService';
import { useQuery } from '@tanstack/react-query';

export const usePublisherQuery = () => {
  const getAllPublishers = useQuery({
    queryKey: ['publishers'],
    queryFn: () => publisherService.getAll(),
  });

  return {
    getAllPublishers,
  };
};
