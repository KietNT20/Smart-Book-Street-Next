'use client';

import { Button } from '@/components/ui/button';
import { Sort } from '@/enums/enums';
import { PATH } from '@/enums/path';
import { useGetBooks } from '@/hooks/use-book-search';
import { BookSearchCriteria } from '@/types/book-types';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import BookSearchFilter from './_components/book-search-filter';
import BookTable from './_components/book-table';

export default function BooksPage() {
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortField, setSortField] = useState<string>('');
  const [sortOrder, setSortOrder] = useState<Sort>(Sort.DESC);

  const [filters, setFilters] = useState<BookSearchCriteria>({});
  const [isSearching, setIsSearching] = useState(false);

  const buildResultObject = () => {
    if (!isSearching) return {};

    const result: Record<string, unknown> = {};

    Object.entries(filters).forEach(([key, value]) => {
      // Handle empty strings
      if (typeof value === 'string' && value.trim() !== '') {
        result[key] = value;
      }
      // Handle price ranges
      else if (key === 'minPrice' || key === 'maxPrice') {
        if (value !== undefined) {
          result[key] = value;
        }
      }
      // Handle arrays (languages and categories)
      else if (Array.isArray(value) && value.length > 0) {
        result[key] = value;
      }
      // Handle dates
      else if (value !== null && (key === 'startDate' || key === 'endDate')) {
        result[key] = value;
      }
    });

    return result;
  };

  const {
    booksData,
    isLoading: isLoadingBooks,
    totalPage,
  } = useGetBooks({
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
    const hasActiveFilter = Object.values(filters).some((value) => {
      if (typeof value === 'string') return value && value.trim() !== '';
      if (Array.isArray(value)) return value.length > 0;
      if (typeof value === 'number') return value !== undefined;
      return value !== null && value !== undefined;
    });

    setIsSearching(hasActiveFilter);
    setPageNumber(1); // Reset to first page when searching
  };

  const clearSearch = () => {
    setFilters({});
    setIsSearching(false);
    setPageNumber(1); // Reset to first page when clearing search
  };

  return (
    <div className='space-y-4'>
      <div className='flex items-center justify-between'>
        <h3 className='text-2xl font-bold'>Danh sách sách</h3>
        <Link href={PATH.BOOK_CREATE} passHref>
          <Button>
            <Plus className='mr-2' /> Thêm sách
          </Button>
        </Link>
      </div>

      <BookSearchFilter
        filters={filters}
        setFilters={setFilters}
        isSearching={isSearching}
        onSearch={handleSearch}
        onClearSearch={clearSearch}
      />

      <BookTable
        books={booksData || []}
        isLoading={isLoadingBooks}
        totalPages={totalPage || 1}
        pageNumber={pageNumber}
        setPageNumber={setPageNumber}
        pageSize={pageSize}
        setPageSize={setPageSize}
        sortField={sortField}
        sortOrder={sortOrder}
        handleSort={handleSort}
        isSearching={isSearching}
      />
    </div>
  );
}
