'use client';

import {
  AudioWaveform,
  Book,
  BookOpen,
  Command,
  Frame,
  GalleryVerticalEnd,
  LibraryBig,
  Map,
  PieChart,
  Settings2,
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
import { PATH } from '@/constant/path';

// This is sample data.
const data = {
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
    {
      title: 'Đường sách',
      url: '#',
      icon: LibraryBig,
      isActive: true,
      items: [
        {
          title: 'Thông tin',
          url: '#',
        },
        {
          title: 'Khu vực',
          url: '#',
        },
        {
          title: 'Kiosks',
          url: '#',
        },
      ],
    },
    {
      title: 'Sách',
      url: '#',
      icon: Book,
      items: [
        {
          title: 'Danh sách',
          url: `${PATH.BOOKS}`,
        },
        {
          title: 'Thương hiệu',
          url: `${PATH.BOOKS}/brands`,
        },
        {
          title: 'Cửa hàng',
          url: `${PATH.BOOKS}/stores`,
        },
      ],
    },
    {
      title: 'Documentation',
      url: '#',
      icon: BookOpen,
      items: [
        {
          title: 'Introduction',
          url: '#',
        },
        {
          title: 'Get Started',
          url: '#',
        },
        {
          title: 'Tutorials',
          url: '#',
        },
        {
          title: 'Changelog',
          url: '#',
        },
      ],
    },
    {
      title: 'Settings',
      url: '#',
      icon: Settings2,
      items: [
        {
          title: 'General',
          url: '#',
        },
        {
          title: 'Team',
          url: '#',
        },
        {
          title: 'Billing',
          url: '#',
        },
        {
          title: 'Limits',
          url: '#',
        },
      ],
    },
  ],
  projects: [
    {
      name: 'Dashboard',
      url: '/dashboard',
      icon: PieChart,
    },
    {
      name: 'Design Engineering',
      url: '#',
      icon: Frame,
    },

    {
      name: 'Travel',
      url: '#',
      icon: Map,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavProjects projects={data.projects} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
