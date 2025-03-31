import { Book, BookSearchCriteria } from '@/types/book-types';
import { useState } from 'react';
import { BookTableState } from '../data-table';

type ModalState = {
  type: 'none' | 'form' | 'search';
};

export function useBookPageState() {
  const [pagination, setPagination] = useState<BookTableState>({
    pageIndex: 1,
    pageSize: 10,
    sortField: 'lastUpdatedDate',
    sortOrder: -1
  });

  const [searchCriteria, setSearchCriteria] = useState<
    Partial<BookSearchCriteria>
  >({});
  const [modalState, setModalState] = useState<ModalState>({ type: 'none' });
  const [selectedBook, setSelectedBook] = useState<Book | undefined>();
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const resetAllFilters = () => {
    setPagination({
      pageIndex: 1,
      pageSize: 10,
      sortField: 'lastUpdatedDate',
      sortOrder: -1
    });
    setSearchCriteria({});
  };

  return {
    pagination,
    setPagination,
    searchCriteria,
    setSearchCriteria,
    modalState,
    setModalState,
    selectedBook,
    setSelectedBook,
    deleteId,
    setDeleteId,
    resetAllFilters
  };
}
