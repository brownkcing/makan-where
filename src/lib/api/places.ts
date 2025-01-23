import { Client } from "@googlemaps/google-maps-services-js";

const client = new Client({});

export async function searchNearbyRestaurants(location: {
  lat: number;
  lng: number;
}) {
  const { data } = await client.placesNearby({
    params: {
      location,
      radius: 1500,
      type: "restaurant",
      key: process.env.GOOGLE_PLACES_API_KEY!,
      opennow: true,
    },
  });

  return data;
}

export async function getPlaceDetails(placeId: string) {
  const { data } = await client.placeDetails({
    params: {
      place_id: placeId,
      fields: [
        "name",
        "rating",
        "price_level",
        "opening_hours",
        "formatted_address",
        "geometry",
        "photos",
        "types",
      ],
      key: process.env.GOOGLE_PLACES_API_KEY!,
    },
  });

  return data;
}
