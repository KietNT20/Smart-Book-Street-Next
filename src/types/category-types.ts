export type Category = {
  id: string;
  categoryName: string;
  description: string;
  isDeleted?: boolean;
};

export type SearchPaginationCategory = {
  pageNumber: number;
  pageSize: number;
  sortField: string;
  sortOrder: -1 | 0 | 1;
  result: {
    categoryName: string;
  };
};
