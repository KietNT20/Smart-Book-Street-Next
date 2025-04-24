'use client';

import { Sort } from '@/enums/enums';
import { Book, BookSearchCriteria } from '@/types/book-types';
import { useState } from 'react';
import { BookTableState } from '../data-table';

export function useBookPageState() {
  const [pagination, setPagination] = useState<BookTableState>({
    pageIndex: 1,
    pageSize: 10,
    sortField: '',
    sortOrder: Sort.DESC,
  });

  const [searchCriteria, setSearchCriteria] = useState<
    Partial<BookSearchCriteria>
  >({});
  const [selectedBook, setSelectedBook] = useState<Book | undefined>();

  const resetAllFilters = () => {
    setPagination({
      pageIndex: 1,
      pageSize: 10,
      sortField: '',
      sortOrder: Sort.DESC,
    });
    setSearchCriteria({});
  };

  return {
    pagination,
    setPagination,
    searchCriteria,
    setSearchCriteria,
    selectedBook,
    setSelectedBook,
    resetAllFilters,
  };
}
