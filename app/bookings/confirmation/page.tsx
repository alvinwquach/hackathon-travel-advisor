'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { TravelItinerary } from '@/app/types/travel';
import { BookingResponse } from '@/app/types/booking';
import { ItineraryPDF } from '@/app/components/ItineraryPDF';
import { PDFDownloadLink } from '@react-pdf/renderer';

export default function BookingConfirmationPage() {
  const router = useRouter();
  const [itinerary, setItinerary] = useState<TravelItinerary | null>(null);
  const [bookingResponse, setBookingResponse] = useState<BookingResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [bookingStatus, setBookingStatus] = useState<'pending' | 'success' | 'error'>('pending');
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        // Load itinerary from localStorage
        const storedItinerary = localStorage.getItem('currentItinerary');
        if (!storedItinerary) {
          throw new Error('No itinerary found');
        }
        setItinerary(JSON.parse(storedItinerary));

        // Load booking response from localStorage
        const storedBookingResponse = localStorage.getItem('bookingResponse');
        if (!storedBookingResponse) {
          throw new Error('No booking response found');
        }
        const bookingData = JSON.parse(storedBookingResponse);
        if (!bookingData.bookings) {
          throw new Error('Invalid booking response format');
        }
        setBookingResponse(bookingData);
        setBookingStatus('success');
      } catch (error) {
        console.error('Error:', error);
        setBookingStatus('error');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleDownload = async () => {
    try {
      setIsDownloading(true);
      const response = await fetch('/api/travel', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'generate_pdf',
          itinerary: itinerary
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate PDF');
      }

      const data = await response.json();
      // Handle the PDF data directly
      window.open(data.pdfUrl, '_blank');
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to download PDF. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Processing your booking...</div>
      </div>
    );
  }

  if (!itinerary || !bookingResponse) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">No booking information found.</div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-900 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="bg-gray-800 rounded-xl shadow-lg p-8 border border-gray-700">
          <div className="text-center mb-8">
            {bookingStatus === 'success' ? (
              <div className="text-green-500 text-6xl mb-4">✓</div>
            ) : bookingStatus === 'error' ? (
              <div className="text-red-500 text-6xl mb-4">✕</div>
            ) : (
              <div className="text-blue-500 text-6xl mb-4">⌛</div>
            )}
            <h1 className="text-3xl font-bold text-white mb-4">
              {bookingStatus === 'success' 
                ? 'Booking Confirmed!' 
                : bookingStatus === 'error' 
                ? 'Booking Failed' 
                : 'Processing Booking'}
            </h1>
            <p className="text-gray-300">
              {bookingStatus === 'success' 
                ? 'Your trip has been successfully booked. You will receive a confirmation email shortly.'
                : bookingStatus === 'error'
                ? 'There was an error processing your booking. Please try again.'
                : 'Please wait while we process your booking...'}
            </p>
          </div>

          {bookingStatus === 'success' && bookingResponse?.bookings && (
            <>
              <div className="bg-gray-700 rounded-lg p-6 mb-8">
                <h2 className="text-xl font-semibold text-white mb-4">Flight Details</h2>
                <div className="space-y-4">
                  {bookingResponse.bookings.flights.map((flight, index) => (
                    <div key={index} className="bg-gray-800 p-4 rounded-lg">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-white font-medium">{flight.airline} - {flight.flightNumber}</p>
                          <p className="text-gray-300">
                            {new Date(flight.departure.time).toLocaleString()} - {flight.departure.airport}
                          </p>
                          <p className="text-gray-300">
                            {new Date(flight.arrival.time).toLocaleString()} - {flight.arrival.airport}
                          </p>
                          <p className="text-gray-300">Class: {flight.class}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-white font-medium">${flight.price}</p>
                          {flight.loyaltyPoints > 0 && (
                            <p className="text-gray-300">+{flight.loyaltyPoints} points</p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-gray-700 rounded-lg p-6 mb-8">
                <h2 className="text-xl font-semibold text-white mb-4">Hotel Details</h2>
                <div className="space-y-4">
                  {bookingResponse.bookings.hotels.map((hotel, index) => (
                    <div key={index} className="bg-gray-800 p-4 rounded-lg">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-white font-medium">{hotel.name}</p>
                          <p className="text-gray-300">Type: {hotel.type}</p>
                          <p className="text-gray-300">Room: {hotel.roomType}</p>
                          <p className="text-gray-300">
                            Check-in: {new Date(hotel.checkIn).toLocaleDateString()}
                          </p>
                          <p className="text-gray-300">
                            Check-out: {new Date(hotel.checkOut).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-white font-medium">${hotel.price}</p>
                          {hotel.loyaltyPoints > 0 && (
                            <p className="text-gray-300">+{hotel.loyaltyPoints} points</p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-gray-700 rounded-lg p-6 mb-8">
                <h2 className="text-xl font-semibold text-white mb-4">Booking Summary</h2>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <p className="text-gray-300">Total Cost:</p>
                    <p className="text-white font-medium">${bookingResponse.bookings.totalCost}</p>
                  </div>
                  {bookingResponse.bookings.estimatedSavings > 0 && (
                    <div className="flex justify-between items-center">
                      <p className="text-gray-300">Estimated Savings:</p>
                      <p className="text-green-500 font-medium">${bookingResponse.bookings.estimatedSavings}</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-gray-700 rounded-lg p-6 mb-8">
                <h2 className="text-xl font-semibold text-white mb-4">What's Next?</h2>
                <div className="space-y-4">
                  <p className="text-gray-300">
                    • Check your email for booking confirmation and detailed itinerary
                  </p>
                  <p className="text-gray-300">
                    • Review your packing list and prepare for your trip
                  </p>
                  <p className="text-gray-300">
                    • Download our mobile app for real-time updates and support
                  </p>
                </div>
              </div>

              <div className="flex justify-center space-x-4">
                <PDFDownloadLink
                  document={<ItineraryPDF itinerary={itinerary} bookingResponse={bookingResponse} />}
                  fileName={`itinerary-${itinerary.traveler.destination}-${itinerary.traveler.travelDates.start}.pdf`}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2"
                >
                  {({ loading }) =>
                    loading ? (
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Preparing PDF...</span>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                        <span>Download Full Itinerary</span>
                      </div>
                    )
                  }
                </PDFDownloadLink>
                <button
                  onClick={() => router.push('/')}
                  className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                >
                  Plan Another Trip
                </button>
              </div>
            </>
          )}

          {bookingStatus === 'error' && (
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => router.push('/itinerary')}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Try Again
              </button>
              <button
                onClick={() => router.push('/')}
                className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
              >
                Go Home
              </button>
            </div>
          )}
        </div>
      </div>
    </main>
  );
} 