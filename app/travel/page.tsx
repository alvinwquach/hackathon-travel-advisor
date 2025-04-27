"use client";

import { useState } from "react";
import Globe from "../components/Globe";
import { geocodeAddress } from "../util/geocodeAddress";

interface Place {
  name: string;
  longitude: number;
  latitude: number;
}

interface GeocodingError {
  status?: number;
  message?: string;
  details?: string;
}

export default function Home() {
  const [destination, setDestination] = useState<Place | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<GeocodingError | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const destinationName = formData.get("destination")?.toString().trim();

    if (!destinationName) {
      setError({
        message: "Please enter a destination.",
        details: "Required field cannot be empty",
      });
      setIsLoading(false);
      return;
    }

    try {
      const { lat, lon } = await geocodeAddress(destinationName);

      if (lat === 0 && lon === 0) {
        throw new Error("Destination not found");
      }

      setDestination({
        name: destinationName,
        longitude: lon,
        latitude: lat,
      });
    } catch (caughtError) {
      const errorDetails = {
        message: "Could not find that destination",
        details: "Try a different city or check your spelling",
      };

      if (caughtError instanceof Error) {
        console.error("Geocoding error:", caughtError.message);
        errorDetails.details += `. Technical error: ${caughtError.message}`;
      }

      setError(errorDetails);
      setDestination(null);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-16 row-start-2 items-center w-full">
        <Globe rotateTo={destination} />
        {error && (
          <div className="w-full max-w-md space-y-2">
            <p className="text-red-500 font-semibold text-center">
              {error.message}
            </p>
            {error.details && (
              <p className="text-red-300 text-sm text-center">
                {error.details}
              </p>
            )}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-6 w-full max-w-md"
        >
          <h2 className="text-2xl font-bold text-center">Plan Your Trip</h2>

          <div className="flex flex-col gap-2">
            <label htmlFor="destination" className="text-sm font-medium">
              Where do you want to go?
            </label>
            <input
              type="text"
              id="destination"
              name="destination"
              placeholder="Enter a destination (e.g., Paris)"
              className={`border rounded px-4 py-2 focus:outline-none focus:ring-2 ${
                error ? "border-red-500 focus:ring-red-500" : ""
              }`}
              disabled={isLoading}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="date" className="text-sm font-medium">
              When do you want to go?
            </label>
            <input
              type="date"
              id="date"
              name="date"
              className={`border rounded px-4 py-2 focus:outline-none focus:ring-2 ${
                error ? "border-red-500 focus:ring-red-500" : ""
              }`}
              disabled={isLoading}
            />
          </div>

          <button
            type="submit"
            className={`bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition-colors ${
              isLoading ? "opacity-80 cursor-not-allowed" : ""
            }`}
            disabled={isLoading}
          >
            {isLoading ? "Searching..." : "Submit"}
          </button>
        </form>
      </main>
    </div>
  );
}