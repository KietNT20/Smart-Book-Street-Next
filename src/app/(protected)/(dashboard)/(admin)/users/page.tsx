'use client';

import { Button } from '@/components/ui/button';
import { Sort } from '@/enums/enums';
import { PATH } from '@/enums/path';
import { useUsersParams } from '@/hooks/use-user';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import UserFilter from './_components/user-filter';
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
    <div className='container mx-auto py-10'>
      <div className='mb-4 flex items-center justify-between'>
        <h2 className='text-2xl font-bold'>Quản lý tài khoản</h2>
        <Link href={PATH.USER_CREATE} passHref>
          <Button>
            <Plus /> Thêm tài khoản mới
          </Button>
        </Link>
      </div>

      <UserFilter
        filters={filters}
        setFilters={setFilters}
        isSearching={isSearching}
        onSearch={handleSearch}
        onClearSearch={clearSearch}
      />

      <UserTable
        users={users}
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
    </div>
  );
}
