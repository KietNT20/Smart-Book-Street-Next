'use client';

import {
  AudioWaveform,
  Book,
  BookOpen,
  CalendarIcon,
  ChartNoAxesCombined,
  Command,
  GalleryVerticalEnd,
  LibraryBig,
  Map,
  PieChart,
  Store
} from 'lucide-react';
import * as React from 'react';

import { NavMain } from '@/components/nav-main';
import { NavProjects } from '@/components/nav-projects';
import { NavUser } from '@/components/nav-user';
import { TeamSwitcher } from '@/components/team-switcher';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail
} from '@/components/ui/sidebar';
import { useAuth } from '@/context/auth-context';
import { PATH } from '@/enums/path';
import { RoleEnums } from '@/enums/role';
import { usePathname } from 'next/navigation';

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();
  const { hasRole, isLoading } = useAuth();

  // Check if path is active for a menu group
  const checkActive = (items: { url: string }[]) => {
    return items.some(
      (item) => pathname === item.url || pathname.startsWith(`${item.url}/`)
    );
  };

  // Define menu data with role requirements
  const menuData = {
    teams: [
      {
        name: 'Acme Inc',
        logo: GalleryVerticalEnd,
        plan: 'Enterprise'
      },
      {
        name: 'Acme Corp.',
        logo: AudioWaveform,
        plan: 'Startup'
      },
      {
        name: 'Evil Corp.',
        logo: Command,
        plan: 'Free'
      }
    ],
    navMain: [
      {
        title: 'Đường sách',
        url: '#',
        icon: LibraryBig,
        isActive: checkActive([
          { url: '#' },
          { url: PATH.PUBLISHERS },
          { url: PATH.STORES }
        ]),
        roles: [RoleEnums.ADMIN],
        items: [
          {
            title: 'Khu vực',
            url: '#',
            roles: [RoleEnums.ADMIN]
          },
          {
            title: 'Nhà xuất bản',
            url: PATH.PUBLISHERS,
            roles: [RoleEnums.ADMIN]
          },
          {
            title: 'Cửa hàng',
            url: PATH.STORES,
            roles: [RoleEnums.ADMIN]
          }
        ]
      },
      {
        title: 'Sách',
        url: '#',
        icon: Book,
        isActive: checkActive([
          { url: PATH.ADMIN_BOOKS },
          { url: PATH.ADMIN_AUTHORS },
          { url: PATH.CATEGORIES }
        ]),
        roles: [RoleEnums.ADMIN, RoleEnums.PUBLISHER_MANAGER],
        items: [
          {
            title: 'Quản lý sách',
            url: PATH.ADMIN_BOOKS,
            roles: [RoleEnums.ADMIN]
          },
          {
            title: 'Tác giả',
            url: PATH.ADMIN_AUTHORS,
            roles: [RoleEnums.ADMIN]
          },
          {
            title: 'Danh mục',
            url: PATH.CATEGORIES,
            roles: [RoleEnums.ADMIN, RoleEnums.PUBLISHER_MANAGER]
          },
          {
            title: 'Kho sách',
            url: PATH.INVENTORY,
            roles: [RoleEnums.ADMIN, RoleEnums.PUBLISHER_MANAGER]
          }
        ]
      },
      {
        title: 'Nhà xuất bản',
        url: '#',
        icon: BookOpen,
        isActive: checkActive([{ url: PATH.PUBLISHER_BOOKS }]),
        roles: [RoleEnums.PUBLISHER_MANAGER],
        items: [
          {
            title: 'Cập nhật sách',
            url: PATH.PUBLISHER_BOOKS,
            roles: [RoleEnums.PUBLISHER_MANAGER]
          },
          {
            title: 'Quản lý danh mục',
            url: PATH.CATEGORIES,
            roles: [RoleEnums.PUBLISHER_MANAGER]
          },
          {
            title: 'Quản lý kho',
            url: PATH.INVENTORY,
            roles: [RoleEnums.PUBLISHER_MANAGER]
          }
        ]
      },
      {
        title: 'Cửa hàng',
        url: '#',
        icon: Store,
        isActive: checkActive([
          { url: PATH.STORE_BOOKS },
          { url: PATH.STORE_HOURS }
        ]),
        roles: [RoleEnums.STORE_MANAGER],
        items: [
          {
            title: 'Quản lý sách',
            url: PATH.STORE_BOOKS,
            roles: [RoleEnums.STORE_MANAGER]
          },
          {
            title: 'Giờ mở cửa',
            url: PATH.STORE_HOURS,
            roles: [RoleEnums.STORE_MANAGER]
          },
          {
            title: 'Sự kiện',
            url: '#',
            roles: [RoleEnums.STORE_MANAGER]
          }
        ]
      },
      {
        title: 'Sự kiện',
        url: '#',
        icon: CalendarIcon,
        isActive: checkActive([
          { url: PATH.EVENTS },
          { url: PATH.CALENDAR_EVENT }
        ]),
        roles: [RoleEnums.ADMIN],
        items: [
          {
            title: 'Quản lý sự kiện',
            url: PATH.EVENTS,
            roles: [RoleEnums.ADMIN]
          },
          {
            title: 'Lịch sự kiện',
            url: PATH.CALENDAR_EVENT,
            roles: [RoleEnums.ADMIN]
          }
        ]
      }
    ],
    projects: [
      {
        name: 'Dashboard',
        url: PATH.DASHBOARD,
        icon: PieChart,
        roles: [
          RoleEnums.ADMIN,
          RoleEnums.PUBLISHER_MANAGER,
          RoleEnums.STORE_MANAGER
        ]
      },
      {
        name: 'Thống kê',
        url: PATH.STATISTICS,
        icon: ChartNoAxesCombined,
        roles: [
          RoleEnums.ADMIN,
          RoleEnums.PUBLISHER_MANAGER,
          RoleEnums.STORE_MANAGER
        ]
      },
      {
        name: 'Thống kê khách',
        url: PATH.VISITOR_STATISTICS,
        icon: Map,
        roles: [RoleEnums.ADMIN]
      },
      {
        name: 'Dự đoán khách',
        url: PATH.VISITOR_PREDICTION,
        icon: ChartNoAxesCombined,
        roles: [RoleEnums.ADMIN]
      }
    ]
  };

  // Filter menu items based on user roles
  const filteredNavMain = React.useMemo(() => {
    if (isLoading) return [];

    return (
      menuData.navMain
        .filter((item) => !item.roles || hasRole(item.roles))
        .map((item) => ({
          ...item,
          items:
            item.items?.filter(
              (subItem) => !subItem.roles || hasRole(subItem.roles)
            ) || []
        }))
        // Filter out menu items with no accessible subitems
        .filter((item) => item.items.length > 0)
    );
  }, [menuData.navMain, hasRole, isLoading]);

  // Filter project items based on user roles
  const filteredProjects = React.useMemo(() => {
    if (isLoading) return [];

    return menuData.projects.filter(
      (project) => !project.roles || hasRole(project.roles)
    );
  }, [menuData.projects, hasRole, isLoading]);

  if (isLoading) {
    return (
      <div className='flex h-screen w-64 items-center justify-center bg-sidebar'>
        <div className='h-8 w-8 animate-spin rounded-full border-b-2 border-white'></div>
      </div>
    );
  }

  return (
    <Sidebar collapsible='icon' {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={menuData.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={filteredNavMain} />
        <NavProjects projects={filteredProjects} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
