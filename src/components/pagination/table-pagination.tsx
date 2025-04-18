import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { useMemo } from 'react';

interface Props {
  pageNumber: number;
  totalPages: number;
  setPageNumber: (page: number) => void;
}

const TablePagination = ({ pageNumber, totalPages, setPageNumber }: Props) => {
  const paginationItems = useMemo(() => {
    const items = [];

    // Display the first 3 pages
    const showFirstPages = Math.min(3, totalPages);
    for (let i = 1; i <= showFirstPages; i++) {
      items.push(
        <PaginationItem key={`first-${i}`}>
          <PaginationLink
            href='#'
            onClick={(e) => {
              e.preventDefault();
              setPageNumber(i);
            }}
            isActive={pageNumber === i}
          >
            {i}
          </PaginationLink>
        </PaginationItem>
      );
    }

    // If totalPages > 3, show the 4th page and ellipsis if totalPages > 8
    if (totalPages > 8) {
      items.push(
        <PaginationItem key='ellipsis'>
          <PaginationEllipsis />
        </PaginationItem>
      );
    }

    // Display all pages from 4 to totalPages - 4 if totalPages > 8
    if (totalPages > 8) {
      const startLastPages = Math.max(totalPages - 4, 4);
      for (let i = startLastPages; i <= totalPages; i++) {
        // Not display the last 3 pages if total pages <= 8
        if (i > 3) {
          items.push(
            <PaginationItem key={`last-${i}`}>
              <PaginationLink
                href='#'
                onClick={(e) => {
                  e.preventDefault();
                  setPageNumber(i);
                }}
                isActive={pageNumber === i}
              >
                {i}
              </PaginationLink>
            </PaginationItem>
          );
        }
      }
    } else if (totalPages > 3) {
      // If total pages <= 8 and > 3, show the remaining pages after the first 3
      for (let i = 4; i <= totalPages; i++) {
        items.push(
          <PaginationItem key={`middle-${i}`}>
            <PaginationLink
              href='#'
              onClick={(e) => {
                e.preventDefault();
                setPageNumber(i);
              }}
              isActive={pageNumber === i}
            >
              {i}
            </PaginationLink>
          </PaginationItem>
        );
      }
    }

    return items;
  }, [pageNumber, totalPages, setPageNumber]);

  return (
    <Pagination className='m-0 flex items-center justify-end'>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href='#'
            onClick={(e) => {
              e.preventDefault();
              if (pageNumber > 1) {
                setPageNumber(pageNumber - 1);
              }
            }}
            className={pageNumber <= 1 ? 'pointer-events-none opacity-50' : ''}
          />
        </PaginationItem>

        {paginationItems}

        <PaginationItem>
          <PaginationNext
            href='#'
            onClick={(e) => {
              e.preventDefault();
              if (pageNumber < totalPages) {
                setPageNumber(pageNumber + 1);
              }
            }}
            className={
              pageNumber >= totalPages ? 'pointer-events-none opacity-50' : ''
            }
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};

export default TablePagination;
