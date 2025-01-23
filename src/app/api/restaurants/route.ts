import { NextResponse } from "next/server";
import {
  searchNearbyRestaurants,
  getRestaurantDetails,
} from "@/services/places";
import type { Restaurant } from "@/lib/types";

export async function POST(request: Request) {
  try {
    const { filters, userLocation } = await request.json();

    // Get nearby restaurants from Google Places
    const placesResponse = await searchNearbyRestaurants(userLocation);
    const restaurants = await Promise.all(
      placesResponse.results.map(async (place: any) => {
        const details = await getRestaurantDetails(place.place_id);
        return {
          id: place.place_id,
          name: place.name,
          cuisine: place.types.filter(
            (type: string) =>
              !["restaurant", "food", "establishment"].includes(type)
          ),
          distance: `${(place.distance / 1000).toFixed(1)} km`,
          rating: place.rating,
          priceLevel: place.price_level || 1,
          coordinates: {
            lat: place.geometry.location.lat,
            lng: place.geometry.location.lng,
          },
          dietaryOptions: {
            halal: place.types.includes("halal"),
            vegetarian: place.types.includes("vegetarian"),
          },
          currentWaitTime: Math.floor(Math.random() * 30), // Placeholder until we have real data
          address: details.result.formatted_address,
          photos:
            details.result.photos?.map((photo: any) => photo.photo_reference) ||
            [],
        };
      })
    );

    let filtered = restaurants;

    // Apply filters
    if (filters?.length > 0) {
      if (filters.includes("halal")) {
        filtered = filtered.filter((r) => r.dietaryOptions.halal);
      }
      if (filters.includes("vegetarian")) {
        filtered = filtered.filter((r) => r.dietaryOptions.vegetarian);
      }
    }

    return NextResponse.json(filtered);
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch restaurants" },
      { status: 500 }
    );
  }
}
