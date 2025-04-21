import { inventoryService } from '@/services/inventoryService';
import { SouvenirNextjs } from '@/types/souvenir-types';
import { NextRequest, NextResponse } from 'next/server';

export interface SouvenirsNextResponse {
  souvenirs: SouvenirNextjs[];
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
      await inventoryService.getSouvenirByStoreId(storeId);

    const souvenirs = inventoriesResponse.results
      .filter((inventory) => inventory.souvenir)
      .map((inventory) => {
        return {
          ...inventory.souvenir,
          entityId: inventory.entityId,
          inventoryId: inventory.id,
          quantity: inventory.quantity,
          isInStock: inventory.isInStock,
        };
      });

    return NextResponse.json({
      souvenirs,
      total: souvenirs.length,
    });
  } catch (error: any) {
    console.error('Error fetching souvenirs by store ID:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch souvenirs' },
      { status: 500 }
    );
  }
}
