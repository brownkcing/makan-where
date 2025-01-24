"use client";

import { useState } from "react";
import { Heart, Clock, ChevronDown, Star, MapPin } from "lucide-react";
import { motion } from "framer-motion";
import { Restaurant } from "@/lib/types";

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
      <div className="p-4">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <h3 className="text-xl font-bold text-black">{restaurant.name}</h3>
            <div className="flex items-center gap-2 mt-1">
              {restaurant.rating > 0 && (
                <span className="flex items-center gap-1 text-black">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  {restaurant.rating.toFixed(1)}
                </span>
              )}
              <span className="text-gray-600">•</span>
              <span className="text-black">
                {"$".repeat(restaurant.priceLevel)}
              </span>
              <span className="text-gray-600">•</span>
              <span className="text-black">{restaurant.distance}</span>
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

        <div className="flex flex-wrap gap-2 mt-3">
          {restaurant.cuisine.map((type) => (
            <span
              key={type}
              className="px-2 py-1 bg-blue-50 text-blue-600 rounded-full text-sm font-medium"
            >
              {type}
            </span>
          ))}
        </div>

        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="mt-4 pt-4 border-t"
          >
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-4 h-4 text-gray-600" />
              <span className="text-black">
                {restaurant.isOpenNow ? "Open" : "Closed"} •{" "}
                {restaurant.currentWaitTime}min wait
              </span>
            </div>

            <div className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-gray-600 mt-1" />
              <span className="text-black">{restaurant.address}</span>
            </div>

            <div className="mt-4 flex gap-2">
              <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg text-sm transition-colors">
                Get Directions
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsFavorited(!isFavorited);
                }}
                className={`p-2 rounded-lg transition-colors ${
                  isFavorited ? "bg-red-50" : "hover:bg-gray-100"
                }`}
              >
                <Heart
                  className={`w-5 h-5 ${
                    isFavorited ? "fill-red-500 text-red-500" : "text-gray-600"
                  }`}
                />
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};
