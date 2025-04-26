"use client";

import { useState } from "react";
import Globe from "../components/Globe";
import { geocodeAddress } from "../util/geocodeAddress";

interface Place {
  name: string;
  longitude: number;
  latitude: number;
}

export default function Home() {
  const [destination, setDestination] = useState<Place | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const destinationName = formData.get("destination")?.toString().trim();

    if (!destinationName) {
      setError("Please enter a destination.");
      setIsLoading(false);
      return;
    }

    try {
      const { lat, lon } = await geocodeAddress(destinationName);
      if (lat === 0 && lon === 0) {
        throw new Error("Destination not found.");
      }
      setDestination({
        name: destinationName,
        longitude: lon,
        latitude: lat,
      });
    } catch (err) {
      setError(
        "Could not find that destination. Try a different city or check your spelling."
      );
      setDestination(null);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-16 row-start-2 items-center w-full">
        <Globe rotateTo={destination} />
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-6 w-full max-w-md"
        >
          <h2 className="text-2xl font-bold text-center">Plan Your Trip</h2>

          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          <div className="flex flex-col gap-2">
            <label htmlFor="destination" className="text-sm font-medium">
              Where do you want to go?
            </label>
            <input
              type="text"
              id="destination"
              name="destination"
              placeholder="Enter a destination (e.g., Paris)"
              className="border rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600"
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
              className="border rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600"
              disabled={isLoading}
            />
          </div>

          <button
            type="submit"
            className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition-colors disabled:bg-blue-400"
            disabled={isLoading}
          >
            {isLoading ? "Searching..." : "Submit"}
          </button>
        </form>
      </main>
    </div>
  );
}
