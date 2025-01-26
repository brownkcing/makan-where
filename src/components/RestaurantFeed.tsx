"use client";

import { useState } from "react";
import { Restaurant } from "@/lib/types";
import { RestaurantCard } from "./RestaurantCard";
import QuickFilters from "./QuickFilters";
import { Sparkles } from "lucide-react";
import { aiRecommendStore, recommendationStore } from "@/store/apistore";

interface RestaurantFeedProps {
  onRecommendationsChange?: (restaurants: Restaurant[]) => void;
}

interface AiRecommendation {
  recommendation: Restaurant;
  explanation: string;
}

export default function RestaurantFeed({
  onRecommendationsChange,
}: RestaurantFeedProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [recommendations, setRecommendations] = useState<Restaurant[]>([]);
  const [aiRecommendation, setAiRecommendation] =
    useState<AiRecommendation | null>(null);

  const findRestaurants = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const position = await new Promise<GeolocationPosition>(
        (resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject);
        }
      );

      const response = await recommendationStore.callApi("POST", {
        userLocation: {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        },
        currentHour: new Date().getHours(),
        filters: activeFilters,
      });

      if (!response.success) {
        throw new Error(response.error || "Failed to get recommendations");
      }

      const restaurants = response.data;
      setRecommendations(restaurants);
      onRecommendationsChange?.(restaurants);

      //AI recommendations
      if (restaurants?.length) {
        const aiResponse = await aiRecommendStore.callApi("POST", {
          timeOfDay: new Date().getHours(),
          availableRestaurants: restaurants,
          userPreferences: {
            dietary: {
              halal: activeFilters.includes("halal"),
              vegetarian: activeFilters.includes("vegetarian"),
            },
          },
        });

        if (aiResponse.success && aiResponse.data.data) {
          const { recommendation, explanation } = aiResponse.data.data;
          if (recommendation) {
            setAiRecommendation({
              recommendation,
              explanation,
            });
          }
        }
      }
    } catch (error: unknown) {
      console.error("Error:", error);
      const errorMessage =
        error instanceof Error && error.message === "User denied Geolocation"
          ? "Please enable location access to find nearby restaurants."
          : "Unable to find restaurants. Please try again.";
      setError(errorMessage);
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

      {aiRecommendation && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-5 h-5 text-blue-500" />
            <h3 className="font-semibold text-lg">AI Recommendation</h3>
          </div>
          <RestaurantCard
            restaurant={aiRecommendation.recommendation}
            aiExplanation={aiRecommendation.explanation}
            isAiRecommendation={true}
          />
        </div>
      )}

      <div className="space-y-4">
        {recommendations.map((restaurant) => (
          <RestaurantCard key={restaurant.id} restaurant={restaurant} />
        ))}
      </div>
    </div>
  );
}
