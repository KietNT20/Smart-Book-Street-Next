'use client';

import { RoleEnums } from '@/enums/role';
import { ChevronRight, type LucideIcon } from 'lucide-react';

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from '@/components/ui/sidebar';
import { useAuth } from '@/hooks/use-auth';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useMemo } from 'react';

type NavItemProps = {
  title: string;
  url: string;
  roles?: RoleEnums[];
};

type NavMainItemProps = {
  title: string;
  url: string;
  icon?: LucideIcon;
  isActive?: boolean;
  roles?: RoleEnums[];
  items?: NavItemProps[];
  disable?: boolean;
};

type Props = {
  items: NavMainItemProps[];
};

export function NavMain({ items }: Props) {
  const pathname = usePathname();
  const { hasRole, isLoading } = useAuth();

  // Filter items based on user role
  const filteredItems = useMemo(() => {
    if (isLoading) return [];

    return (
      items
        .filter((item) => !item.roles || hasRole(item.roles))
        .map((item) => ({
          ...item,
          items:
            item.items?.filter(
              (subItem) => !subItem.roles || hasRole(subItem.roles)
            ) || [],
        }))
        // Hide menus without submenus
        .filter((item) => item.items && item.items.length > 0)
    );
  }, [items, hasRole, isLoading]);

  if (isLoading || filteredItems.length === 0) {
    return null;
  }

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Quản lý</SidebarGroupLabel>
      <SidebarMenu>
        {filteredItems.map((item) => (
          <Collapsible
            key={item.title}
            asChild
            defaultOpen={item.isActive}
            className='group/collapsible'
          >
            <SidebarMenuItem>
              <CollapsibleTrigger asChild>
                <SidebarMenuButton tooltip={item.title}>
                  {item.icon && <item.icon />}
                  <span>{item.title}</span>
                  <ChevronRight className='ml-auto transition-transform duration-300 group-data-[state=open]/collapsible:rotate-90' />
                </SidebarMenuButton>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <SidebarMenuSub>
                  {item.items?.map((subItem) => (
                    <SidebarMenuSubItem
                      key={subItem.title}
                      className={cn(
                        item.disable && 'pointer-events-none opacity-50'
                      )}
                    >
                      <SidebarMenuSubButton asChild>
                        <Link href={subItem.url} passHref>
                          <span
                            className={cn(
                              pathname === subItem.url ? 'text-primary' : ''
                            )}
                          >
                            {subItem.title}
                          </span>
                        </Link>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  ))}
                </SidebarMenuSub>
              </CollapsibleContent>
            </SidebarMenuItem>
          </Collapsible>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
