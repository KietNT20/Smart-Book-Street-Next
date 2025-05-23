'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Sort } from '@/enums/enums';
import { PATH } from '@/enums/path';
import { useUsersParams } from '@/hooks/use-user';
import { useRolePending } from '@/hooks/use-user-roles';
import { Plus, ShieldCheck, UserPlus } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import UserFilter from './_components/user-filter';
import PendingRoleRequests from './_components/user-role-requests';
import UserTable from './_components/user-table';

export interface SearchFilters {
  userName?: string;
  email?: string;
  fullName?: string;
  dob?: string;
  address?: string;
  phone?: string;
  gender?: string;
}

export default function UsersPage() {
  const [activeTab, setActiveTab] = useState('users');
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortField, setSortField] = useState<string>('');
  const [sortOrder, setSortOrder] = useState<Sort>(Sort.DESC);
  const [filters, setFilters] = useState<SearchFilters>({
    userName: '',
    email: '',
    fullName: '',
    phone: '',
    dob: '',
    address: '',
    gender: '',
  });
  const [isSearching, setIsSearching] = useState(false);

  const buildResultObject = () => {
    if (!isSearching) return {};

    const result: SearchFilters = {};
    Object.entries(filters).forEach(([key, value]) => {
      if (value && value.trim() !== '') {
        result[key as keyof SearchFilters] = value;
      }
    });

    return result;
  };

  const { users, usersLoading, totalPage } = useUsersParams({
    pageNumber,
    pageSize,
    sortField,
    sortOrder,
    result: buildResultObject(),
  });
  const { totalRecords } = useRolePending();

  const filteredUsersData = users.filter((user) =>
    user.userRoles.some((userRole) => userRole.isApproved === true)
  );

  const handleSort = (field: string) => {
    if (field === sortField) {
      setSortOrder(sortOrder === Sort.ASC ? Sort.DESC : Sort.ASC);
    } else {
      setSortField(field);
      setSortOrder(Sort.ASC);
    }
  };

  const handleSearch = () => {
    const hasActiveFilter = Object.values(filters).some(
      (value) => value && value.trim() !== ''
    );

    setIsSearching(hasActiveFilter);
  };

  const clearSearch = () => {
    setFilters({
      userName: '',
      email: '',
      fullName: '',
      phone: '',
      dob: '',
      address: '',
      gender: '',
    });
    setIsSearching(false);
  };

  return (
    <div className='container mx-auto'>
      <div className='mb-4 flex items-center justify-between'>
        <h2 className='text-2xl font-bold'>Quản lý tài khoản</h2>
        <Link href={PATH.USER_CREATE} passHref>
          <Button>
            <Plus className='mr-2 h-4 w-4' /> Thêm tài khoản mới
          </Button>
        </Link>
      </div>

      <Tabs
        defaultValue='users'
        value={activeTab}
        onValueChange={setActiveTab}
        className='mb-6'
      >
        <TabsList className='mb-6 grid w-full grid-cols-2'>
          <TabsTrigger value='users' className='flex items-center gap-2'>
            <UserPlus className='h-4 w-4' /> Danh sách tài khoản
          </TabsTrigger>
          <TabsTrigger value='roles' className='flex items-center gap-2'>
            <ShieldCheck className='h-4 w-4' /> Phân quyền{' '}
            <Badge variant={'outline'}>{totalRecords}</Badge>
          </TabsTrigger>
        </TabsList>

        <TabsContent value='users' className='h-full w-full space-y-4'>
          <UserFilter
            filters={filters}
            setFilters={setFilters}
            isSearching={isSearching}
            onSearch={handleSearch}
            onClearSearch={clearSearch}
          />

          <UserTable
            users={filteredUsersData}
            isLoading={usersLoading}
            isSearching={isSearching}
            totalPages={totalPage || 1}
            pageNumber={pageNumber}
            setPageNumber={setPageNumber}
            pageSize={pageSize}
            setPageSize={setPageSize}
            sortField={sortField}
            sortOrder={sortOrder}
            handleSort={handleSort}
          />
        </TabsContent>

        <TabsContent value='roles'>
          <PendingRoleRequests />
        </TabsContent>
      </Tabs>
    </div>
  );
}
