export async function geocodeAddress(address: string): Promise<{ lat: number; lon: number }> {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
        address
      )}`
    );
    const data = await response.json();

    if (data && data.length > 0) {
      return {
        lat: parseFloat(data[0].lat),
        lon: parseFloat(data[0].lon),
      };
    }

    return { lat: 0, lon: 0 };
  } catch (error) {
    console.error('Geocoding error:', error);
    return { lat: 0, lon: 0 };
  }
}
