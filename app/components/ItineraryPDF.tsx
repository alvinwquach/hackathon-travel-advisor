import { Document, Page, Text, View, StyleSheet, PDFViewer } from '@react-pdf/renderer';
import { TravelItinerary } from '@/app/types/travel';
import { BookingResponse } from '@/app/types/booking';

const styles = StyleSheet.create({
  page: {
    padding: 30,
    backgroundColor: '#ffffff',
  },
  header: {
    marginBottom: 20,
    textAlign: 'center',
  },
  title: {
    fontSize: 24,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    marginBottom: 10,
    color: '#333',
  },
  card: {
    padding: 10,
    marginBottom: 10,
    border: '1px solid #ddd',
    borderRadius: 5,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  label: {
    color: '#666',
  },
  value: {
    color: '#333',
  },
  divider: {
    borderBottom: '1px solid #ddd',
    marginVertical: 10,
  },
});

type ItineraryPDFProps = {
  itinerary: TravelItinerary;
  bookingResponse: BookingResponse;
};

export const ItineraryPDF = ({ itinerary, bookingResponse }: ItineraryPDFProps) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <Text style={styles.title}>Travel Itinerary</Text>
        <Text style={styles.subtitle}>
          {itinerary.traveler.destination} • {itinerary.traveler.travelDates.start} to {itinerary.traveler.travelDates.end}
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Flight Details</Text>
        {bookingResponse.bookings.flights.map((flight, index) => (
          <View key={index} style={styles.card}>
            <View style={styles.row}>
              <Text style={styles.label}>Airline:</Text>
              <Text style={styles.value}>{flight.airline} - {flight.flightNumber}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Departure:</Text>
              <Text style={styles.value}>
                {new Date(flight.departure.time).toLocaleString()} - {flight.departure.airport}
              </Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Arrival:</Text>
              <Text style={styles.value}>
                {new Date(flight.arrival.time).toLocaleString()} - {flight.arrival.airport}
              </Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Class:</Text>
              <Text style={styles.value}>{flight.class}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Price:</Text>
              <Text style={styles.value}>${flight.price}</Text>
            </View>
          </View>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Hotel Details</Text>
        {bookingResponse.bookings.hotels.map((hotel, index) => (
          <View key={index} style={styles.card}>
            <View style={styles.row}>
              <Text style={styles.label}>Hotel:</Text>
              <Text style={styles.value}>{hotel.name}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Type:</Text>
              <Text style={styles.value}>{hotel.type}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Room:</Text>
              <Text style={styles.value}>{hotel.roomType}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Check-in:</Text>
              <Text style={styles.value}>{new Date(hotel.checkIn).toLocaleDateString()}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Check-out:</Text>
              <Text style={styles.value}>{new Date(hotel.checkOut).toLocaleDateString()}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Price:</Text>
              <Text style={styles.value}>${hotel.price}</Text>
            </View>
          </View>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Daily Itinerary</Text>
        {itinerary.itinerary.map((day, index) => (
          <View key={index} style={styles.card}>
            <Text style={styles.sectionTitle}>Day {index + 1} - {new Date(day.date).toLocaleDateString()}</Text>
            <Text style={styles.label}>Weather: {day.weather}</Text>
            <View style={styles.divider} />
            {day.activities.map((activity, activityIndex) => (
              <View key={activityIndex} style={{ marginBottom: 10 }}>
                <View style={styles.row}>
                  <Text style={styles.label}>Time:</Text>
                  <Text style={styles.value}>{activity.time}</Text>
                </View>
                <View style={styles.row}>
                  <Text style={styles.label}>Activity:</Text>
                  <Text style={styles.value}>{activity.activity}</Text>
                </View>
                {activity.location && (
                  <View style={styles.row}>
                    <Text style={styles.label}>Location:</Text>
                    <Text style={styles.value}>{activity.location}</Text>
                  </View>
                )}
                <View style={styles.row}>
                  <Text style={styles.label}>Cost:</Text>
                  <Text style={styles.value}>{activity.cost}</Text>
                </View>
                <View style={styles.row}>
                  <Text style={styles.label}>Transportation:</Text>
                  <Text style={styles.value}>{activity.transportation}</Text>
                </View>
              </View>
            ))}
          </View>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Booking Summary</Text>
        <View style={styles.card}>
          <View style={styles.row}>
            <Text style={styles.label}>Total Cost:</Text>
            <Text style={styles.value}>${bookingResponse.bookings.totalCost}</Text>
          </View>
          {bookingResponse.bookings.estimatedSavings > 0 && (
            <View style={styles.row}>
              <Text style={styles.label}>Estimated Savings:</Text>
              <Text style={styles.value}>${bookingResponse.bookings.estimatedSavings}</Text>
            </View>
          )}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Packing List</Text>
        <View style={styles.card}>
          {itinerary.packingList.map((item, index) => (
            <Text key={index} style={styles.value}>• {item}</Text>
          ))}
        </View>
      </View>
    </Page>
  </Document>
); 