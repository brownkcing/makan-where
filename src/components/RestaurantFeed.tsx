"use client";

import { useState } from "react";
import { Restaurant } from "@/lib/types";
import { RestaurantCard } from "./RestaurantCard";
import QuickFilters from "./QuickFilters";

interface RestaurantFeedProps {
  onRecommendationsChange?: (restaurants: Restaurant[]) => void;
}

export default function RestaurantFeed({
  onRecommendationsChange,
}: RestaurantFeedProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [recommendations, setRecommendations] = useState<Restaurant[]>([]); // Add this state

  const findRestaurants = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const position = await new Promise<GeolocationPosition>(
        (resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject);
        }
      );

      const userLocation = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      };

      const response = await fetch("/api/recommendations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userLocation,
          currentHour: new Date().getHours(),
          filters: activeFilters,
        }),
      });

      if (!response.ok) throw new Error("Failed to get recommendations");

      const data = await response.json();
      setRecommendations(data); // Set local state
      onRecommendationsChange?.(data); // Update parent state
    } catch (error) {
      console.error("Error:", error);
      if (error instanceof Error)
      setError(
        (error).message === "User denied Geolocation"
          ? "Please enable location access to find nearby restaurants."
          : "Unable to find restaurants. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm p-4 space-y-4">
        <h2 className="text-xl font-bold text-black">Where to eat?</h2>
        <QuickFilters
          activeFilters={activeFilters}
          onFilterChange={setActiveFilters}
        />
        <button
          onClick={findRestaurants}
          disabled={isLoading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg disabled:opacity-50 transition-colors"
        >
          {isLoading ? "Finding places..." : "Find me a place!"}
        </button>
        {error && <p className="text-red-600 text-sm">{error}</p>}
      </div>

      {/* Add this section to display restaurants */}
      <div className="space-y-4">
        {recommendations.map((restaurant) => (
          <RestaurantCard key={restaurant.id} restaurant={restaurant} />
        ))}
      </div>
    </div>
  );
}
