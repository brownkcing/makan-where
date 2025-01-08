'use client';

import { useState } from 'react';
import { X } from 'lucide-react';
import MapView from './MapView';
import { Restaurant } from '@/lib/types';

interface MapViewDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  restaurants: Restaurant[];
}

export default function MapViewDrawer({ isOpen, onClose, restaurants }: MapViewDrawerProps) {
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 z-50"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div 
        className={`
          absolute inset-y-0 right-0 w-full md:w-[400px] bg-white shadow-lg
          transform transition-transform duration-300 ease-in-out
        `}
      >
        <div className="h-full flex flex-col">
          <div className="p-4 border-b flex justify-between items-center">
            <h2 className="text-lg font-semibold text-black">Nearby Restaurants</h2>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 relative">
            <MapView 
              restaurants={restaurants}
              onSelectRestaurant={(id) => {
                const restaurant = restaurants.find(r => r.id === id);
                setSelectedRestaurant(restaurant || null);
              }}
              className="h-full"
            />
          </div>

          {selectedRestaurant && (
            <div className="border-t p-4">
              <h3 className="font-semibold text-black">{selectedRestaurant.name}</h3>
              <p className="text-sm text-black mt-1">{selectedRestaurant.address}</p>
              <div className="flex gap-2 mt-3">
                <button className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg text-sm hover:bg-blue-700 transition-colors">
                  Get Directions
                </button>
                <button className="flex-1 bg-gray-100 py-2 px-4 rounded-lg text-sm hover:bg-gray-200 transition-colors text-black">
                  View Details
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}