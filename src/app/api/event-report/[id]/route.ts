import { eventRegistrationService } from '@/services/eventRegistrationService';
import { eventService } from '@/services/eventService';
import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const eventId = params.id;

    // Get event details and registration statistics in parallel
    const [eventDetails, registrationStats] = await Promise.all([
      eventService.getEventById(eventId),
      eventRegistrationService.statistic(eventId),
    ]);

    return NextResponse.json({
      event: eventDetails.result,
      registrationStats: registrationStats,
    });
  } catch (error) {
    console.error('Error fetching event details:', error);
    return NextResponse.json(
      { error: 'Failed to fetch event details' },
      { status: 500 }
    );
  }
}
