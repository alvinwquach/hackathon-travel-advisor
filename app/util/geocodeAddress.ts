export async function geocodeAddress(
  address: string
): Promise<{ lat: number; lon: number }> {
  const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN ?? "";
  const geocodeUrl = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
    address
  )}.json?access_token=${mapboxToken}`;

  try {
    const response = await fetch(geocodeUrl, { cache: "force-cache" });
    if (!response.ok) {
      throw new Error(`Failed to geocode address: ${response.statusText}`);
    }
    const data = await response.json();
    const [lon, lat] = data.features[0]?.center ?? [0, 0];
    return { lat, lon };
  } catch (error) {
    console.error("Error geocoding address:", error);
    return { lat: 0, lon: 0 };
  }
}
