import { inventoryService } from '@/services/inventoryService';
import { BookNextjs } from '@/types/book-types';
import { NextRequest, NextResponse } from 'next/server';

export interface BooksNextResponse {
  books: BookNextjs[];
  total: number;
}

export async function GET(
  _request: NextRequest,
  { params }: { params: { storeId: string } }
) {
  try {
    const storeId = params.storeId;

    if (!storeId) {
      return NextResponse.json(
        { error: 'Store ID is required' },
        { status: 400 }
      );
    }

    const inventoriesResponse =
      await inventoryService.getBookByStoreId(storeId);

    const books = inventoriesResponse.results
      .filter((inventory) => inventory.book && inventory.book.id)
      .map((inventory) => {
        return {
          ...inventory.book,
          entityId: inventory.entityId,
          inventoryId: inventory.id,
          quantity: inventory.quantity,
          isInStock: inventory.isInStock,
        };
      });

    return NextResponse.json({
      books,
      total: books.length,
    });
  } catch (error: any) {
    console.error('Error fetching books by store ID:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch books' },
      { status: 500 }
    );
  }
}
