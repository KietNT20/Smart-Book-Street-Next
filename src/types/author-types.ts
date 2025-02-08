export type AuthorPayload = {
  AuthorName: string;
  DOB?: Date | string;
  Nationality?: string;
  Biography?: string;
};

export interface Author extends AuthorPayload {
  id: string;
  images: any[];
}
