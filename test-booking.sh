#!/bin/bash

# Test data for booking simulation
BOOKING_DATA='{
  "action": "simulate_bookings",
  "preferences": {
    "destination": "Paris",
    "travelDates": {
      "arrival": "2024-04-01",
      "departure": "2024-04-05"
    },
    "personalPreferences": {
      "activities": {
        "likes": ["museums", "fine dining", "shopping"],
        "dislikes": ["hiking", "early mornings"]
      },
      "dietaryRestrictions": [
        {
          "type": "vegetarian"
        }
      ],
      "energyLevel": "balanced",
      "travelPace": "packed schedule",
      "budget": {
        "type": "total",
        "amount": 5000,
        "currency": "USD"
      }
    },
    "hotelPreferences": {
      "type": "boutique hotel",
      "roomPreferences": ["king bed", "city view"]
    },
    "flightPreferences": {
      "class": "economy",
      "seatPreferences": ["window"]
    },
    "transportationPreferences": {
      "preferredMethods": ["subway", "walking"],
      "comfortVsCost": "cost"
    },
    "otherInfo": {
      "weatherSensitivity": "prefer sunny weather",
      "packingHelpNeeded": true
    }
  },
  "itinerary": {
    "traveler": {
      "destination": "Paris",
      "travelDates": {
        "start": "2024-04-01",
        "end": "2024-04-05"
      },
      "preferences": {
        "likes": ["museums", "fine dining", "shopping"],
        "dislikes": ["hiking", "early mornings"],
        "dietaryRestrictions": "vegetarian",
        "energyLevel": "balanced",
        "travelPace": "packed schedule",
        "budget": 5000,
        "hotelPreferences": {
          "type": "boutique hotel",
          "roomPreferences": ["king bed", "city view"]
        },
        "flightPreferences": {
          "class": "economy",
          "seatPreferences": "window"
        },
        "transportationPreferences": {
          "preferredMethods": ["subway", "walking"],
          "comfortVsCost": "cost"
        },
        "weatherSensitivity": "prefer sunny weather",
        "packingHelpNeeded": true
      }
    },
    "itinerary": [
      {
        "date": "2024-04-01",
        "weather": "Sunny, 18°C",
        "activities": [
          {
            "time": "10:00",
            "activity": "Visit Louvre Museum",
            "location": "Louvre Museum",
            "cost": "17 EUR",
            "transportation": "Walk"
          }
        ]
      }
    ],
    "packingList": ["Comfortable walking shoes"],
    "budgetBreakdown": {
      "Hotel": "1200 USD",
      "Dining": "500 USD",
      "Activities": "300 USD",
      "Transportation": "150 USD",
      "Miscellaneous": "250 USD",
      "Total Estimated Cost": "2400 USD"
    }
  }
}'

echo "Testing simulate_bookings endpoint..."
curl -X POST http://localhost:3001/api/travel \
  -H "Content-Type: application/json" \
  -d "$BOOKING_DATA" > booking-response.json

echo "Response saved to booking-response.json"
echo "Contents of booking-response.json:"
cat booking-response.json | jq '.' 