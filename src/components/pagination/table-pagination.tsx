import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { useIsMobile } from '@/hooks/use-mobile';
import { useMemo } from 'react';

interface Props {
  pageNumber: number;
  totalPages: number;
  setPageNumber: (page: number) => void;
}

const TablePagination = ({ pageNumber, totalPages, setPageNumber }: Props) => {
  const isMobile = useIsMobile();

  const paginationItems = useMemo(() => {
    // If the screen is mobile, do not show pagination items
    if (isMobile) {
      return [];
    }

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

    // If the total pages are more than 8, show the next pages
    if (totalPages > 8) {
      items.push(
        <PaginationItem key='ellipsis'>
          <PaginationEllipsis />
        </PaginationItem>
      );
    }

    // Display the last pages
    if (totalPages > 8) {
      const startLastPages = Math.max(totalPages - 4, 4);
      for (let i = startLastPages; i <= totalPages; i++) {
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
  }, [pageNumber, totalPages, setPageNumber, isMobile]);

  return (
    <Pagination className='m-0 flex items-center justify-end'>
      <PaginationContent className={isMobile ? 'gap-2' : ''}>
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

        {!isMobile && paginationItems}

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
