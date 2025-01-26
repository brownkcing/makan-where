import { NextResponse } from "next/server";
import { Client, Place } from "@googlemaps/google-maps-services-js";

interface DietaryOptions {
  halal: boolean;
  vegetarian: boolean;
}

// interface Restaurant {
//   id: string;
//   name: string;
//   cuisine: string[];
//   distance: string;
//   rating: number;
//   userRatingsTotal?: number;
//   priceLevel: number;
//   coordinates: {
//     lat: number;
//     lng: number;
//   };
//   dietaryOptions: DietaryOptions;
//   isOpenNow: boolean;
//   address: string;
// }

// Type for our dietary options mapping
type DietaryOptionsMap = {
  [key: string]: DietaryOptions;
};

// Define known dietary options
const DIETARY_OPTIONS: DietaryOptionsMap = {
  "ChIJ-WGqCfu2zTERBPZRmyuVr6g": { halal: true, vegetarian: true }, // Example: Mamak restaurant
  ChIJ6Sdk_vu2zTERgB6cjqYYPhc: { halal: true, vegetarian: false }, // Example: Malay restaurant
  ChIJKZ8v_vu2zTERCC6cjqYYPxx: { halal: false, vegetarian: true }, // Example: Vegetarian restaurant
  // Add more as needed
};

// Helper function to determine dietary options
function getDietaryOptions(place: Place): DietaryOptions {
  // First check our known mappings
  if (place.place_id && DIETARY_OPTIONS[place.place_id]) {
    return DIETARY_OPTIONS[place.place_id];
  }

  // Otherwise try to infer from name and types
  const name = place.name?.toLowerCase() || "";

  return {
    halal:
      name.includes("halal") ||
      name.includes("muslim") ||
      name.includes("mamak"), // Only using name checks since 'muslim' isn't a valid AddressType
    vegetarian:
      name.includes("veg") ||
      name.includes("vegetarian") ||
      name.includes("vegan"),
  };
}

const client = new Client({});

// Rest of your existing code...
export async function POST(request: Request) {
  try {
    const { userLocation, filters = [] } = await request.json();

    const { data: nearbyData }: PlacesNearbyResponse =
      await client.placesNearby({
        params: {
          location: userLocation,
          radius: 1500,
          type: "restaurant",
          key: process.env.GOOGLE_PLACES_API_KEY!,
          opennow: true,
        },
      });

    const restaurants = await Promise.all(
      nearbyData.results.slice(0, 10).map(async (place: Place) => {
        if (!place.place_id || !place.geometry?.location) return null;

        const { data: placeDetails } = await client.placeDetails({
          params: {
            place_id: place.place_id,
            key: process.env.GOOGLE_PLACES_API_KEY!,
            fields: [
              "name",
              "rating",
              "user_ratings_total",
              "price_level",
              "opening_hours",
              "formatted_address",
              "geometry",
              "types",
              "reviews",
            ],
          },
        });

        return {
          id: place.place_id,
          name: place.name || "Unknown",
          cuisine:
            place.types?.filter(
              (type) =>
                ![
                  "restaurant",
                  "food",
                  "establishment",
                  "point_of_interest",
                ].includes(type)
            ) || [],
          distance: place.vicinity || "Unknown distance",
          rating: place.rating || 0,
          userRatingsTotal: place.user_ratings_total,
          priceLevel: place.price_level || 1,
          coordinates: {
            lat: place.geometry.location.lat,
            lng: place.geometry.location.lng,
          },
          dietaryOptions: getDietaryOptions(place),
          isOpenNow: Boolean(placeDetails.result.opening_hours?.open_now),
          address: place.vicinity || "No address available",
        };
      })
    );

    // Filter and sort restaurants
    const validRestaurants = restaurants
      .filter((r): r is NonNullable<typeof r> => r !== null)
      .sort((a, b) => (b.rating || 0) - (a.rating || 0));

    // Apply dietary filters
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

    return NextResponse.json(filteredRestaurants.slice(0, 5));
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "Failed to get recommendations" },
      { status: 500 }
    );
  }
}
