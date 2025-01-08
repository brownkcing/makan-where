'use client';

import { useState } from 'react';
import { Heart, Clock, Tag, ChevronDown } from 'lucide-react';
import { motion } from 'framer-motion';
import { Restaurant } from '@/lib/types';

interface RestaurantCardProps {
  restaurant: Restaurant;
}

export const RestaurantCard = ({ restaurant }: RestaurantCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);

  return (
    <motion.div 
      className="bg-white rounded-lg shadow-md overflow-hidden"
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
    >
      {/* Restaurant Image */}
      <div className="relative h-48 bg-gray-200">
        {/* <img 
          src="/api/placeholder/400/200" 
          alt={restaurant.name}
          className="w-full h-full object-cover"
        /> */}
        <button 
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setIsFavorited(!isFavorited);
          }}
          className="absolute top-4 right-4 p-2 rounded-full bg-white/80 backdrop-blur-sm"
        >
          <Heart 
            className={`w-5 h-5 ${isFavorited ? 'fill-red-500 text-red-500' : 'text-black'}`} 
          />
        </button>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex justify-between items-start mb-3">
          <div>
            <h3 className="text-xl font-bold text-black">{restaurant.name}</h3>
            <div className="flex gap-2 mt-1">
              <span className="flex items-center gap-1 text-black">
                <Clock className="w-4 h-4" />
                {restaurant.currentWaitTime}min
              </span>
              <span className="flex items-center gap-1 text-black">
                <Tag className="w-4 h-4" />
                {'💰'.repeat(restaurant.priceLevel)}
              </span>
            </div>
          </div>
          <button 
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <motion.div
              animate={{ rotate: isExpanded ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronDown className="w-5 h-5 text-black" />
            </motion.div>
          </button>
        </div>

        {/* Cuisine Tags */}
        <div className="flex flex-wrap gap-2 mb-3">
          {restaurant.cuisine.map((type: string) => (
            <span 
              key={type}
              className="px-2 py-1 bg-blue-50 text-blue-600 rounded-full text-sm font-medium"
            >
              {type}
            </span>
          ))}
        </div>

        {/* Dietary Options */}
        <div className="flex gap-2 mb-3">
          {restaurant.dietaryOptions.halal && (
            <span className="px-2 py-1 bg-green-50 text-green-700 rounded-full text-sm font-medium">
              Halal
            </span>
          )}
          {restaurant.dietaryOptions.vegetarian && (
            <span className="px-2 py-1 bg-green-50 text-green-700 rounded-full text-sm font-medium">
              Vegetarian
            </span>
          )}
        </div>

        {/* Popular Dishes Section */}
        {isExpanded && (
          <div className="border-t pt-3 mt-3">
            <h4 className="font-semibold text-black mb-2">Popular Dishes</h4>
            <div className="space-y-2">
              {restaurant.popularDishes.map((dish) => (
                <div key={dish.name} className="flex justify-between items-center">
                  <div>
                    <p className="font-medium text-black">{dish.name}</p>
                    <p className="text-sm text-black">
                      {dish.orderCount.toLocaleString()} orders
                    </p>
                  </div>
                  <p className="font-medium text-black">${dish.price.toFixed(2)}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};