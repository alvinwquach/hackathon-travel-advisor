#!/bin/bash

# Test data
TEST_DATA='{
  "action": "generate_itinerary",
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
  }
}'

echo "Testing generate_itinerary endpoint..."
curl -X POST http://localhost:3001/api/travel \
  -H "Content-Type: application/json" \
  -d "$TEST_DATA" > itinerary.json

echo -e "\nTesting get_feedback endpoint..."
FEEDBACK_DATA='{
  "action": "get_feedback",
  "preferences": '"$(cat itinerary.json | jq '.preferences')"',
  "itinerary": '"$(cat itinerary.json | jq '.itinerary')"',
  "feedback": {
    "modifications": [
      {
        "type": "modify_activity",
        "day": 1,
        "details": {
          "activityIndex": 0,
          "newTime": "10:00 AM",
          "newLocation": "Louvre Museum"
        }
      }
    ],
    "generalFeedback": "Would like more cultural activities",
    "budgetAdjustment": {
      "type": "increase",
      "amount": 500,
      "currency": "USD"
    }
  }
}'

curl -X POST http://localhost:3001/api/travel \
  -H "Content-Type: application/json" \
  -d "$FEEDBACK_DATA" > feedback.json

echo -e "\nTesting simulate_bookings endpoint..."
BOOKING_DATA='{
  "action": "simulate_bookings",
  "preferences": '"$(cat itinerary.json | jq '.preferences')"',
  "itinerary": '"$(cat itinerary.json | jq '.itinerary')"'
}'

curl -X POST http://localhost:3001/api/travel \
  -H "Content-Type: application/json" \
  -d "$BOOKING_DATA" > bookings.json

echo -e "\nTest results:"
echo "1. Generated Itinerary:"
cat itinerary.json | jq '.itinerary'
echo -e "\n2. Feedback Response:"
cat feedback.json | jq '.itinerary'
echo -e "\n3. Booking Simulation:"
cat bookings.json | jq '.bookings' 