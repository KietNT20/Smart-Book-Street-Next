import { roleService } from '@/services/roleService';
import { useQuery } from '@tanstack/react-query';

export const useRoles = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['roles'],
    queryFn: () => roleService.getAll(),
    select(data) {
      return data.results.map((role) => ({
        label: role.roleName,
        value: role.id,
      }));
    },
  });

  return {
    roles: data || [],
    isLoading,
  };
};

export const useRolesAvailable = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['roles-available'],
    queryFn: () => roleService.getAvailableForRequest(),
    select(data) {
      return data.results.map((role) => ({
        label: role.roleName,
        value: role.id,
      }));
    },
  });

  return {
    rolesAvailable: data || [],
    isLoadingRolesAvailable: isLoading,
  };
};
