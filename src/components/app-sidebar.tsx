'use client';

import {
  AudioWaveform,
  BarChart3,
  Book,
  BookOpen,
  CalendarIcon,
  ChartNoAxesCombined,
  Command,
  GalleryVerticalEnd,
  LibraryBig,
  PieChart,
  Store,
  Users,
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
  SidebarRail,
} from '@/components/ui/sidebar';
// import { useAuth } from '@/context/auth-context';
import { PATH } from '@/enums/path';
import { RoleEnums } from '@/enums/role';
import { useAuth } from '@/hooks/use-auth';
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

  const menuData = {
    teams: [
      {
        name: 'Acme Inc',
        logo: GalleryVerticalEnd,
        plan: 'Enterprise',
      },
      {
        name: 'Acme Corp.',
        logo: AudioWaveform,
        plan: 'Startup',
      },
      {
        name: 'Evil Corp.',
        logo: Command,
        plan: 'Free',
      },
    ],
    navMain: [
      // ADMIN MENUS
      {
        title: 'Đường sách',
        url: '#',
        icon: LibraryBig,
        isActive: checkActive([
          { url: PATH.PUBLISHERS },
          { url: PATH.STORES },
          { url: PATH.ZONES },
        ]),
        roles: [RoleEnums.ADMIN],
        items: [
          {
            title: 'Khu vực',
            url: PATH.ZONES,
            roles: [RoleEnums.ADMIN],
          },
          {
            title: 'Nhà xuất bản',
            url: PATH.PUBLISHERS,
            roles: [RoleEnums.ADMIN],
          },
          {
            title: 'Cửa hàng',
            url: PATH.STORES,
            roles: [RoleEnums.ADMIN],
          },
        ],
      },
      {
        title: 'Sách',
        url: '#',
        icon: Book,
        isActive: checkActive([
          { url: PATH.ADMIN_BOOKS },
          { url: PATH.ADMIN_AUTHORS },
          { url: PATH.CATEGORIES },
        ]),
        roles: [RoleEnums.ADMIN],
        items: [
          {
            title: 'Quản lý sách',
            url: PATH.ADMIN_BOOKS,
            roles: [RoleEnums.ADMIN],
          },
          {
            title: 'Quản lý tác giả',
            url: PATH.ADMIN_AUTHORS,
            roles: [RoleEnums.ADMIN],
          },
          {
            title: 'Quản lý danh mục sách',
            url: PATH.CATEGORIES,
            roles: [RoleEnums.ADMIN],
          },
        ],
      },
      {
        title: 'Sự kiện',
        url: '#',
        icon: CalendarIcon,
        isActive: checkActive([
          { url: PATH.EVENTS },
          { url: PATH.CALENDAR_EVENT },
        ]),
        roles: [RoleEnums.ADMIN],
        items: [
          {
            title: 'Quản lý sự kiện',
            url: PATH.EVENTS,
            roles: [RoleEnums.ADMIN],
          },
          {
            title: 'Lịch sự kiện',
            url: PATH.CALENDAR_EVENT,
            roles: [RoleEnums.ADMIN],
          },
        ],
      },
      {
        title: 'Người dùng',
        url: '#',
        icon: Users,
        isActive: checkActive([{ url: PATH.USERS }, { url: PATH.ROLES }]),
        roles: [RoleEnums.ADMIN],
        items: [
          {
            title: 'Quản lý người dùng',
            url: PATH.USERS,
            roles: [RoleEnums.ADMIN],
          },
          {
            title: 'Quản lý vai trò',
            url: PATH.ROLES,
            roles: [RoleEnums.ADMIN],
          },
        ],
      },

      // PUBLISHER MANAGER MENUS
      {
        title: 'Quản lý sách',
        url: '#',
        icon: BookOpen,
        isActive: checkActive([
          { url: PATH.ADMIN_BOOKS },
          { url: PATH.CATEGORIES },
          { url: PATH.INVENTORY },
        ]),
        roles: [RoleEnums.PUBLISHER_MANAGER],
        items: [
          {
            title: 'Thông tin sách',
            url: PATH.ADMIN_BOOKS,
            roles: [RoleEnums.PUBLISHER_MANAGER],
          },
          {
            title: 'Danh mục sách',
            url: PATH.CATEGORIES,
            roles: [RoleEnums.PUBLISHER_MANAGER],
          },
          {
            title: 'Quản lý kho sách',
            url: PATH.INVENTORY,
            roles: [RoleEnums.PUBLISHER_MANAGER],
          },
        ],
      },

      // STORE MANAGER MENUS
      {
        title: 'Quản lý cửa hàng',
        url: '#',
        icon: Store,
        isActive: checkActive([
          { url: PATH.STORE_BOOKS },
          { url: PATH.STORE_HOURS },
          { url: PATH.INVENTORY },
        ]),
        roles: [RoleEnums.STORE_MANAGER],
        items: [
          {
            title: 'Sách tại cửa hàng',
            url: PATH.STORE_BOOKS,
            roles: [RoleEnums.STORE_MANAGER],
          },
          {
            title: 'Giờ hoạt động',
            url: PATH.STORE_HOURS,
            roles: [RoleEnums.STORE_MANAGER],
          },
          {
            title: 'Kho sách',
            url: PATH.INVENTORY,
            roles: [RoleEnums.STORE_MANAGER],
          },
        ],
      },
    ],
    projects: [
      // Projects common to all roles
      {
        name: 'Dashboard',
        url: PATH.DASHBOARD,
        icon: PieChart,
        roles: [
          RoleEnums.ADMIN,
          RoleEnums.PUBLISHER_MANAGER,
          RoleEnums.STORE_MANAGER,
        ],
      },
      {
        name: 'Thống kê sách',
        url: PATH.STATISTICS,
        icon: BarChart3,
        roles: [
          RoleEnums.ADMIN,
          RoleEnums.PUBLISHER_MANAGER,
          RoleEnums.STORE_MANAGER,
        ],
      },

      // Admin-only items
      {
        name: 'Thống kê khách',
        url: PATH.VISITOR_STATISTICS,
        icon: Users,
        roles: [RoleEnums.ADMIN],
      },
      {
        name: 'Dự đoán lượng khách',
        url: PATH.VISITOR_PREDICTION,
        icon: ChartNoAxesCombined,
        roles: [RoleEnums.ADMIN],
      },
      {
        name: 'Khuyến nghị khách',
        url: PATH.VISITOR_RECOMMENDATION,
        icon: Users,
        roles: [RoleEnums.ADMIN],
      },
    ],
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
            ) || [],
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
