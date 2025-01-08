import { Restaurant } from '@/lib/types';
import { Star, Clock, Users, Heart } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

interface RestaurantCardProps {
  restaurant: Restaurant;
}

export default function RestaurantCard({ restaurant }: RestaurantCardProps) {
  const getPriceIndicator = (level: number) => '💰'.repeat(level);
  const [isFavorited, setIsFavorited] = useState(false);
  
  return (
    <Link href={`/restaurant/${restaurant.id}`} className="block">
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
    <button 
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setIsFavorited(!isFavorited);
          }}
          className="absolute top-4 right-4 p-2 rounded-full bg-white/80 backdrop-blur-sm"
        >
          <Heart 
            className={`w-5 h-5 ${isFavorited ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} 
          />
        </button>
      <div className="p-4">
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-xl font-bold">{restaurant.name}</h3>
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 text-yellow-400 fill-current" />
            <span>{restaurant.rating.toFixed(1)}</span>
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex gap-2 flex-wrap">
            {restaurant.cuisine.map((type) => (
              <span key={type} className="px-2 py-1 bg-gray-100 rounded-full text-sm">
                {type}
              </span>
            ))}
          </div>
          
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <span>{getPriceIndicator(restaurant.priceLevel)}</span>
            <span>{restaurant.distance}</span>
          </div>
          
          {restaurant.dietaryOptions.halal && (
            <span className="inline-block px-2 py-1 bg-green-100 text-green-800 rounded text-sm">
              Halal
            </span>
          )}
          {restaurant.dietaryOptions.vegetarian && (
            <span className="inline-block px-2 py-1 bg-green-100 text-green-800 rounded text-sm ml-2">
              Vegetarian
            </span>
          )}
        </div>

        {restaurant.currentWaitTime && (
          <div className="mt-3 flex items-center gap-2 text-sm text-gray-600">
            <Clock className="w-4 h-4" />
            <span>~{restaurant.currentWaitTime} min wait</span>
            <Users className="w-4 h-4 ml-2" />
          </div>
        )}

        {restaurant.popularDishes && restaurant.popularDishes.length > 0 && (
          <div className="mt-4">
            <h4 className="font-semibold mb-2">Popular Dishes</h4>
            <div className="space-y-2">
              {restaurant.popularDishes.slice(0, 2).map((dish) => (
                <div key={dish.name} className="flex justify-between text-sm">
                  <span>{dish.name}</span>
                  <span className="text-gray-600">${dish.price.toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
    </Link>
  );
}