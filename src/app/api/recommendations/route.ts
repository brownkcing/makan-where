// src/app/api/recommendations/route.ts
import { NextResponse } from "next/server";
import {
  Client,
  PlacesNearbyResponse,
  Place,
} from "@googlemaps/google-maps-services-js";

interface Restaurant {
  id: string;
  name: string;
  cuisine: string[];
  distance: string;
  rating: number;
  priceLevel: number;
  coordinates: {
    lat: number;
    lng: number;
  };
  dietaryOptions: {
    halal: boolean;
    vegetarian: boolean;
  };
  isOpenNow: boolean;
  address: string;
}

const client = new Client({});

export async function POST(request: Request) {
  try {
    const { userLocation } = await request.json();

    const { data: nearbyData }: PlacesNearbyResponse  = await client.placesNearby({
      params: {
        location: userLocation,
        radius: 1500,
        type: "restaurant",
        key: process.env.GOOGLE_PLACES_API_KEY!,
        opennow: true,
      },
    });

    const restaurants:(Restaurant | null)[] = await Promise.all(
      nearbyData.results.slice(0, 5).map(async (place: Place) => {
        if (!place.place_id || !place.geometry?.location) return null;

        const { data: placeDetails } = await client.placeDetails({
          params: {
            place_id: place.place_id,
            key: process.env.GOOGLE_PLACES_API_KEY!,
            fields: [
              "name",
              "rating",
              "price_level",
              "opening_hours",
              "formatted_address",
              "geometry",
              "types",
            ],
          },
        });

        return {
          id: place.place_id,
          name: place.name || "Unknown",
          cuisine:
            place.types?.filter(
              (type) => !["restaurant", "food", "establishment"].includes(type)
            ) || [],
          distance: place.vicinity || "Unknown distance",
          rating: place.rating || 0,
          priceLevel: place.price_level || 1,
          coordinates: {
            lat: place.geometry.location.lat,
            lng: place.geometry.location.lng,
          },
          dietaryOptions: {
            halal: false,
            vegetarian: false,
          },
          isOpenNow: Boolean(placeDetails.result.opening_hours?.open_now),
          address: place.vicinity || "No address available",
        };
      })
    );

    const validRestaurants = restaurants.filter(
      (r): r is NonNullable<typeof r> => r !== null
    );

    return NextResponse.json(validRestaurants);
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "Failed to get recommendations" },
      { status: 500 }
    );
  }
}
