'use client';

import { PATH } from '@/enums/path';
import { RoleEnums } from '@/enums/role';
import {
  hasUserRole,
  selectIsAuthenticated,
  selectProfile,
} from '@/lib/features/user/userSlice';
import { useAppSelector } from '@/lib/hooks';
import { useRouter } from 'next/navigation';
import { ReactNode, useEffect } from 'react';

interface RoleGuardProps {
  children: ReactNode;
  allowedRoles: RoleEnums | RoleEnums[];
  redirectTo?: string;
}

const RoleGuard = ({
  children,
  allowedRoles,
  redirectTo = PATH.UNAUTHORIZED,
}: RoleGuardProps) => {
  const router = useRouter();

  const profile = useAppSelector(selectProfile);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push(PATH.LOGIN);
      return;
    }

    const hasAccess = hasUserRole(profile, allowedRoles);
    if (!hasAccess) {
      router.push(redirectTo);
    }
  }, [isAuthenticated, profile, allowedRoles, redirectTo, router]);

  if (!isAuthenticated || !hasUserRole(profile, allowedRoles)) {
    return null;
  }

  return <>{children}</>;
};

export default RoleGuard;
