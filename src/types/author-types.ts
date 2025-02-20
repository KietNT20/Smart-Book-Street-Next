export type Author = {
  id: string;
  authorName: string;
  dob?: Date | string;
  nationality?: string;
  biography?: string;
  images: any[];
};

export type AuthorPayload = Omit<Author, 'id'>;

export type SearchPaginayionAuthor = {
  pageNumber: number;
  pageSize: number;
  sortField: string;
  sortOrder: number;
  result: {
    authorName?: string;
  };
};
