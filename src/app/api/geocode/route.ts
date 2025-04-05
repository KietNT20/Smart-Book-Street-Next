import { NextRequest, NextResponse } from 'next/server';

type GeocodeRequest = {
  address: string;
};

type GeocodeResponse =
  | {
      latitude: number;
      longitude: number;
      formattedAddress: string;
    }
  | {
      error: string;
    };

export async function POST(
  request: NextRequest
): Promise<NextResponse<GeocodeResponse>> {
  try {
    const { address } = (await request.json()) as GeocodeRequest;

    if (!address) {
      return NextResponse.json(
        { error: 'Vui lòng cung cấp địa chỉ' },
        { status: 400 }
      );
    }

    // Sử dụng Google Geocoding API
    const apiKey = process.env.GOOGLE_MAPS_API_KEY;
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}`;

    const response = await fetch(url);
    const data = await response.json();

    if (data.status !== 'OK') {
      return NextResponse.json(
        { error: 'Không thể xác định vị trí địa chỉ' },
        { status: 400 }
      );
    }

    const location = data.results[0].geometry.location;

    return NextResponse.json({
      latitude: location.lat,
      longitude: location.lng,
      formattedAddress: data.results[0].formatted_address
    });
  } catch (error) {
    console.error('Geocoding error:', error);
    return NextResponse.json(
      { error: 'Lỗi khi xác định vị trí địa chỉ' },
      { status: 500 }
    );
  }
}
