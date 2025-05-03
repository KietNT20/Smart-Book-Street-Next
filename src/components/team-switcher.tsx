'use client';

import { Map } from 'lucide-react';

import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';
import { useAuth } from '@/hooks/use-auth';
import { useGetStreetsAll } from '@/hooks/use-street';
import { useGetContractUser } from '@/hooks/use-user-store';
import { useMemo } from 'react';
import TeamSwitcherInner from './team-switch-inner';

export function TeamSwitcher() {
  const { hasRole, profile } = useAuth();
  const { isMobile } = useSidebar();
  const { streetsRes, isLoadingStreets } = useGetStreetsAll();
  const { userStore } = useGetContractUser(profile?.id || '');

  // Use useMemo to memoize the streets array
  const streets = useMemo(() => streetsRes || [], [streetsRes]);

  // Show loading state directly from this component
  if (isLoadingStreets) {
    return (
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton size='lg'>
            <div className='flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground'>
              <Map className='size-4' />
            </div>
            <div className='grid flex-1 text-left text-sm leading-tight'>
              <span className='truncate font-semibold'>Đang tải...</span>
            </div>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    );
  }

  return (
    <TeamSwitcherInner
      streets={streets}
      userStore={userStore}
      hasRole={hasRole}
      isMobile={isMobile}
      isLoadingStreets={isLoadingStreets}
    />
  );
}
