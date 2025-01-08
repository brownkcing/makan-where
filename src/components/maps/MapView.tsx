'use client';

import { useState, useEffect } from 'react';
import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from '@react-google-maps/api';
import { Restaurant } from '@/lib/types';

const containerStyle = {
  width: '100%',
  height: '100%',
};

const defaultCenter = {
  lat: 3.1390,
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
  className = 'h-[400px]',
}: MapViewProps) {
  const [selectedMarkerId, setSelectedMarkerId] = useState<string | null>(null);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
    libraries: ['places'],
  });

  useEffect(() => {
    // Fetch location using Google Geolocation API
    const fetchGoogleLocation = async () => {
      try {
        const response = await fetch(
          `https://www.googleapis.com/geolocation/v1/geolocate?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`,
          {
            method: 'POST',
          }
        );

        const data = await response.json();

        if (data.location) {
          const { lat, lng } = data.location;
          setUserLocation({ lat, lng });
        } else {
          console.log('Error fetching location');
          setUserLocation(defaultCenter);
        }
      } catch (error) {
        console.error('Error fetching Google geolocation:', error);
        setUserLocation(defaultCenter);
      }
    };

    fetchGoogleLocation();
  }, []);

  if (!isLoaded) return <div className={`${className} bg-gray-100 animate-pulse`} />;

  return (
    <div className={`relative ${className}`}>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={userLocation || defaultCenter}
        zoom={15}
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
        {/* Restaurant markers */}
        {restaurants.map((restaurant) => (
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
                    <h3 className="font-medium text-black">{restaurant.name}</h3>
                    <p className="text-sm text-black">{restaurant.cuisine.join(', ')}</p>
                    <p className="text-sm text-black mt-1">{restaurant.distance}</p>
                  </div>
                </InfoWindow>
              )}
            </Marker>
          )
        ))}
      </GoogleMap>
    </div>
  );
}
