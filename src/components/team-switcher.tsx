'use client';

import { ChevronsUpDown, Map, Plus } from 'lucide-react';
import * as React from 'react';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';
import { useGetStreetsAll } from '@/hooks/use-street';
import { Street } from '@/types/street-types';

// Local storage key for selected street
const SELECTED_STREET_KEY = 'selected-street-id';

export function TeamSwitcher() {
  const { isMobile } = useSidebar();
  const { streetsRes, isLoadingStreets } = useGetStreetsAll();

  // Use useMemo to memoize the streets array
  const streets = React.useMemo(() => streetsRes || [], [streetsRes]);

  // Initialize with first street or from local storage
  const [activeStreet, setActiveStreet] = React.useState<Street | null>(null);

  // Load the selected street from local storage on component mount
  React.useEffect(() => {
    if (streets.length > 0) {
      const savedStreetId = localStorage.getItem(SELECTED_STREET_KEY);
      const savedStreet = savedStreetId
        ? streets.find((street) => street.id === savedStreetId)
        : null;

      setActiveStreet(savedStreet || streets[0]);
    }
  }, [streets]);

  // Handle street selection
  const handleStreetSelect = (street: Street) => {
    setActiveStreet(street);
    localStorage.setItem(SELECTED_STREET_KEY, street.id);
  };

  // If still loading or no active street yet, show loading state
  if (isLoadingStreets || !activeStreet) {
    return (
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton size='lg'>
            <div className='flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground'>
              <Map className='size-4' />
            </div>
            <div className='grid flex-1 text-left text-sm leading-tight'>
              <span className='truncate font-semibold'>Loading...</span>
              <span className='truncate text-xs'>Please wait</span>
            </div>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    );
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size='lg'
              className='data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground'
            >
              <div className='flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground'>
                <Map className='size-4' />
              </div>
              <div className='grid flex-1 text-left text-sm leading-tight'>
                <span className='truncate font-semibold'>
                  {activeStreet.streetName}
                </span>
                <span className='truncate text-xs'>
                  {activeStreet.address.split(',')[0]}
                </span>
              </div>
              <ChevronsUpDown className='ml-auto' />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className='w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg'
            align='start'
            side={isMobile ? 'bottom' : 'right'}
            sideOffset={4}
          >
            <DropdownMenuLabel className='text-xs text-muted-foreground'>
              Streets
            </DropdownMenuLabel>
            {streets.map((street, index) => (
              <DropdownMenuItem
                key={street.id}
                onClick={() => handleStreetSelect(street)}
                className='gap-2 p-2'
              >
                <div className='flex size-6 items-center justify-center rounded-sm border'>
                  <Map className='size-4 shrink-0' />
                </div>
                {street.streetName}
                <DropdownMenuShortcut>⌘{index + 1}</DropdownMenuShortcut>
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem className='gap-2 p-2'>
              <div className='flex size-6 items-center justify-center rounded-md border bg-background'>
                <Plus className='size-4' />
              </div>
              <div className='font-medium text-muted-foreground'>
                Add street
              </div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
