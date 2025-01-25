'use client';
import { useGetAllBooks } from '@/hooks/use-books';
import { columns } from './columns';
import { DataTable } from './data-table';

export default function BooksPage() {
  const { data, isLoading } = useGetAllBooks();

  const books = data?.results || [];

  return (
    <div className="container mx-auto py-10">
      <DataTable columns={columns} data={books} isLoading={isLoading} />
    </div>
  );
}
