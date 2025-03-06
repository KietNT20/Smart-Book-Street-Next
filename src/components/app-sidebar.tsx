'use client';

import {
  AudioWaveform,
  Book,
  BookOpen,
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
import { PATH } from '@/enums/path';

// This is sample data.
const data = {
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
      isActive: true,
      items: [
        {
          title: 'Khu vực',
          url: '#'
        },
        {
          title: 'Nhà xuất bản',
          url: '#'
        },
        {
          title: 'Cửa hàng',
          url: '#'
        }
      ]
    },
    {
      title: 'Sách',
      url: '#',
      icon: Book,
      items: [
        {
          title: 'Quản lý',
          url: `${PATH.BOOKS}`
        },
        {
          title: 'Tác giả',
          url: `${PATH.AUTHORS}`
        },
        {
          title: 'Danh mục',
          url: `${PATH.CATEGORIES}`
        }
      ]
    },
    {
      title: 'Nhà xuất bản',
      url: '#',
      icon: BookOpen,
      items: [
        {
          title: 'Quản lý',
          url: '#'
        },
        {
          title: 'Get Started',
          url: '#'
        },
        {
          title: 'Tutorials',
          url: '#'
        },
        {
          title: 'Changelog',
          url: '#'
        }
      ]
    },
    {
      title: 'Cửa hàng',
      url: '#',
      icon: Store,
      items: [
        {
          title: 'General',
          url: '#'
        },
        {
          title: 'Team',
          url: '#'
        },
        {
          title: 'Billing',
          url: '#'
        },
        {
          title: 'Limits',
          url: '#'
        }
      ]
    }
  ],
  projects: [
    {
      name: 'Dashboard',
      url: PATH.DASHBOARD,
      icon: PieChart
    },
    {
      name: 'Statistics',
      url: PATH.STATISTICS,
      icon: ChartNoAxesCombined
    },

    {
      name: 'Visitors',
      url: '#',
      icon: Map
    }
  ]
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible='icon' {...props}>
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
