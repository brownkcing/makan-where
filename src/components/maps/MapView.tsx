"use client";

import { useState } from "react";
import {
  GoogleMap,
  useJsApiLoader,
  InfoWindow,
  Marker,
} from "@react-google-maps/api";
import { Restaurant } from "@/lib/types";
import { Locate } from "lucide-react";

const containerStyle = {
  width: "100%",
  height: "100%",
};

const defaultCenter = {
  lat: 3.139,
  lng: 101.6869,
};

interface MapViewProps {
  restaurants?: Restaurant[];
  onSelectRestaurant?: (id: string | null) => void;
  className?: string;
}

export default function MapView({
  restaurants = [],
  onSelectRestaurant,
  className = "h-[400px]",
}: MapViewProps) {
  const [selectedMarkerId, setSelectedMarkerId] = useState<string | null>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [userLocation, setUserLocation] =
    useState<google.maps.LatLngLiteral | null>(null);

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
    libraries: ["places"],
  });

  const handleLocationClick = () => {
    setIsLocating(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          console.log("Position accuracy:", position.coords.accuracy, "meters");

          const pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          console.log("Current position:", pos);

          setUserLocation(pos);
          map?.panTo(pos);
          map?.setZoom(17);
          setIsLocating(false);
        },
        (error) => {
          // Handle specific error cases
          switch (error.code) {
            case error.PERMISSION_DENIED:
              console.error(
                "Please allow location access in your browser settings"
              );
              // User needs to enable location in Chrome settings
              break;
            case error.POSITION_UNAVAILABLE:
              console.error("Location information unavailable");
              break;
            case error.TIMEOUT:
              console.error("Location request timed out");
              break;
            default:
              console.error("An unknown error occurred");
          }
          setIsLocating(false);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        }
      );
    }
  };

  if (!isLoaded)
    return <div className={`${className} bg-gray-100 animate-pulse`} />;

  return (
    <div className={`relative ${className}`}>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={userLocation || defaultCenter}
        zoom={15}
        onLoad={setMap}
        options={{
          zoomControl: true,
          streetViewControl: true,
          fullscreenControl: true,
          mapTypeControl: false,
          scaleControl: false,
          streetViewControlOptions: {
            position: google.maps.ControlPosition.RIGHT_TOP,
          },
          zoomControlOptions: {
            position: google.maps.ControlPosition.RIGHT_TOP,
          },
        }}
      >
        {/* User location marker */}
        {userLocation && (
          <Marker
            position={userLocation}
            icon={{
              path: google.maps.SymbolPath.CIRCLE,
              scale: 8,
              fillColor: "#4285F4",
              fillOpacity: 1,
              strokeColor: "#ffffff",
              strokeWeight: 2,
            }}
          />
        )}

        {/* Restaurant markers */}
        {restaurants.map(
          (restaurant) =>
            restaurant.coordinates && (
              <Marker
                key={restaurant.id}
                position={{
                  lat: restaurant.coordinates.lat,
                  lng: restaurant.coordinates.lng,
                }}
                onClick={() => {
                  setSelectedMarkerId(restaurant.id);
                  onSelectRestaurant?.(restaurant.id);
                }}
              >
                {selectedMarkerId === restaurant.id && (
                  <InfoWindow
                    onCloseClick={() => {
                      setSelectedMarkerId(null);
                      onSelectRestaurant?.(null);
                    }}
                  >
                    <div className="p-2">
                      <h3 className="font-medium text-black">
                        {restaurant.name}
                      </h3>
                      <p className="text-sm text-black">
                        {restaurant.cuisine.join(", ")}
                      </p>
                      <p className="text-sm text-black mt-1">
                        {restaurant.distance}
                      </p>
                    </div>
                  </InfoWindow>
                )}
              </Marker>
            )
        )}
      </GoogleMap>

      <button
        onClick={handleLocationClick}
        disabled={isLocating}
        className={`
          absolute bottom-4 right-4 p-3 bg-white rounded-full shadow-lg
          hover:bg-gray-50 transition-all
          ${isLocating ? "animate-pulse" : ""}
        `}
        aria-label="Find my location"
      >
        <Locate
          className={`w-5 h-5 ${isLocating ? "text-blue-600" : "text-black"}`}
        />
      </button>
    </div>
  );
}
