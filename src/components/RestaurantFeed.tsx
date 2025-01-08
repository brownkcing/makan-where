'use client';

import { useState } from 'react';
import RestaurantCard from './RestaurantCard';
import { Restaurant } from '@/lib/types';
import {QuickFilters} from './QuickFilters';

export default function RestaurantFeed() {
  const [isLoading, setIsLoading] = useState(false);
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);

  const getRecommendations = async () => {
    setIsLoading(true);
    try {
      // Mock data for now
      const mockRestaurants: Restaurant[] = [
        {
          id: '1',
          name: 'Nasi Lemak Paradise',
          cuisine: ['Malaysian', 'Halal'],
          distance: '0.3 km',
          rating: 4.5,
          priceLevel: 1,
          dietaryOptions: {
            halal: true,
            vegetarian: false
          },
          popularDishes: [
            { name: 'Special Nasi Lemak', price: 5.50, rating: 4.8, orderCount: 1000 },
            { name: 'Mee Goreng', price: 4.50, rating: 4.6, orderCount: 500 }
          ],
          peakHours: ['7', '8', '12', '13', '18', '19'],
          currentWaitTime: 15
        },
        // Add more mock restaurants...
      ];
      setRestaurants(mockRestaurants);
    } catch (error) {
      console.error('Error fetching recommendations:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm p-4 space-y-4">
        <h2 className="text-lg font-semibold">Where to eat?</h2>
        <QuickFilters />
        <button
          onClick={getRecommendations}
          disabled={isLoading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg disabled:opacity-50 transition-colors"
        >
          {isLoading ? 'Finding places...' : 'Find me a place!'}
        </button>
      </div>

      <div className="space-y-4">
        {restaurants.map((restaurant) => (
          <RestaurantCard 
            key={restaurant.id} 
            restaurant={restaurant}
          />
        ))}
      </div>
    </div>
  );
}