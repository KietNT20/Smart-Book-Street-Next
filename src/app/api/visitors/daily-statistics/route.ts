// app/api/visitors/daily-statistics/route.ts
import { personService } from '@/services/personService';
import { NextResponse } from 'next/server';

export interface DailyVisitorsStatistics {
  success: boolean;
  data: {
    date: string;
    male: number;
    female: number;
  }[];
}

export async function GET(request: Request) {
  // Extract query parameters using URL
  const { searchParams } = new URL(request.url);
  const startDate = searchParams.get('startDate');
  const endDate = searchParams.get('endDate');

  if (!startDate || !endDate) {
    return NextResponse.json(
      {
        success: false,
        data: [],
      } as DailyVisitorsStatistics,
      { status: 400 }
    );
  }

  try {
    const response = await personService.dailyVisitors({
      startDate,
      endDate,
    });

    const originalData = response;

    const transformedData: DailyVisitorsStatistics['data'] = [];

    for (const date in originalData.statistics) {
      const stats = originalData.statistics[date];

      transformedData.push({
        date,
        male: stats.male,
        female: stats.female,
      });
    }

    return NextResponse.json({
      success: true,
      data: transformedData,
    });
  } catch (error) {
    console.error('Error processing daily visitors data:', error);
    return NextResponse.json(
      {
        success: false,
        data: [],
      } as DailyVisitorsStatistics,
      { status: 500 }
    );
  }
}
