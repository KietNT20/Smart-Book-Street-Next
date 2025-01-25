import { imageService } from '@/services/imageService';
import { ImagePayload } from '@/types/image-types';
import { NextResponse } from 'next/server';

interface UploadImageRequest {
  url: string;
  filename: string;
}

export async function POST(request: Request) {
  try {
    const { url, filename } = (await request.json()) as UploadImageRequest;

    if (!url || !filename) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const imagePayload: ImagePayload[] = [
      {
        url,
        type: 'image',
        altText: filename,
        entityId: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
      },
    ];

    const { data } = await imageService.add(imagePayload);

    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Server error:', error);
    return NextResponse.json(
      {
        error: error.response?.data?.message || 'Internal server error',
      },
      { status: error.response?.status || 500 }
    );
  }
}
