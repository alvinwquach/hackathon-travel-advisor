import { TravelPreferences, TravelItinerary, BookingSimulation } from '../types/travel';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export class TravelAgent {
  private preferences: TravelPreferences;

  constructor(preferences: TravelPreferences) {
    this.preferences = preferences;
  }

  private async generatePrompt(): Promise<string> {
    return `You are a highly personalized AI Travel Advisor.
Based on the following preferences, create a detailed travel itinerary:

Destination: ${this.preferences.destination}
Travel Dates: ${this.preferences.travelDates.arrival} to ${this.preferences.travelDates.departure}

Personal Preferences:
- Likes: ${this.preferences.personalPreferences.activities.likes.join(', ')}
- Dislikes: ${this.preferences.personalPreferences.activities.dislikes.join(', ')}
- Dietary Restrictions: ${this.preferences.personalPreferences.dietaryRestrictions.map(d => d.type).join(', ')}
- Energy Level: ${this.preferences.personalPreferences.energyLevel}
- Travel Pace: ${this.preferences.personalPreferences.travelPace}
- Budget: ${this.preferences.personalPreferences.budget.amount} ${this.preferences.personalPreferences.budget.currency} (${this.preferences.personalPreferences.budget.type})

Hotel Preferences:
- Type: ${this.preferences.hotelPreferences.type}
- Loyalty Programs: ${this.preferences.hotelPreferences.loyaltyPrograms?.join(', ') || 'None'}
- Room Preferences: ${this.preferences.hotelPreferences.roomPreferences?.join(', ') || 'None'}

Flight Preferences:
- Class: ${this.preferences.flightPreferences.class}
- Airline Memberships: ${this.preferences.flightPreferences.airlineMemberships?.join(', ') || 'None'}
- Seat Preferences: ${this.preferences.flightPreferences.seatPreferences?.join(', ') || 'None'}

Transportation Preferences:
- Preferred Methods: ${this.preferences.transportationPreferences.preferredMethods.join(', ')}
- Comfort vs Cost: ${this.preferences.transportationPreferences.comfortVsCost}

Other Info:
- Weather Sensitivity: ${this.preferences.otherInfo.weatherSensitivity || 'None'}
- Packing Help Needed: ${this.preferences.otherInfo.packingHelpNeeded ? 'Yes' : 'No'}

Please create a detailed day-by-day itinerary including:
1. Daily activities with times and locations
2. Restaurant recommendations that match dietary needs
3. Transportation methods between locations
4. Estimated costs for each activity
5. Weather forecast for the travel dates
6. Packing suggestions based on activities and weather

Format the response as a JSON object matching the TravelItinerary type with the following structure:
{
  "traveler": {
    "destination": string,
    "travelDates": {
      "start": string,
      "end": string
    },
    "preferences": {
      "likes": string[],
      "dislikes": string[],
      "dietaryRestrictions": string,
      "energyLevel": string,
      "travelPace": string,
      "budget": number,
      "hotelPreferences": {
        "type": string,
        "roomPreferences": string[]
      },
      "flightPreferences": {
        "class": string,
        "seatPreferences": string
      },
      "transportationPreferences": {
        "preferredMethods": string[],
        "comfortVsCost": string
      },
      "weatherSensitivity": string,
      "packingHelpNeeded": boolean
    }
  },
  "itinerary": [
    {
      "date": string,
      "weather": string,
      "activities": [
        {
          "time": string,
          "activity": string,
          "location": string,
          "cost": string,
          "transportation": string
        }
      ]
    }
  ],
  "packingList": string[],
  "budgetBreakdown": {
    "Hotel": string,
    "Dining": string,
    "Activities": string,
    "Transportation": string,
    "Miscellaneous": string,
    "Total Estimated Cost": string
  }
}`;
  }

  async generateItinerary(): Promise<TravelItinerary> {
    try {
      const prompt = await this.generatePrompt();
      
      const completion = await openai.chat.completions.create({
        messages: [
          { role: "system", content: "You are a highly personalized AI Travel Advisor that creates detailed travel itineraries." },
          { role: "user", content: prompt }
        ],
        model: "gpt-4-turbo-preview",
        response_format: { type: "json_object" },
      });

      const response = completion.choices[0].message.content;
      if (!response) {
        throw new Error('No response from AI');
      }

      return JSON.parse(response) as TravelItinerary;
    } catch (error) {
      console.error('Error generating itinerary:', error);
      throw error;
    }
  }

  async simulateBookings(itinerary: TravelItinerary): Promise<BookingSimulation> {
    try {
      const prompt = `Based on the following itinerary, simulate flight and hotel bookings:

Destination: ${itinerary.traveler.destination}
Dates: ${itinerary.traveler.travelDates.start} to ${itinerary.traveler.travelDates.end}

Flight Preferences:
- Class: ${this.preferences.flightPreferences.class}
- Airline Memberships: ${this.preferences.flightPreferences.airlineMemberships?.join(', ') || 'None'}

Hotel Preferences:
- Type: ${this.preferences.hotelPreferences.type}
- Loyalty Programs: ${this.preferences.hotelPreferences.loyaltyPrograms?.join(', ') || 'None'}

Please simulate:
1. Flight bookings (including loyalty points if applicable)
2. Hotel bookings (including loyalty points if applicable)
3. Total cost and estimated savings

Format the response as a JSON object with the following structure:
{
  "flights": [
    {
      "airline": string,
      "flightNumber": string,
      "departure": {
        "airport": string,
        "time": string
      },
      "arrival": {
        "airport": string,
        "time": string
      },
      "class": string,
      "price": number,
      "loyaltyPoints": number
    }
  ],
  "hotels": [
    {
      "name": string,
      "type": string,
      "checkIn": string,
      "checkOut": string,
      "roomType": string,
      "price": number,
      "loyaltyPoints": number
    }
  ],
  "totalCost": number,
  "estimatedSavings": number
}`;

      const completion = await openai.chat.completions.create({
        messages: [
          { role: "system", content: "You are a travel booking simulation system that creates realistic booking scenarios." },
          { role: "user", content: prompt }
        ],
        model: "gpt-4-turbo-preview",
        response_format: { type: "json_object" },
      });

      const response = completion.choices[0].message.content;
      if (!response) {
        throw new Error('No response from AI');
      }

      return JSON.parse(response) as BookingSimulation;
    } catch (error) {
      console.error('Error simulating bookings:', error);
      throw error;
    }
  }

  async getItineraryFeedback(itinerary: TravelItinerary, userFeedback: string): Promise<TravelItinerary> {
    try {
      const prompt = `The user has provided feedback on their travel itinerary. Please modify the itinerary based on this feedback:

Original Itinerary:
${JSON.stringify(itinerary, null, 2)}

User Feedback:
${userFeedback}

Please create an updated itinerary that addresses the user's feedback while maintaining the original preferences and constraints.

Format the response as a JSON object matching the TravelItinerary type.`;

      const completion = await openai.chat.completions.create({
        messages: [
          { role: "system", content: "You are a travel itinerary modification system that adjusts plans based on user feedback." },
          { role: "user", content: prompt }
        ],
        model: "gpt-4-turbo-preview",
        response_format: { type: "json_object" },
      });

      const response = completion.choices[0].message.content;
      if (!response) {
        throw new Error('No response from AI');
      }

      return JSON.parse(response) as TravelItinerary;
    } catch (error) {
      console.error('Error getting itinerary feedback:', error);
      throw error;
    }
  }
} 