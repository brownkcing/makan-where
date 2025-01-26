import { NextResponse } from "next/server";
import {
  searchNearbyRestaurants,
  getRestaurantDetails,

} from "@/services/places";
import { Place } from "@googlemaps/google-maps-services-js";
import type { Restaurant } from "@/lib/types";

type RequestBody = {
  filters: string[];
  userLocation: {
    lat: number;
    lng: number;
  };
};

type PlacePhoto = {
  photo_reference: string;
};

interface Coordinates {
  lat: number;
  lng: number;
}

export async function POST(request: Request) {
  try {
    const { filters, userLocation }: RequestBody = await request.json();

    //Haversine formula 
    const  toRad = (degrees: number): number => {
      return degrees * (Math.PI/180);
    }

    const calculateDistance = (origin: Coordinates, destination: Coordinates): number  => {
      const R = 6371; // Earth's radius in km
      const dLat = toRad(destination.lat - origin.lat);
      const dLon = toRad(destination.lng - origin.lng);
      
      const a = 
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(toRad(origin.lat)) * Math.cos(toRad(destination.lat)) * 
        Math.sin(dLon/2) * Math.sin(dLon/2);
      
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
      return R * c;
    }

    const checkDietaryOption = (types: string[]) => ({
      halal: types.some(type => type.toLowerCase().includes('halal')),
      vegetarian: types.some(type => type.toLowerCase().includes('vegetarian'))
    });
    
    // Get nearby restaurants from Google Places
    const placesResponse = await searchNearbyRestaurants(userLocation);
    const restaurants:(Restaurant | null)[] = await Promise.all(
      placesResponse.results.map(async (place: Place) => {
        if (!place.place_id || !place.geometry?.location || !place.types) return null;
        const details = await getRestaurantDetails(place.place_id);
        return {
          id: place.place_id,
          name: place.name,
          cuisine: place.types.filter(
            (type: string) =>
              !["restaurant", "food", "establishment"].includes(type)
          ),
          distance: `${calculateDistance(userLocation, place.geometry.location).toFixed(1)} km`,
          rating: place.rating,
          priceLevel: place.price_level || 1,
          coordinates: {
            lat: place.geometry.location.lat,
            lng: place.geometry.location.lng,
          },
          dietaryOptions: checkDietaryOption(place.types),
          currentWaitTime: Math.floor(Math.random() * 30), // Placeholder until we have real data
          address: details.result.formatted_address,
          photos:
            details.result.photos?.map((photo: PlacePhoto) => photo.photo_reference) ||
            [],
        };
      })
    );

    let filtered = restaurants;

    // Apply filters
    if (filters?.length > 0) {
      if (filters.includes("halal")) {
        filtered = filtered.filter((r): r is Restaurant => r !== null && r.dietaryOptions.halal);
      }
      if (filters.includes("vegetarian")) {
        filtered = filtered.filter((r): r is Restaurant => r !== null && r.dietaryOptions.vegetarian);
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
