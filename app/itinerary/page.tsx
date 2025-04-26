'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { TravelItinerary, ItineraryFeedback } from '@/app/types/travel';

export default function ItineraryPage() {
  const router = useRouter();
  const [itinerary, setItinerary] = useState<TravelItinerary | null>(null);
  const [loading, setLoading] = useState(true);
  const [showModifyOptions, setShowModifyOptions] = useState(false);
  const [isBooking, setIsBooking] = useState(false);
  const [feedback, setFeedback] = useState<ItineraryFeedback>({
    modifications: [],
    generalFeedback: '',
    budgetAdjustment: undefined,
    timeAdjustment: undefined
  });

  useEffect(() => {
    const fetchItinerary = async () => {
      try {
        const response = await fetch('/api/itinerary');
        if (!response.ok) {
          throw new Error('Failed to fetch itinerary');
        }
        const data = await response.json();
        setItinerary(data.itinerary);
      } catch (error) {
        console.error('Error fetching itinerary:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchItinerary();
  }, []);

  const handleModify = async () => {
    try {
      // Comment out API call for now
      // const response = await fetch('/api/travel', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({
      //     action: 'get_itinerary_feedback',
      //     feedback: feedback,
      //     currentItinerary: itinerary,
      //   }),
      // });

      // if (!response.ok) {
      //   throw new Error('Failed to modify itinerary');
      // }

      // const data = await response.json();
      // setItinerary(data.itinerary);

      // Instead, read from feedback.json
      const response = await fetch('/api/feedback');
      if (!response.ok) {
        throw new Error('Failed to fetch feedback');
      }
      const data = await response.json();
      setItinerary(data.itinerary);
      
      setShowModifyOptions(false);
      // Reset feedback
      setFeedback({
        modifications: [],
        generalFeedback: '',
        budgetAdjustment: undefined,
        timeAdjustment: undefined
      });
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleBooking = async () => {
    try {
      setIsBooking(true);
      const response = await fetch('/api/booking');
      if (!response.ok) {
        throw new Error('Failed to book items');
      }

      // Navigate to booking confirmation page
      router.push('/bookings/confirmation');
    } catch (error) {
      console.error('Error:', error);
      // Show error message to user
      alert('Failed to book your trip. Please try again.');
    } finally {
      setIsBooking(false);
    }
  };

  const addModification = (type: string, day: number, details: any) => {
    setFeedback(prev => ({
      ...prev,
      modifications: [
        ...prev.modifications,
        {
          type: type as any,
          day,
          details
        }
      ]
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading your itinerary...</div>
      </div>
    );
  }

  if (!itinerary) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">No itinerary found. Please plan a trip first.</div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-900 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="bg-gray-800 rounded-xl shadow-lg p-8 border border-gray-700">
          <h1 className="text-3xl font-bold text-white mb-8">Your Travel Itinerary</h1>

          {showModifyOptions && (
            <div className="mb-8 p-4 bg-gray-700 rounded-lg">
              <h3 className="text-white font-semibold mb-4">How would you like to modify the itinerary?</h3>
              
              {/* General Feedback */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  General Feedback
                </label>
                <textarea
                  className="w-full px-4 py-2 bg-gray-600 border border-gray-500 rounded-lg text-white"
                  rows={3}
                  placeholder="What would you like to change about the itinerary?"
                  value={feedback.generalFeedback}
                  onChange={(e) => setFeedback(prev => ({ ...prev, generalFeedback: e.target.value }))}
                />
              </div>

              {/* Budget Adjustment */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Budget Adjustment
                </label>
                <div className="flex space-x-4">
                  <select
                    className="px-4 py-2 bg-gray-600 border border-gray-500 rounded-lg text-white"
                    value={feedback.budgetAdjustment?.type || ''}
                    onChange={(e) => setFeedback(prev => ({
                      ...prev,
                      budgetAdjustment: e.target.value ? {
                        type: e.target.value as 'increase' | 'decrease',
                        amount: prev.budgetAdjustment?.amount || 0,
                        currency: prev.budgetAdjustment?.currency || 'USD'
                      } : undefined
                    }))}
                  >
                    <option value="">No change</option>
                    <option value="increase">Increase</option>
                    <option value="decrease">Decrease</option>
                  </select>
                  {feedback.budgetAdjustment && (
                    <>
                      <input
                        type="number"
                        className="px-4 py-2 bg-gray-600 border border-gray-500 rounded-lg text-white"
                        placeholder="Amount"
                        value={feedback.budgetAdjustment.amount}
                        onChange={(e) => setFeedback(prev => ({
                          ...prev,
                          budgetAdjustment: {
                            ...prev.budgetAdjustment!,
                            amount: Number(e.target.value)
                          }
                        }))}
                      />
                      <select
                        className="px-4 py-2 bg-gray-600 border border-gray-500 rounded-lg text-white"
                        value={feedback.budgetAdjustment.currency}
                        onChange={(e) => setFeedback(prev => ({
                          ...prev,
                          budgetAdjustment: {
                            ...prev.budgetAdjustment!,
                            currency: e.target.value
                          }
                        }))}
                      >
                        <option value="USD">USD</option>
                        <option value="EUR">EUR</option>
                        <option value="GBP">GBP</option>
                      </select>
                    </>
                  )}
                </div>
              </div>

              {/* Time Adjustment */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Time Adjustment
                </label>
                <div className="flex space-x-4">
                  <select
                    className="px-4 py-2 bg-gray-600 border border-gray-500 rounded-lg text-white"
                    value={feedback.timeAdjustment?.type || ''}
                    onChange={(e) => setFeedback(prev => ({
                      ...prev,
                      timeAdjustment: e.target.value ? {
                        type: e.target.value as 'earlier' | 'later',
                        amount: prev.timeAdjustment?.amount || 0,
                        unit: prev.timeAdjustment?.unit || 'hours'
                      } : undefined
                    }))}
                  >
                    <option value="">No change</option>
                    <option value="earlier">Earlier</option>
                    <option value="later">Later</option>
                  </select>
                  {feedback.timeAdjustment && (
                    <>
                      <input
                        type="number"
                        className="px-4 py-2 bg-gray-600 border border-gray-500 rounded-lg text-white"
                        placeholder="Amount"
                        value={feedback.timeAdjustment.amount}
                        onChange={(e) => setFeedback(prev => ({
                          ...prev,
                          timeAdjustment: {
                            ...prev.timeAdjustment!,
                            amount: Number(e.target.value)
                          }
                        }))}
                      />
                      <select
                        className="px-4 py-2 bg-gray-600 border border-gray-500 rounded-lg text-white"
                        value={feedback.timeAdjustment.unit}
                        onChange={(e) => setFeedback(prev => ({
                          ...prev,
                          timeAdjustment: {
                            ...prev.timeAdjustment!,
                            unit: e.target.value as 'minutes' | 'hours'
                          }
                        }))}
                      >
                        <option value="minutes">Minutes</option>
                        <option value="hours">Hours</option>
                      </select>
                    </>
                  )}
                </div>
              </div>

              {/* Specific Modifications */}
              <div className="mb-6">
                <h4 className="text-lg font-medium text-white mb-4">Specific Modifications</h4>
                {itinerary.itinerary.map((day, dayIndex) => (
                  <div key={dayIndex} className="mb-4">
                    <h5 className="text-white font-medium mb-2">Day {dayIndex + 1}</h5>
                    <div className="space-y-2">
                      {day.activities.map((activity, activityIndex) => (
                        <div key={activityIndex} className="flex items-center space-x-4">
                          <span className="text-gray-300">{activity.time}</span>
                          <span className="text-gray-300">{activity.activity}</span>
                          <select
                            className="px-4 py-2 bg-gray-600 border border-gray-500 rounded-lg text-white"
                            onChange={(e) => {
                              if (e.target.value) {
                                addModification(e.target.value, dayIndex, {
                                  activityIndex,
                                  newTime: e.target.value === 'adjust_timing' ? activity.time : undefined,
                                  newLocation: e.target.value === 'change_location' ? activity.location : undefined,
                                  newDescription: e.target.value === 'modify_activity' ? activity.activity : undefined
                                });
                              }
                            }}
                          >
                            <option value="">No change</option>
                            <option value="modify_activity">Change Activity</option>
                            <option value="adjust_timing">Adjust Time</option>
                            <option value="change_location">Change Location</option>
                          </select>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => setShowModifyOptions(false)}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                >
                  Cancel
                </button>
                <button
                  onClick={handleModify}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Submit Modifications
                </button>
              </div>
            </div>
          )}

          <div className="space-y-8">
            {itinerary.itinerary.map((day, index) => (
              <div key={index} className="bg-gray-700 rounded-lg p-6 border border-gray-600">
                <h2 className="text-xl font-semibold text-white mb-4">
                  {new Date(day.date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                </h2>
                
                <div className="mb-4">
                  <p className="text-gray-300">
                    <span className="font-medium">Weather:</span> {day.weather}
                  </p>
                </div>

                <div className="space-y-4">
                  {day.activities.map((activity, activityIndex) => (
                    <div key={activityIndex} className="bg-gray-800 p-4 rounded-lg">
                      <div>
                        <h3 className="text-lg font-medium text-white">{activity.activity}</h3>
                        <p className="text-gray-400">{activity.time}</p>
                        {activity.location && (
                          <p className="text-gray-400 mt-2">
                            <span className="font-medium">Location:</span> {activity.location}
                          </p>
                        )}
                        <p className="text-gray-400">
                          <span className="font-medium">Cost:</span> {activity.cost}
                        </p>
                        <p className="text-gray-400">
                          <span className="font-medium">Transportation:</span> {activity.transportation}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 p-4 bg-gray-700 rounded-lg">
            <h3 className="text-xl font-semibold text-white mb-4">Trip Summary</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-gray-300">
                  <span className="font-medium">Destination:</span> {itinerary.traveler.destination}
                </p>
                <p className="text-gray-300">
                  <span className="font-medium">Dates:</span> {itinerary.traveler.travelDates.start} to {itinerary.traveler.travelDates.end}
                </p>
              </div>
              <div>
                <p className="text-gray-300">
                  <span className="font-medium">Total Cost:</span> {itinerary.budgetBreakdown["Total Estimated Cost"]}
                </p>
                <p className="text-gray-300">
                  <span className="font-medium">Packing List:</span> {itinerary.packingList.join(', ')}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-8 p-6 bg-gray-700 rounded-lg">
            <h3 className="text-xl font-semibold text-white mb-6">What would you like to do next?</h3>
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="text-lg font-medium text-white">Modify Itinerary</h4>
                <p className="text-gray-300">Want to make changes to your itinerary?</p>
                <button
                  onClick={() => router.push('/modify-itinerary')}
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Modify Itinerary
                </button>
              </div>
              <div className="space-y-4">
                <h4 className="text-lg font-medium text-white">Book Your Trip</h4>
                <p className="text-gray-300">Ready to book your accommodations, activities, and transportation?</p>
                <button
                  onClick={handleBooking}
                  disabled={isBooking}
                  className={`w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-200 ${
                    isBooking ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {isBooking ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Processing...</span>
                    </div>
                  ) : (
                    'Book Now'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
} 