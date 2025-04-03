'use client';

import { PATH } from '@/enums/path';
import { RoleEnums } from '@/enums/role';
import { userService } from '@/services/userService';
import { User } from '@/types/user-types';
import tokenMethod from '@/utils/token';
import { useQuery } from '@tanstack/react-query';
import { createContext, useContext, useEffect, useState } from 'react';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  hasRole: (roles?: RoleEnums | RoleEnums[]) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  isAuthenticated: false,
  hasRole: () => false,
  logout: () => {}
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const { data: response } = useQuery({
    queryKey: ['user-profile'],
    queryFn: () => userService.getProfile(),
    retry: false,
    refetchOnWindowFocus: false,
    enabled: !!tokenMethod.get()
  });

  useEffect(() => {
    const checkAuth = () => {
      if (tokenMethod.get()) {
        if (response?.isSuccess && response.result) {
          setUser(response.result);
          setIsAuthenticated(true);
        }
      }
      setIsLoading(false);
    };
    checkAuth();
  }, [response]);

  const hasRole = (roles?: RoleEnums | RoleEnums[]): boolean => {
    // If no roles are provided, allow access
    if (!roles) return true;

    // If user is not authenticated, deny access
    if (!user || !user.userRoles || user.userRoles.length === 0) {
      return false;
    }

    // Get the role names of the user
    // Filter out null roles and map to role names
    const userRoleNames = user.userRoles
      .filter((userRole) => userRole.role)
      .map((userRole) => userRole.role!.roleName);

    // Check if the user has any of the required roles
    if (Array.isArray(roles)) {
      return roles.some((role) => userRoleNames.includes(role));
    }

    return userRoleNames.includes(roles);
  };

  const logout = () => {
    tokenMethod.remove();
    setUser(null);
    setIsAuthenticated(false);
    window.location.href = PATH.LOGIN;
  };

  return (
    <AuthContext.Provider
      value={{ user, isLoading, isAuthenticated, hasRole, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
