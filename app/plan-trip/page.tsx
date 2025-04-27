'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { TravelPreferences, TravelPreferencesForm } from '@/app/types/travel';
import Globe from '@/app/components/Globe';
import { geocodeAddress } from '@/app/util/geocodeAddress';

interface Place {
  name: string;
  longitude: number;
  latitude: number;
}

const initialPreferences: TravelPreferencesForm = {
  destination: '',
  travelDates: {
    arrival: '',
    departure: ''
  },
  personalPreferences: {
    activities: {
      likes: ['museums', 'shopping', 'fine dining'],
      dislikes: ['hiking', 'early mornings']
    },
    dietaryRestrictions: [],
    energyLevel: 'balanced',
    travelPace: 'packed schedule',
    budget: {
      type: 'total',
      amount: 5000,
      currency: 'USD'
    }
  },
  hotelPreferences: {
    type: 'boutique hotel',
    loyaltyPrograms: [],
    roomPreferences: ['king bed', 'city view']
  },
  flightPreferences: {
    class: 'economy',
    airlineMemberships: [],
    seatPreferences: ['window']
  },
  transportationPreferences: {
    preferredMethods: ['taxi', 'public transit', 'walking'],
    comfortVsCost: 'cost'
  },
  otherInfo: {
    weatherSensitivity: '',
    packingHelpNeeded: true
  }
};

export default function PlanTrip() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [preferences, setPreferences] = useState<TravelPreferencesForm>(() => {
    const savedPreferences = localStorage.getItem("travelPreferences");
    return savedPreferences ? JSON.parse(savedPreferences) : initialPreferences;
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [destination, setDestination] = useState<Place | null>(null);
  // const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [debouncedValue, setDebouncedValue] = useState("");

  // Debounce function to delay the API call
  const debounce = useCallback(
    (func: (value: string) => Promise<void>, wait: number) => {
      let timeout: NodeJS.Timeout;
      return (value: string) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => func(value), wait);
      };
    },
    []
  );

  // Debounced function to handle destination changes
  const debouncedDestinationChange = useCallback(
    debounce(async (value: string) => {
      if (value.trim()) {
        setError(null);
        try {
          const { lat, lon } = await geocodeAddress(value);
          if (lat === 0 && lon === 0) {
            throw new Error("Destination not found.");
          }
          setDestination({
            name: value,
            longitude: lon,
            latitude: lat,
          });
        } catch (error) {
          setError(
            "Could not find that destination. Try a different city or check your spelling."
          );
          setDestination(null);
        }
      } else {
        setDestination(null);
      }
    }, 500),
    []
  );

  const handleDestinationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    updatePreferences({ destination: value });
    setDebouncedValue(value);
    debouncedDestinationChange(value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);

    try {
      const response = await fetch("/api/travel", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "generate_itinerary",
          preferences: preferences as TravelPreferences,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate itinerary");
      }

      const data = await response.json();
      localStorage.setItem("currentItinerary", JSON.stringify(data.itinerary));
      router.push("/itinerary");
    } catch (error) {
      console.error("Error:", error);
      // Handle error (show error message to user)
    } finally {
      setIsGenerating(false);
    }
  };

  const updatePreferences = (updates: Partial<TravelPreferencesForm>) => {
    setPreferences((prev) => ({
      ...prev,
      ...updates,
    }));
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 py-12">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-2xl p-8 border border-gray-700/50">
          <h1 className="text-4xl font-bold text-white mb-8 text-center">
            Plan Your Trip
          </h1>

          <div
            className={`grid ${
              step === 1 ? "grid-cols-2" : "grid-cols-1"
            } gap-12`}
          >
            {/* Left Column - Globe (only in step 1) */}
            {step === 1 && (
              <div className="flex items-center justify-center h-full">
                <div className="relative w-[500px] h-[500px] bg-gray-900/50 rounded-xl p-4 shadow-inner">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Globe rotateTo={destination} />
                  </div>
                </div>
              </div>
            )}

            {/* Right Column - Form */}
            <div className={step === 1 ? "" : "max-w-2xl mx-auto w-full"}>
              {/* Progress Steps */}
              <div className="flex justify-between mb-8">
                <div
                  className={`step ${
                    step >= 1 ? "text-blue-400" : "text-gray-500"
                  } flex flex-col items-center`}
                >
                  <div
                    className={`w-10 h-10 rounded-full border-2 flex items-center justify-center mb-2 ${
                      step >= 1
                        ? "border-blue-400 bg-blue-400/10"
                        : "border-gray-500"
                    }`}
                  >
                    1
                  </div>
                  <span className="text-sm font-medium">Basic Info</span>
                </div>
                <div
                  className={`step ${
                    step >= 2 ? "text-blue-400" : "text-gray-500"
                  } flex flex-col items-center`}
                >
                  <div
                    className={`w-10 h-10 rounded-full border-2 flex items-center justify-center mb-2 ${
                      step >= 2
                        ? "border-blue-400 bg-blue-400/10"
                        : "border-gray-500"
                    }`}
                  >
                    2
                  </div>
                  <span className="text-sm font-medium">Preferences</span>
                </div>
                <div
                  className={`step ${
                    step >= 3 ? "text-blue-400" : "text-gray-500"
                  } flex flex-col items-center`}
                >
                  <div
                    className={`w-10 h-10 rounded-full border-2 flex items-center justify-center mb-2 ${
                      step >= 3
                        ? "border-blue-400 bg-blue-400/10"
                        : "border-gray-500"
                    }`}
                  >
                    3
                  </div>
                  <span className="text-sm font-medium">Review</span>
                </div>
              </div>

              <form className="space-y-6">
                {step === 1 && (
                  <div className="space-y-6">
                    <h2 className="text-2xl font-semibold text-white mb-6">
                      Basic Trip Information
                    </h2>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Destination
                      </label>
                      <input
                        type="text"
                        className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-400 transition-all duration-200"
                        placeholder="Where do you want to go?"
                        required
                        value={preferences.destination}
                        onChange={handleDestinationChange}
                      />
                      {error && (
                        <p className="mt-2 text-red-400 text-sm">{error}</p>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Arrival Date
                        </label>
                        <input
                          type="date"
                          className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 text-white transition-all duration-200"
                          required
                          value={preferences.travelDates?.arrival}
                          onChange={(e) =>
                            updatePreferences({
                              travelDates: {
                                ...preferences.travelDates,
                                arrival: e.target.value,
                              },
                            })
                          }
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Departure Date
                        </label>
                        <input
                          type="date"
                          className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 text-white transition-all duration-200"
                          required
                          value={preferences.travelDates?.departure}
                          onChange={(e) =>
                            updatePreferences({
                              travelDates: {
                                ...preferences.travelDates,
                                departure: e.target.value,
                              },
                            })
                          }
                        />
                      </div>
                    </div>
                  </div>
                )}

                {step === 2 && (
                  <div className="space-y-6">
                    <h2 className="text-2xl font-semibold text-white mb-6">
                      Your Preferences
                    </h2>

                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-3">
                          Activities You Like
                        </label>
                        <div className="space-y-2">
                          {[
                            "Museums",
                            "Shopping",
                            "Fine Dining",
                            "Nightlife",
                            "Beach",
                            "Hiking",
                            "History Tours",
                          ].map((activity) => (
                            <label
                              key={activity}
                              className="flex items-center space-x-3 text-gray-300 hover:text-white transition-colors"
                            >
                              <input
                                type="checkbox"
                                className="w-4 h-4 rounded text-blue-500 border-gray-600 bg-gray-700/50 focus:ring-blue-500 transition-all duration-200"
                                checked={preferences.personalPreferences?.activities?.likes?.includes(
                                  activity.toLowerCase()
                                )}
                                onChange={(e) => {
                                  const likes =
                                    preferences.personalPreferences?.activities
                                      ?.likes || [];
                                  const newLikes = e.target.checked
                                    ? [...likes, activity.toLowerCase()]
                                    : likes.filter(
                                        (a) => a !== activity.toLowerCase()
                                      );

                                  updatePreferences({
                                    personalPreferences: {
                                      ...preferences.personalPreferences,
                                      activities: {
                                        ...preferences.personalPreferences
                                          ?.activities,
                                        likes: newLikes,
                                      },
                                    },
                                  });
                                }}
                              />
                              <span>{activity}</span>
                            </label>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-3">
                          Activities You Dislike
                        </label>
                        <div className="space-y-2">
                          {[
                            "Museums",
                            "Shopping",
                            "Fine Dining",
                            "Nightlife",
                            "Beach",
                            "Hiking",
                            "History Tours",
                          ].map((activity) => (
                            <label
                              key={activity}
                              className="flex items-center space-x-3 text-gray-300 hover:text-white transition-colors"
                            >
                              <input
                                type="checkbox"
                                className="w-4 h-4 rounded text-blue-500 border-gray-600 bg-gray-700/50 focus:ring-blue-500 transition-all duration-200"
                                checked={preferences.personalPreferences?.activities?.dislikes?.includes(
                                  activity.toLowerCase()
                                )}
                                onChange={(e) => {
                                  const dislikes =
                                    preferences.personalPreferences?.activities
                                      ?.dislikes || [];
                                  const newDislikes = e.target.checked
                                    ? [...dislikes, activity.toLowerCase()]
                                    : dislikes.filter(
                                        (a) => a !== activity.toLowerCase()
                                      );

                                  updatePreferences({
                                    personalPreferences: {
                                      ...preferences.personalPreferences,
                                      activities: {
                                        ...preferences.personalPreferences
                                          ?.activities,
                                        dislikes: newDislikes,
                                      },
                                    },
                                  });
                                }}
                              />
                              <span>{activity}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-3">
                        Dietary Restrictions
                      </label>
                      <div className="grid grid-cols-2 gap-4">
                        {[
                          "Vegetarian",
                          "Vegan",
                          "Gluten-Free",
                          "Halal",
                          "Kosher",
                          "Dairy-Free",
                        ].map((restriction) => (
                          <label
                            key={restriction}
                            className="flex items-center space-x-3 text-gray-300 hover:text-white transition-colors"
                          >
                            <input
                              type="checkbox"
                              className="w-4 h-4 rounded text-blue-500 border-gray-600 bg-gray-700/50 focus:ring-blue-500 transition-all duration-200"
                              checked={preferences.personalPreferences?.dietaryRestrictions?.some(
                                (r) => r.type === restriction.toLowerCase()
                              )}
                              onChange={(e) => {
                                const restrictions =
                                  preferences.personalPreferences
                                    ?.dietaryRestrictions || [];
                                const newRestrictions = e.target.checked
                                  ? [
                                      ...restrictions,
                                      { type: restriction.toLowerCase() },
                                    ]
                                  : restrictions.filter(
                                      (r) =>
                                        r.type !== restriction.toLowerCase()
                                    );

                                updatePreferences({
                                  personalPreferences: {
                                    ...preferences.personalPreferences,
                                    dietaryRestrictions: newRestrictions,
                                  },
                                });
                              }}
                            />
                            <span>{restriction}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Travel Pace
                        </label>
                        <select
                          className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 text-white transition-all duration-200"
                          required
                          value={
                            preferences.personalPreferences?.travelPace || ""
                          }
                          onChange={(e) =>
                            updatePreferences({
                              personalPreferences: {
                                ...preferences.personalPreferences,
                                travelPace: e.target.value as
                                  | "lots of rest"
                                  | "packed schedule",
                              },
                            })
                          }
                        >
                          <option value="">Select your travel pace</option>
                          <option value="lots of rest">
                            Lots of Rest Time
                          </option>
                          <option value="packed schedule">
                            Packed Schedule
                          </option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Budget Range
                        </label>
                        <select
                          className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 text-white transition-all duration-200"
                          required
                          value={
                            preferences.personalPreferences?.budget?.amount ||
                            ""
                          }
                          onChange={(e) =>
                            updatePreferences({
                              personalPreferences: {
                                ...preferences.personalPreferences,
                                budget: {
                                  type: "total",
                                  amount: parseInt(e.target.value),
                                  currency: "USD",
                                },
                              },
                            })
                          }
                        >
                          <option value="">Select your budget</option>
                          <option value="2000">Economy ($2,000)</option>
                          <option value="5000">Mid-range ($5,000)</option>
                          <option value="10000">Luxury ($10,000+)</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Energy Level
                      </label>
                      <select
                        className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 text-white transition-all duration-200"
                        required
                        value={
                          preferences.personalPreferences?.energyLevel || ""
                        }
                        onChange={(e) =>
                          updatePreferences({
                            personalPreferences: {
                              ...preferences.personalPreferences,
                              energyLevel: e.target.value as
                                | "relaxed"
                                | "balanced"
                                | "busy",
                            },
                          })
                        }
                      >
                        <option value="">Select your energy level</option>
                        <option value="relaxed">Relaxed</option>
                        <option value="balanced">Balanced</option>
                        <option value="busy">Busy/Active</option>
                      </select>
                    </div>

                    {/* Hotel Preferences */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-3">
                        Hotel Type
                      </label>
                      <div className="grid grid-cols-2 gap-4">
                        {[
                          "Luxury Hotel",
                          "Boutique Hotel",
                          "Resort",
                          "Budget Hotel",
                          "Airbnb",
                        ].map((type) => (
                          <label
                            key={type}
                            className="flex items-center space-x-3 text-gray-300 hover:text-white transition-colors"
                          >
                            <input
                              type="radio"
                              name="hotelType"
                              className="w-4 h-4 text-blue-500 border-gray-600 bg-gray-700/50 focus:ring-blue-500 transition-all duration-200"
                              checked={
                                preferences.hotelPreferences?.type ===
                                type.toLowerCase()
                              }
                              onChange={() =>
                                updatePreferences({
                                  hotelPreferences: {
                                    ...preferences.hotelPreferences,
                                    type: type.toLowerCase(),
                                  },
                                })
                              }
                            />
                            <span>{type}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Flight Preferences */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-3">
                        Flight Class
                      </label>
                      <div className="grid grid-cols-2 gap-4">
                        {[
                          "Economy",
                          "Premium Economy",
                          "Business",
                          "First Class",
                        ].map((classType) => (
                          <label
                            key={classType}
                            className="flex items-center space-x-3 text-gray-300 hover:text-white transition-colors"
                          >
                            <input
                              type="radio"
                              name="flightClass"
                              className="w-4 h-4 text-blue-500 border-gray-600 bg-gray-700/50 focus:ring-blue-500 transition-all duration-200"
                              checked={
                                preferences.flightPreferences?.class ===
                                classType.toLowerCase()
                              }
                              onChange={() =>
                                updatePreferences({
                                  flightPreferences: {
                                    ...preferences.flightPreferences,
                                    class: classType.toLowerCase(),
                                  },
                                })
                              }
                            />
                            <span>{classType}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Transportation Preferences */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-3">
                        Preferred Transportation Methods
                      </label>
                      <div className="grid grid-cols-2 gap-4">
                        {[
                          "Taxi",
                          "Ride-sharing",
                          "Public Transit",
                          "Walking",
                          "Bicycle",
                          "Car Rental",
                        ].map((method) => (
                          <label
                            key={method}
                            className="flex items-center space-x-3 text-gray-300 hover:text-white transition-colors"
                          >
                            <input
                              type="checkbox"
                              className="w-4 h-4 rounded text-blue-500 border-gray-600 bg-gray-700/50 focus:ring-blue-500 transition-all duration-200"
                              checked={preferences.transportationPreferences?.preferredMethods?.includes(
                                method.toLowerCase()
                              )}
                              onChange={(e) => {
                                const methods =
                                  preferences.transportationPreferences
                                    ?.preferredMethods || [];
                                const newMethods = e.target.checked
                                  ? [...methods, method.toLowerCase()]
                                  : methods.filter(
                                      (m) => m !== method.toLowerCase()
                                    );

                                updatePreferences({
                                  transportationPreferences: {
                                    preferredMethods: newMethods,
                                    comfortVsCost:
                                      preferences.transportationPreferences
                                        ?.comfortVsCost || "cost",
                                  },
                                });
                              }}
                            />
                            <span>{method}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Transportation Priority
                      </label>
                      <select
                        className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 text-white transition-all duration-200"
                        value={
                          preferences.transportationPreferences
                            ?.comfortVsCost || "cost"
                        }
                        onChange={(e) =>
                          updatePreferences({
                            transportationPreferences: {
                              preferredMethods:
                                preferences.transportationPreferences
                                  ?.preferredMethods || [],
                              comfortVsCost: e.target.value as
                                | "comfort"
                                | "cost",
                            },
                          })
                        }
                      >
                        <option value="cost">Prioritize Cost</option>
                        <option value="comfort">Prioritize Comfort</option>
                      </select>
                    </div>

                    {/* Other Info */}
                    <div>
                      <label className="flex items-center space-x-3 text-gray-300 hover:text-white transition-colors">
                        <input
                          type="checkbox"
                          className="w-4 h-4 rounded text-blue-500 border-gray-600 bg-gray-700/50 focus:ring-blue-500 transition-all duration-200"
                          checked={
                            preferences.otherInfo?.packingHelpNeeded || false
                          }
                          onChange={(e) =>
                            updatePreferences({
                              otherInfo: {
                                ...preferences.otherInfo,
                                packingHelpNeeded: e.target.checked,
                              },
                            })
                          }
                        />
                        <span>I would like help with packing suggestions</span>
                      </label>
                    </div>
                  </div>
                )}

                {step === 3 && (
                  <div className="space-y-6">
                    <h2 className="text-2xl font-semibold text-white mb-6">
                      Review Your Preferences
                    </h2>

                    <div className="bg-gray-700/50 p-6 rounded-xl border border-gray-600">
                      <h3 className="font-medium mb-4 text-white text-lg">
                        Trip Details
                      </h3>
                      <div className="space-y-3">
                        <p className="text-gray-300">
                          <span className="font-medium text-white">
                            Destination:
                          </span>{" "}
                          {preferences.destination}
                        </p>
                        <p className="text-gray-300">
                          <span className="font-medium text-white">Dates:</span>{" "}
                          {preferences.travelDates?.arrival} to{" "}
                          {preferences.travelDates?.departure}
                        </p>
                      </div>
                    </div>

                    <div className="bg-gray-700/50 p-6 rounded-xl border border-gray-600">
                      <h3 className="font-medium mb-4 text-white text-lg">
                        Preferences
                      </h3>
                      <div className="space-y-3">
                        <p className="text-gray-300">
                          <span className="font-medium text-white">
                            Activities:
                          </span>{" "}
                          {preferences.personalPreferences?.activities?.likes?.join(
                            ", "
                          )}
                        </p>
                        <p className="text-gray-300">
                          <span className="font-medium text-white">
                            Budget:
                          </span>{" "}
                          ${preferences.personalPreferences?.budget?.amount}
                        </p>
                        <p className="text-gray-300">
                          <span className="font-medium text-white">
                            Energy Level:
                          </span>{" "}
                          {preferences.personalPreferences?.energyLevel}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="mt-8 flex justify-between">
                  {step > 1 && (
                    <button
                      type="button"
                      onClick={() => setStep(step - 1)}
                      className="px-6 py-3 border border-gray-600 rounded-xl hover:bg-gray-700 text-gray-300 transition-all duration-200"
                    >
                      Back
                    </button>
                  )}

                  {step < 3 ? (
                    <button
                      type="button"
                      onClick={() => setStep(step + 1)}
                      className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all duration-200 shadow-lg hover:shadow-blue-500/25"
                    >
                      Next
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleSubmit}
                      disabled={isGenerating}
                      className={`px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all duration-200 shadow-lg hover:shadow-blue-500/25 ${
                        isGenerating ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                    >
                      {isGenerating ? (
                        <div className="flex items-center space-x-2">
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          <span>Generating...</span>
                        </div>
                      ) : (
                        "Generate Itinerary"
                      )}
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
} 