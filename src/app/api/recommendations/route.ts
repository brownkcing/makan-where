import { NextResponse } from "next/server";
import { Client, Place } from "@googlemaps/google-maps-services-js";
import { Restaurant } from "@/lib/types";

type DietaryOptionsMap = { [key: string]: Restaurant["dietaryOptions"] };

const DIETARY_OPTIONS: DietaryOptionsMap = {
  "ChIJ-WGqCfu2zTERBPZRmyuVr6g": { halal: true, vegetarian: true },
  ChIJ6Sdk_vu2zTERgB6cjqYYPhc: { halal: true, vegetarian: false },
  ChIJKZ8v_vu2zTERCC6cjqYYPxx: { halal: false, vegetarian: true },
};

function getDietaryOptions(place: Place): Restaurant["dietaryOptions"] {
  if (place.place_id && DIETARY_OPTIONS[place.place_id]) {
    return DIETARY_OPTIONS[place.place_id];
  }

  const name = place.name?.toLowerCase() || "";
  return {
    halal:
      name.includes("halal") ||
      name.includes("muslim") ||
      name.includes("mamak"),
    vegetarian:
      name.includes("veg") ||
      name.includes("vegetarian") ||
      name.includes("vegan"),
  };
}

function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
    Math.cos((lat2 * Math.PI) / 180) *
    Math.sin(dLon / 2) *
    Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Number((R * c).toFixed(1));
}

const client = new Client({});

const RATING_WEIGHT = 2.5;
const MIN_REVIEWS = 20;
const PRIOR_RATING = 3.5;
const PRIOR_REVIEWS = 50;

export async function POST(request: Request) {
  try {
    const { userLocation, filters = [], query = "restaurant" } = await request.json();

    const { data: nearbyData } = await client.textSearch({
      params: {
        query,
        location: userLocation,
        radius: 5000,
        key: process.env.GOOGLE_PLACES_API_KEY!,
        opennow: true,
      },
    });

    const validRestaurants = nearbyData.results
      .map((place: Place): Restaurant | null => {
        if (!place.place_id || !place.geometry?.location) return null;

        const distance = calculateDistance(
          userLocation.lat,
          userLocation.lng,
          place.geometry.location.lat,
          place.geometry.location.lng
        );

                  return {
          id: place.place_id,
          name: place.name || "Unknown",
          cuisine: place.types?.filter(
            (type) => !["restaurant", "point_of_interest", "establishment"].includes(type)
          ) || [],
          distance: `${distance}km away`,
          rating: place.rating || 0,
          priceLevel: place.price_level || 1,
          coordinates: {
            lat: place.geometry.location.lat,
            lng: place.geometry.location.lng,
          },
          dietaryOptions: getDietaryOptions(place),
          isOpenNow: true,
          address: place.vicinity || "No address available",
          currentWaitTime: 0
        };
      })
      .filter((r): r is Restaurant => r !== null)
      .sort((a, b) => {
        // Calculate modified Bayesian average with confidence adjustment
        const getBayesianRating = (restaurant: Restaurant) => {
          // Get total reviews from Places API response
          const totalReviews = nearbyData.results.find(p => p.place_id === restaurant.id)?.user_ratings_total || 0;
          
          // If very few reviews, penalize the score
          if (totalReviews < MIN_REVIEWS) {
            return (restaurant.rating * totalReviews) / PRIOR_REVIEWS;
          }
          
          // Calculate Bayesian average
          const bayesianAverage = 
            ((PRIOR_RATING * PRIOR_REVIEWS) + (restaurant.rating * totalReviews)) / 
            (PRIOR_REVIEWS + totalReviews);
          
          // Reviews weight grows logarithmically to prevent extremely popular places from dominating
          const reviewsWeight = 1 + Math.log10(Math.max(totalReviews / PRIOR_REVIEWS, 1));
          
          return bayesianAverage * reviewsWeight * RATING_WEIGHT;
        };
        
        return getBayesianRating(b) - getBayesianRating(a);
      });

    let filteredRestaurants = validRestaurants;
    if (filters.includes("halal")) {
      filteredRestaurants = filteredRestaurants.filter(
        (r) => r.dietaryOptions.halal
      );
    }
    if (filters.includes("vegetarian")) {
      filteredRestaurants = filteredRestaurants.filter(
        (r) => r.dietaryOptions.vegetarian
      );
    }

    return NextResponse.json(filteredRestaurants.slice(0, 35));
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "Failed to get recommendations" },
      { status: 500 }
    );
  }
}