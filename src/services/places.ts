const PLACES_API_BASE = "https://maps.googleapis.com/maps/api/place";

export async function searchNearbyRestaurants(location: {
  lat: number;
  lng: number;
}) {
  const response = await fetch(
    `${PLACES_API_BASE}/nearbysearch/json?location=${location.lat},${location.lng}&radius=1500&type=restaurant&key=${process.env.GOOGLE_PLACES_API_KEY}`
  );

  if (!response.ok) throw new Error("Failed to fetch restaurants");

  return response.json();
}

export async function getRestaurantDetails(placeId: string) {
  const response = await fetch(
    `${PLACES_API_BASE}/details/json?place_id=${placeId}&fields=name,rating,price_level,opening_hours,photos,formatted_address,geometry&key=${process.env.GOOGLE_PLACES_API_KEY}`
  );

  if (!response.ok) throw new Error("Failed to fetch restaurant details");

  return response.json();
}
