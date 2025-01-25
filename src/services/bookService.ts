import { API_ENDPOINT } from '@/constant/api-url';
import { Book } from '@/types/book-types';
import { PaginationSchema } from '@/types/common-types';
import axiosInstance from '@/utils/axiosInstance';

export async function getAllBooks() {
  const res = await axiosInstance.get(API_ENDPOINT.BOOKS.GET_ALL);
  return res.data;
}

export async function getAllBooksPagination({
  pageNumber,
  pageSize,
  sortField,
  sortOrder,
}: PaginationSchema) {
  const res = await axiosInstance.post(API_ENDPOINT.BOOKS.GET_ALL_PAGINATION, {
    pageNumber,
    pageSize,
    sortField,
    sortOrder,
  });
  return res.data;
}

export async function getBookById(bookId: string) {
  const res = await axiosInstance.get(
    `${API_ENDPOINT.BOOKS.GET_BY_ID}/${bookId}`
  );
  return res.data;
}

export async function searchBooks(payload: {
  pageNumber: number;
  pageSize: number;
  sortField: string;
  sortOrder: number;
  result: {
    code: string;
    title: string;
    publicationDate: string;
    price: number;
    languages: string;
    size: string;
    status: string;
  };
}) {
  const res = await axiosInstance.post(API_ENDPOINT.BOOKS.SEARCH, payload);
  return res.data;
}

export async function createBook(data: Book) {
  const res = await axiosInstance.post(API_ENDPOINT.BOOKS.ADD, data);
  return res.data;
}
