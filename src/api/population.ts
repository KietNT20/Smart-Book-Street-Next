import { NextJS_API } from '@/enums/endpoint';
import { useQuery } from '@tanstack/react-query';

export const fetchPopulation = async (params: string): Promise<any> => {
  try {
    const response = await fetch(`${NextJS_API.POPULATION}${params}`);

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error fetching population data:', error);
    throw error;
  }
};

export const useGetAllPopulationCamera = (params: string) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['population-camera', params],
    queryFn: () => fetchPopulation(params),
  });
  return {
    populationCamera: data,
    isLoading,
    error,
  };
};
