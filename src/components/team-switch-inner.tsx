import { STORAGE } from '@/constant/storage';
import { RoleEnums } from '@/enums/role';
import { StoreData } from '@/types/store-types';
import { Street } from '@/types/street-types';
import { UserStore } from '@/types/user-types';
import { getLocalStorageItem, setLocalStorageItem } from '@/utils/token';
import { ChevronsUpDown, Map, Store } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from './ui/sidebar';

function TeamSwitcherInner({
  streets,
  userStore,
  hasRole,
  isMobile,
  isLoadingStreets,
}: {
  streets: Street[];
  userStore: UserStore[];
  hasRole: (roles?: RoleEnums | RoleEnums[]) => boolean;
  isMobile: boolean;
  isLoadingStreets: boolean;
}) {
  // State initialization that doesn't depend on props
  const [activeStreet, setActiveStreet] = useState<Street | null>(null);
  const [activeStore, setActiveStore] = useState<StoreData | undefined>(
    undefined
  );
  const router = useRouter();

  // Initialize from localStorage only once after component is mounted
  useEffect(() => {
    if (streets.length > 0) {
      const savedStreetId = getLocalStorageItem(STORAGE.SELECTED_STREET_KEY);
      const savedStreet = savedStreetId
        ? streets.find((street) => street.id === savedStreetId)
        : null;
      if (savedStreet) {
        setActiveStreet(savedStreet);
      }
    }
  }, [streets]); // Only depend on streets array

  // Separate effect for store initialization
  useEffect(() => {
    if (
      hasRole([RoleEnums.STORE_OWNER, RoleEnums.STORE_MANAGER]) &&
      userStore.length > 0
    ) {
      const savedStoreId = getLocalStorageItem(STORAGE.SELECTED_STORE_KEY);
      const savedStore = savedStoreId
        ? userStore.find((store) => store.store?.id === savedStoreId)?.store
        : undefined;

      if (savedStore) {
        setActiveStore(savedStore);
      }
    }
  }, [userStore, hasRole]); // Only needed dependencies

  // Handle street selection
  const handleStreetSelect = (street: Street) => {
    setActiveStreet(street);
    setLocalStorageItem(STORAGE.SELECTED_STREET_KEY, street.id);

    // Dispatch custom event to notify other components
    window.dispatchEvent(new Event('teamSwitched'));
    router.refresh();
  };

  // Handle store selection
  const handleStoreSelect = (store: StoreData) => {
    if (!store) return;
    setActiveStore(store);
    setLocalStorageItem(STORAGE.SELECTED_STORE_KEY, store.id || '');

    // Dispatch custom event to notify other components
    window.dispatchEvent(new Event('teamSwitched'));
    router.refresh();
  };

  // If loading streets, show loading state
  if (isLoadingStreets) {
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

  // Check if the user has stores but hasn't selected one yet (used for UI emphasis)
  const showPleaseSelect =
    hasRole([RoleEnums.STORE_OWNER, RoleEnums.STORE_MANAGER]) &&
    userStore.length > 0 &&
    !activeStore;

  const showPleaseSelectStreet =
    hasRole([RoleEnums.ADMIN]) && streets.length > 0 && !activeStreet;

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          {hasRole(RoleEnums.ADMIN) && (
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton
                size='lg'
                className={`data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground ${
                  showPleaseSelectStreet
                    ? 'animate-pulse bg-sidebar-accent/10'
                    : ''
                }`}
              >
                <div className='flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground'>
                  <Map className='size-4' />
                </div>
                <div className='grid flex-1 text-left text-sm leading-tight'>
                  <span
                    className={`truncate font-semibold ${showPleaseSelectStreet ? 'text-primary' : ''}`}
                  >
                    {activeStreet?.streetName || 'Vui lòng chọn đường sách'}
                  </span>
                  <span className='truncate text-xs'>
                    {activeStreet?.address
                      ? activeStreet.address.split(',')[0]
                      : 'Chọn đường sách của bạn'}
                  </span>
                </div>
                <ChevronsUpDown className='ml-auto' />
              </SidebarMenuButton>
            </DropdownMenuTrigger>
          )}

          {hasRole([RoleEnums.STORE_OWNER, RoleEnums.STORE_MANAGER]) && (
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton
                size='lg'
                className={`data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground ${
                  showPleaseSelect ? 'animate-pulse bg-sidebar-accent/10' : ''
                }`}
              >
                <div className='flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground'>
                  <Store className='size-4' />
                </div>
                <div className='grid flex-1 text-left text-sm leading-tight'>
                  <span
                    className={`truncate font-semibold ${showPleaseSelect ? 'text-primary' : ''}`}
                  >
                    {activeStore?.storeName || 'Vui lòng chọn cửa hàng'}
                  </span>
                  <span className='truncate text-xs'>
                    {activeStore?.address
                      ? activeStore.address.split(',')[0]
                      : 'Chọn cửa hàng của bạn'}
                  </span>
                </div>
                <ChevronsUpDown className='ml-auto' />
              </SidebarMenuButton>
            </DropdownMenuTrigger>
          )}
          <DropdownMenuContent
            className='w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg'
            align='start'
            side={isMobile ? 'bottom' : 'right'}
            sideOffset={4}
          >
            <DropdownMenuLabel className='text-xs text-muted-foreground'>
              {hasRole(RoleEnums.ADMIN) ? 'Đường Sách' : 'Cửa Hàng'}
            </DropdownMenuLabel>
            {hasRole(RoleEnums.ADMIN) && (
              <>
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
              </>
            )}
            {hasRole([RoleEnums.STORE_OWNER, RoleEnums.STORE_MANAGER]) && (
              <>
                {userStore.map((storeItem, index) => (
                  <DropdownMenuItem
                    key={storeItem.store?.id}
                    onClick={() => {
                      if (storeItem?.store) {
                        handleStoreSelect(storeItem.store);
                      }
                    }}
                    className='gap-2 p-2'
                  >
                    <div className='flex size-6 items-center justify-center rounded-sm border'>
                      <Store className='size-4 shrink-0' />
                    </div>
                    {storeItem?.store?.storeName}
                    <DropdownMenuShortcut>⌘{index + 1}</DropdownMenuShortcut>
                  </DropdownMenuItem>
                ))}
              </>
            )}
            <DropdownMenuSeparator />
            {/* <DropdownMenuItem className='gap-2 p-2'>
              <div className='flex size-6 items-center justify-center rounded-md border bg-background'>
                <Plus className='size-4' />
              </div>
              <div className='font-medium text-muted-foreground'>Thêm</div>
            </DropdownMenuItem> */}
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}

export default TeamSwitcherInner;
