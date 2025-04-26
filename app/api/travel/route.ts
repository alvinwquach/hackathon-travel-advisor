import { NextResponse } from 'next/server';
import { TravelAgent } from '@/app/services/travelAgent';
import { TravelPreferences } from '@/app/types/travel';
import type { ItineraryFeedback } from '@/app/types/travel';

// Bypass authentication for testing
export const dynamic = 'force-dynamic';
export const runtime = 'edge';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, preferences, itinerary, feedback } = body;

    switch (action) {
      case 'generate_itinerary': {
        if (!preferences) {
          return NextResponse.json(
            { error: 'Travel preferences are required' },
            { status: 400 }
          );
        }

        const travelAgent = new TravelAgent(preferences as TravelPreferences);
        const generatedItinerary = await travelAgent.generateItinerary();
        
        return NextResponse.json({ itinerary: generatedItinerary });
      }

      case 'get_feedback': {
        if (!itinerary || !feedback) {
          return NextResponse.json(
            { error: 'Itinerary and feedback are required' },
            { status: 400 }
          );
        }

        const travelAgent = new TravelAgent(preferences as TravelPreferences);
        const updatedItinerary = await travelAgent.getItineraryFeedback(
          itinerary,
          feedback as ItineraryFeedback
        );

        return NextResponse.json({ itinerary: updatedItinerary });
      }

      case 'simulate_bookings': {
        if (!itinerary) {
          return NextResponse.json(
            { error: 'Itinerary is required' },
            { status: 400 }
          );
        }

        const travelAgent = new TravelAgent(preferences as TravelPreferences);
        const bookings = await travelAgent.simulateBookings(itinerary);

        return NextResponse.json({ bookings });
      }

      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 