'use client';

import {
  BookOpen,
  CalendarIcon,
  ChartNoAxesCombined,
  LibraryBig,
  PieChart,
  Store,
  Users,
} from 'lucide-react';

import { NavMain } from '@/components/nav-main';
import { NavProjects } from '@/components/nav-projects';
import { NavUser } from '@/components/nav-user';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from '@/components/ui/sidebar';
import { PATH } from '@/enums/path';
import { RoleEnums } from '@/enums/role';
import tokenMethod from '@/utils/token';
import { jwtDecode } from 'jwt-decode';
import { usePathname } from 'next/navigation';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { TeamSwitcher } from './team-switcher';

interface DecodedToken {
  sub: string;
  email: string;
  'http://schemas.microsoft.com/ws/2008/06/identity/claims/role':
    | string
    | string[];
  exp: number;
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();
  const [userRoles, setUserRoles] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Get user roles from JWT token
  useEffect(() => {
    try {
      const token = tokenMethod.get()?.accessToken;
      if (token) {
        const decoded = jwtDecode<DecodedToken>(token);
        const roles =
          decoded[
            'http://schemas.microsoft.com/ws/2008/06/identity/claims/role'
          ];

        // Convert roles to array if it's a single string
        const rolesArray = Array.isArray(roles) ? roles : [roles];
        setUserRoles(rolesArray);
      }
      setIsLoading(false);
    } catch (error) {
      console.error('Error decoding token:', error);
      setUserRoles([]);
      setIsLoading(false);
    }
  }, []);

  // Function to check if user has a specific role
  const hasRole = useCallback(
    (roles: RoleEnums | RoleEnums[]) => {
      const rolesToCheck = Array.isArray(roles) ? roles : [roles];
      return rolesToCheck.some((role) => userRoles.includes(role));
    },
    [userRoles]
  );
  // Check if path is active for a menu group
  const checkActive = (items: { url: string }[]) => {
    return items.some(
      (item) => pathname === item.url || pathname.startsWith(`${item.url}/`)
    );
  };

  const menuData = {
    navMain: [
      // ADMIN MENUS
      {
        title: 'Quản lý Đường sách',
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
            title: 'Đăng ký thuê cửa hàng',
            url: PATH.USER_STORES,
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
          { url: PATH.BOOKS },
          { url: PATH.CATEGORIES },
          { url: PATH.INVENTORY },
        ]),
        roles: [
          RoleEnums.PUBLISHER,
          RoleEnums.STORE_MANAGER,
          RoleEnums.STORE_OWNER,
        ],
        items: [
          {
            title: 'Thông tin sách',
            url: PATH.BOOKS,
            roles: [
              RoleEnums.PUBLISHER,
              RoleEnums.STORE_MANAGER,
              RoleEnums.STORE_OWNER,
            ],
          },
          {
            title: 'Thông tin tác giả',
            url: PATH.ADMIN_AUTHORS,
            roles: [
              RoleEnums.PUBLISHER,
              RoleEnums.STORE_MANAGER,
              RoleEnums.STORE_OWNER,
            ],
          },
          {
            title: 'Danh mục sách',
            url: PATH.CATEGORIES,
            roles: [
              RoleEnums.PUBLISHER,
              RoleEnums.STORE_MANAGER,
              RoleEnums.STORE_OWNER,
            ],
          },
        ],
      },

      // STORE MANAGER MENUS
      {
        title: 'Quản lý cửa hàng',
        url: '#',
        icon: Store,
        isActive: checkActive([
          { url: PATH.STORE_HOURS },
          { url: PATH.INVENTORY },
        ]),
        roles: [RoleEnums.STORE_MANAGER, RoleEnums.STORE_OWNER],
        items: [
          {
            title: 'Giờ hoạt động',
            url: PATH.STORE_HOURS,
            roles: [RoleEnums.STORE_MANAGER, RoleEnums.STORE_OWNER],
          },
          {
            title: 'Quản lý tồn kho',
            url: PATH.INVENTORY,
            roles: [RoleEnums.STORE_MANAGER, RoleEnums.STORE_OWNER],
          },
          {
            title: 'Quản lý đơn hàng',
            url: PATH.ORDERS,
            roles: [RoleEnums.STORE_MANAGER, RoleEnums.STORE_OWNER],
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
        roles: [RoleEnums.ADMIN, RoleEnums.PUBLISHER],
      },
      {
        name: 'Store Dashboard',
        url: PATH.STORE_OWNER_DASHBOARD,
        icon: PieChart,
        roles: [
          RoleEnums.ADMIN,
          RoleEnums.STORE_OWNER,
          RoleEnums.STORE_MANAGER,
        ],
      },
      {
        name: 'Dự đoán lượng khách',
        url: '#',
        icon: ChartNoAxesCombined,
        roles: [RoleEnums.ADMIN],
      },
      {
        name: 'Khuyến nghị khách',
        url: '#',
        icon: Users,
        roles: [RoleEnums.ADMIN],
      },
    ],
  };

  // Filter menu items based on user roles
  const filteredNavMain = useMemo(() => {
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
  const filteredProjects = useMemo(() => {
    if (isLoading) return [];

    return menuData.projects.filter(
      (project) => !project.roles || hasRole(project.roles)
    );
  }, [menuData.projects, hasRole, isLoading]);

  return (
    <Sidebar collapsible='icon' {...props}>
      <SidebarHeader>
        <TeamSwitcher />
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
