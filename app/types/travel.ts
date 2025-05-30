export type ActivityPreference = {
  likes: string[];
  dislikes: string[];
};

export type DietaryRestriction = {
  type: string;
  details?: string;
};

export type HotelPreference = {
  type: string;
  loyaltyPrograms?: string[];
  roomPreferences?: string[];
};

export type FlightPreference = {
  class: string;
  airlineMemberships?: string[];
  seatPreferences?: string[];
};

export type TransportationPreference = {
  preferredMethods: string[];
  comfortVsCost: 'comfort' | 'cost';
};

export type TravelPreferences = {
  destination: string;
  travelDates: {
    arrival: string;
    departure: string;
  };
  personalPreferences: {
    activities: ActivityPreference;
    dietaryRestrictions: DietaryRestriction[];
    energyLevel: 'relaxed' | 'balanced' | 'busy';
    travelPace: 'lots of rest' | 'packed schedule';
    budget: {
      type: 'total' | 'per-day';
      amount: number;
      currency: string;
    };
  };
  hotelPreferences: HotelPreference;
  flightPreferences: FlightPreference;
  transportationPreferences: TransportationPreference;
  otherInfo: {
    weatherSensitivity?: string;
    packingHelpNeeded: boolean;
  };
};

// Form-specific types
export type TravelPreferencesForm = {
  destination: string;
  travelDates: {
    arrival: string;
    departure: string;
  };
  personalPreferences: {
    activities: {
      likes: string[];
      dislikes: string[];
    };
    dietaryRestrictions: DietaryRestriction[];
    energyLevel: 'relaxed' | 'balanced' | 'busy';
    travelPace: 'lots of rest' | 'packed schedule';
    budget: {
      type: 'total' | 'per-day';
      amount: number;
      currency: string;
    };
  };
  hotelPreferences?: HotelPreference;
  flightPreferences?: FlightPreference;
  transportationPreferences?: TransportationPreference;
  otherInfo?: {
    weatherSensitivity?: string;
    packingHelpNeeded: boolean;
  };
};

export type ItineraryItem = {
  day: number;
  date: string;
  activities: {
    time: string;
    description: string;
    location: string;
    cost?: number;
  }[];
  meals: {
    time: string;
    restaurant: string;
    cuisine: string;
    dietaryNotes?: string;
  }[];
  transportation: {
    method: string;
    from: string;
    to: string;
    cost?: number;
  }[];
};

export type TravelItinerary = {
  traveler: {
    destination: string;
    travelDates: {
      start: string;
      end: string;
    };
    preferences: {
      likes: string[];
      dislikes: string[];
      dietaryRestrictions: string;
      energyLevel: string;
      travelPace: string;
      budget: number;
      hotelPreferences: {
        type: string;
        roomPreferences: string[];
      };
      flightPreferences: {
        class: string;
        seatPreferences: string;
      };
      transportationPreferences: {
        preferredMethods: string[];
        comfortVsCost: string;
      };
      weatherSensitivity: string;
      packingHelpNeeded: boolean;
    };
  };
  itinerary: {
    date: string;
    weather: string;
    activities: {
      time: string;
      activity: string;
      location?: string;
      cost: string;
      transportation: string;
    }[];
  }[];
  packingList: string[];
  budgetBreakdown: {
    Hotel: string;
    Dining: string;
    Activities: string;
    Transportation: string;
    Miscellaneous: string;
    "Total Estimated Cost": string;
  };
};

export type BookingSimulation = {
  flights: {
    airline: string;
    flightNumber: string;
    departure: {
      airport: string;
      time: string;
    };
    arrival: {
      airport: string;
      time: string;
    };
    class: string;
    price: number;
    loyaltyPoints?: number;
  }[];
  hotels: {
    name: string;
    type: string;
    checkIn: string;
    checkOut: string;
    roomType: string;
    price: number;
    loyaltyPoints?: number;
  }[];
  totalCost: number;
  estimatedSavings: number;
};

export type ItineraryModificationType = 
  | 'add_activity'
  | 'remove_activity'
  | 'modify_activity'
  | 'add_meal'
  | 'remove_meal'
  | 'modify_meal'
  | 'change_transportation'
  | 'adjust_timing'
  | 'change_location'
  | 'other';

export type ItineraryModification = {
  type: ItineraryModificationType;
  day: number;
  details: {
    activityIndex?: number;
    mealIndex?: number;
    transportationIndex?: number;
    newTime?: string;
    newLocation?: string;
    newDescription?: string;
    newRestaurant?: string;
    newCuisine?: string;
    newMethod?: string;
    otherDetails?: string;
  };
};

export type ItineraryFeedback = {
  modifications: ItineraryModification[];
  generalFeedback?: string;
  budgetAdjustment?: {
    type: 'increase' | 'decrease';
    amount: number;
    currency: string;
  };
  timeAdjustment?: {
    type: 'earlier' | 'later';
    amount: number;
    unit: 'minutes' | 'hours';
  };
}; 