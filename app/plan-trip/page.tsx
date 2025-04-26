'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { TravelPreferences, TravelPreferencesForm } from '@/app/types/travel';

const initialPreferences: TravelPreferencesForm = {
  destination: '',
  travelDates: {
    arrival: '',
    departure: ''
  },
  personalPreferences: {
    activities: {
      likes: [],
      dislikes: []
    },
    dietaryRestrictions: [],
    energyLevel: 'balanced',
    travelPace: 'packed schedule',
    budget: {
      type: 'total',
      amount: 0,
      currency: 'USD'
    }
  },
  hotelPreferences: {
    type: '',
    loyaltyPrograms: [],
    roomPreferences: []
  },
  flightPreferences: {
    class: 'economy',
    airlineMemberships: [],
    seatPreferences: []
  },
  transportationPreferences: {
    preferredMethods: [],
    comfortVsCost: 'cost'
  },
  otherInfo: {
    weatherSensitivity: '',
    packingHelpNeeded: false
  }
};

export default function PlanTrip() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [preferences, setPreferences] = useState<TravelPreferencesForm>(initialPreferences);
  const [isGenerating, setIsGenerating] = useState(false);

  console.log('Current isGenerating state:', isGenerating);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Submit handler called, setting isGenerating to true');
    setIsGenerating(true);
    
    try {
      const response = await fetch('/api/travel', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'generate_itinerary',
          preferences: preferences as TravelPreferences,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate itinerary');
      }

      const data = await response.json();
      localStorage.setItem('currentItinerary', JSON.stringify(data.itinerary));
      router.push('/itinerary');
    } catch (error) {
      console.error('Error:', error);
      // Handle error (show error message to user)
    } finally {
      console.log('Setting isGenerating to false');
      setIsGenerating(false);
    }
  };

  const updatePreferences = (updates: Partial<TravelPreferencesForm>) => {
    setPreferences(prev => ({
      ...prev,
      ...updates
    }));
  };

  return (
    <main className="min-h-screen bg-gray-900 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="bg-gray-800 rounded-xl shadow-lg p-8 border border-gray-700">
          <h1 className="text-3xl font-bold text-white mb-8">Plan Your Trip</h1>
          
          {/* Progress Steps */}
          <div className="flex justify-between mb-8">
            <div className={`step ${step >= 1 ? 'text-blue-400' : 'text-gray-500'}`}>
              <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center mb-2 ${step >= 1 ? 'border-blue-400' : 'border-gray-500'}`}>
                1
              </div>
              <span>Basic Info</span>
            </div>
            <div className={`step ${step >= 2 ? 'text-blue-400' : 'text-gray-500'}`}>
              <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center mb-2 ${step >= 2 ? 'border-blue-400' : 'border-gray-500'}`}>
                2
              </div>
              <span>Preferences</span>
            </div>
            <div className={`step ${step >= 3 ? 'text-blue-400' : 'text-gray-500'}`}>
              <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center mb-2 ${step >= 3 ? 'border-blue-400' : 'border-gray-500'}`}>
                3
              </div>
              <span>Review</span>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            {step === 1 && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold mb-4 text-white">Basic Trip Information</h2>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Destination
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-400"
                    placeholder="Where do you want to go?"
                    required
                    value={preferences.destination}
                    onChange={(e) => updatePreferences({ destination: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Arrival Date
                    </label>
                    <input
                      type="date"
                      className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 text-white"
                      required
                      value={preferences.travelDates?.arrival}
                      onChange={(e) => updatePreferences({
                        travelDates: {
                          ...preferences.travelDates,
                          arrival: e.target.value
                        }
                      })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Departure Date
                    </label>
                    <input
                      type="date"
                      className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 text-white"
                      required
                      value={preferences.travelDates?.departure}
                      onChange={(e) => updatePreferences({
                        travelDates: {
                          ...preferences.travelDates,
                          departure: e.target.value
                        }
                      })}
                    />
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold mb-4 text-white">Your Preferences</h2>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Activities You Like
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {['Museums', 'Shopping', 'Fine Dining', 'Nightlife', 'Beach', 'Hiking', 'History Tours'].map((activity) => (
                      <label key={activity} className="flex items-center space-x-2 text-gray-300">
                        <input
                          type="checkbox"
                          className="rounded text-blue-500 border-gray-600 bg-gray-700 focus:ring-blue-500"
                          checked={preferences.personalPreferences?.activities?.likes?.includes(activity.toLowerCase())}
                          onChange={(e) => {
                            const likes = preferences.personalPreferences?.activities?.likes || [];
                            const newLikes = e.target.checked
                              ? [...likes, activity.toLowerCase()]
                              : likes.filter(a => a !== activity.toLowerCase());
                            
                            updatePreferences({
                              personalPreferences: {
                                ...preferences.personalPreferences,
                                activities: {
                                  ...preferences.personalPreferences?.activities,
                                  likes: newLikes
                                }
                              }
                            });
                          }}
                        />
                        <span>{activity}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Activities You Dislike
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {['Museums', 'Shopping', 'Fine Dining', 'Nightlife', 'Beach', 'Hiking', 'History Tours'].map((activity) => (
                      <label key={activity} className="flex items-center space-x-2 text-gray-300">
                        <input
                          type="checkbox"
                          className="rounded text-blue-500 border-gray-600 bg-gray-700 focus:ring-blue-500"
                          checked={preferences.personalPreferences?.activities?.dislikes?.includes(activity.toLowerCase())}
                          onChange={(e) => {
                            const dislikes = preferences.personalPreferences?.activities?.dislikes || [];
                            const newDislikes = e.target.checked
                              ? [...dislikes, activity.toLowerCase()]
                              : dislikes.filter(a => a !== activity.toLowerCase());
                            
                            updatePreferences({
                              personalPreferences: {
                                ...preferences.personalPreferences,
                                activities: {
                                  ...preferences.personalPreferences?.activities,
                                  dislikes: newDislikes
                                }
                              }
                            });
                          }}
                        />
                        <span>{activity}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Dietary Restrictions
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {['Vegetarian', 'Vegan', 'Gluten-Free', 'Halal', 'Kosher', 'Dairy-Free'].map((restriction) => (
                      <label key={restriction} className="flex items-center space-x-2 text-gray-300">
                        <input
                          type="checkbox"
                          className="rounded text-blue-500 border-gray-600 bg-gray-700 focus:ring-blue-500"
                          checked={preferences.personalPreferences?.dietaryRestrictions?.some(r => r.type === restriction.toLowerCase())}
                          onChange={(e) => {
                            const restrictions = preferences.personalPreferences?.dietaryRestrictions || [];
                            const newRestrictions = e.target.checked
                              ? [...restrictions, { type: restriction.toLowerCase() }]
                              : restrictions.filter(r => r.type !== restriction.toLowerCase());
                            
                            updatePreferences({
                              personalPreferences: {
                                ...preferences.personalPreferences,
                                dietaryRestrictions: newRestrictions
                              }
                            });
                          }}
                        />
                        <span>{restriction}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Travel Pace
                  </label>
                  <select
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 text-white"
                    required
                    value={preferences.personalPreferences?.travelPace || ''}
                    onChange={(e) => updatePreferences({
                      personalPreferences: {
                        ...preferences.personalPreferences,
                        travelPace: e.target.value as 'lots of rest' | 'packed schedule'
                      }
                    })}
                  >
                    <option value="">Select your travel pace</option>
                    <option value="lots of rest">Lots of Rest Time</option>
                    <option value="packed schedule">Packed Schedule</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Budget Range
                  </label>
                  <select
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 text-white"
                    required
                    value={preferences.personalPreferences?.budget?.amount || ''}
                    onChange={(e) => updatePreferences({
                      personalPreferences: {
                        ...preferences.personalPreferences,
                        budget: {
                          type: 'total',
                          amount: parseInt(e.target.value),
                          currency: 'USD'
                        }
                      }
                    })}
                  >
                    <option value="">Select your budget</option>
                    <option value="2000">Economy ($2,000)</option>
                    <option value="5000">Mid-range ($5,000)</option>
                    <option value="10000">Luxury ($10,000+)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Energy Level
                  </label>
                  <select
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 text-white"
                    required
                    value={preferences.personalPreferences?.energyLevel || ''}
                    onChange={(e) => updatePreferences({
                      personalPreferences: {
                        ...preferences.personalPreferences,
                        energyLevel: e.target.value as 'relaxed' | 'balanced' | 'busy'
                      }
                    })}
                  >
                    <option value="">Select your energy level</option>
                    <option value="relaxed">Relaxed</option>
                    <option value="balanced">Balanced</option>
                    <option value="busy">Busy/Active</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Hotel Type
                  </label>
                  <select
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 text-white"
                    required
                    value={preferences.hotelPreferences?.type || ''}
                    onChange={(e) => updatePreferences({
                      hotelPreferences: {
                        ...preferences.hotelPreferences,
                        type: e.target.value
                      }
                    })}
                  >
                    <option value="">Select hotel type</option>
                    <option value="luxury hotel">Luxury Hotel</option>
                    <option value="boutique hotel">Boutique Hotel</option>
                    <option value="resort">Resort</option>
                    <option value="budget hotel">Budget Hotel</option>
                    <option value="airbnb">Airbnb</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Flight Class
                  </label>
                  <select
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 text-white"
                    required
                    value={preferences.flightPreferences?.class || ''}
                    onChange={(e) => updatePreferences({
                      flightPreferences: {
                        ...preferences.flightPreferences,
                        class: e.target.value
                      }
                    })}
                  >
                    <option value="">Select flight class</option>
                    <option value="economy">Economy</option>
                    <option value="premium economy">Premium Economy</option>
                    <option value="business">Business</option>
                    <option value="first">First Class</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Preferred Transportation Methods
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {['Taxi', 'Subway', 'Bus', 'Walking', 'Ride-sharing', 'Rental Car'].map((method) => (
                      <label key={method} className="flex items-center space-x-2 text-gray-300">
                        <input
                          type="checkbox"
                          className="rounded text-blue-500 border-gray-600 bg-gray-700 focus:ring-blue-500"
                          checked={preferences.transportationPreferences?.preferredMethods?.includes(method.toLowerCase())}
                          onChange={(e) => {
                            const methods = preferences.transportationPreferences?.preferredMethods || [];
                            const newMethods = e.target.checked
                              ? [...methods, method.toLowerCase()]
                              : methods.filter(m => m !== method.toLowerCase());
                            
                            updatePreferences({
                              transportationPreferences: {
                                ...preferences.transportationPreferences,
                                preferredMethods: newMethods,
                                comfortVsCost: preferences.transportationPreferences?.comfortVsCost || 'cost'
                              }
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
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 text-white"
                    required
                    value={preferences.transportationPreferences?.comfortVsCost || ''}
                    onChange={(e) => updatePreferences({
                      transportationPreferences: {
                        ...preferences.transportationPreferences,
                        preferredMethods: preferences.transportationPreferences?.preferredMethods || [],
                        comfortVsCost: e.target.value as 'comfort' | 'cost'
                      }
                    })}
                  >
                    <option value="">Select priority</option>
                    <option value="comfort">Comfort</option>
                    <option value="cost">Cost</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Weather Sensitivity
                  </label>
                  <select
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 text-white"
                    value={preferences.otherInfo?.weatherSensitivity || ''}
                    onChange={(e) => updatePreferences({
                      otherInfo: {
                        ...preferences.otherInfo,
                        weatherSensitivity: e.target.value,
                        packingHelpNeeded: preferences.otherInfo?.packingHelpNeeded || false
                      }
                    })}
                  >
                    <option value="">Select weather preference</option>
                    <option value="prefer sunny">Prefer Sunny Weather</option>
                    <option value="prefer cool">Prefer Cool Weather</option>
                    <option value="no preference">No Preference</option>
                  </select>
                </div>

                <div>
                  <label className="flex items-center space-x-2 text-gray-300">
                    <input
                      type="checkbox"
                      className="rounded text-blue-500 border-gray-600 bg-gray-700 focus:ring-blue-500"
                      checked={preferences.otherInfo?.packingHelpNeeded || false}
                      onChange={(e) => updatePreferences({
                        otherInfo: {
                          ...preferences.otherInfo,
                          packingHelpNeeded: e.target.checked
                        }
                      })}
                    />
                    <span>I need help with packing suggestions</span>
                  </label>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold mb-4 text-white">Review Your Preferences</h2>
                
                <div className="bg-gray-700 p-4 rounded-lg border border-gray-600">
                  <h3 className="font-medium mb-2 text-white">Trip Details</h3>
                  <p className="text-gray-300">Destination: {preferences.destination}</p>
                  <p className="text-gray-300">Dates: {preferences.travelDates?.arrival} to {preferences.travelDates?.departure}</p>
                </div>

                <div className="bg-gray-700 p-4 rounded-lg border border-gray-600">
                  <h3 className="font-medium mb-2 text-white">Preferences</h3>
                  <p className="text-gray-300">Activities: {preferences.personalPreferences?.activities?.likes?.join(', ')}</p>
                  <p className="text-gray-300">Budget: ${preferences.personalPreferences?.budget?.amount}</p>
                  <p className="text-gray-300">Energy Level: {preferences.personalPreferences?.energyLevel}</p>
                </div>
              </div>
            )}

            <div className="mt-8 flex justify-between">
              {step > 1 && (
                <button
                  type="button"
                  onClick={() => setStep(step - 1)}
                  className="px-6 py-2 border border-gray-600 rounded-lg hover:bg-gray-700 text-gray-300 transition-colors"
                >
                  Back
                </button>
              )}
              
              {step < 3 ? (
                <button
                  type="button"
                  onClick={() => setStep(step + 1)}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-lg hover:shadow-blue-500/25"
                >
                  Next
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isGenerating}
                  className={`px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-lg hover:shadow-blue-500/25 ${
                    isGenerating ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {isGenerating ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Generating Itinerary...</span>
                    </div>
                  ) : (
                    'Generate Itinerary'
                  )}
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </main>
  );
} 