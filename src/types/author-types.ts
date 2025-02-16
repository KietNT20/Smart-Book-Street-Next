export type Author = {
  id: string;
  authorName: string;
  dob?: Date | string;
  nationality?: string;
  biography?: string;
  images: any[];
};

export type AuthorPayload = Omit<Author, 'id'>;
