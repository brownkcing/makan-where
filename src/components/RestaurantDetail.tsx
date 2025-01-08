'use client';

import { useState } from 'react';
import { ArrowLeft, Clock, MapPin, Share2, Heart, Star, Phone, DollarSign, Users } from 'lucide-react';
import Link from 'next/link';

export default function RestaurantDetail({ id }: { id: string }) {
  const [isFavorited, setIsFavorited] = useState(false);
  
  // Mock data - Replace with actual data fetch
  const restaurant = {
    id,
    name: 'Nasi Lemak Paradise',
    rating: 4.5,
    totalReviews: 1287,
    cuisine: ['Malaysian', 'Halal'],
    priceLevel: 2,
    distance: '0.3 km',
    address: '123 Food Street, #01-23',
    phone: '+65 9876 5432',
    openingHours: '8:00 AM - 10:00 PM',
    currentWaitTime: 15,
    dietaryOptions: {
      halal: true,
      vegetarian: false
    },
    popularDishes: [
      { name: 'Special Nasi Lemak', price: 5.50, rating: 4.8, orderCount: 1000 },
      { name: 'Mee Goreng', price: 4.50, rating: 4.6, orderCount: 500 },
      { name: 'Roti Prata', price: 3.50, rating: 4.7, orderCount: 800 }
    ],
    photos: ['/api/placeholder/400/300', '/api/placeholder/400/300', '/api/placeholder/400/300']
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 bg-white shadow-sm z-10">
        <div className="max-w-2xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="p-2 -ml-2 hover:bg-gray-100 rounded-full">
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <div className="flex gap-2">
            <button 
              onClick={() => setIsFavorited(!isFavorited)}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <Heart className={`w-6 h-6 ${isFavorited ? 'fill-red-500 text-red-500' : ''}`} />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-full">
              <Share2 className="w-6 h-6" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto p-4">
        {/* Photo Gallery */}
        <div className="overflow-x-auto mb-6">
          <div className="flex gap-4">
            {/* {restaurant.photos.map((photo, index) => (
              <img
                key={index}
                src={photo}
                alt={`${restaurant.name} photo ${index + 1}`}
                className="w-72 h-48 rounded-lg object-cover flex-none"
              />
            ))} */}
          </div>
        </div>

        {/* Restaurant Info */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-4">
          <h1 className="text-2xl font-bold mb-2">{restaurant.name}</h1>
          
          <div className="flex items-center gap-2 mb-4">
            <div className="flex items-center">
              <Star className="w-5 h-5 text-yellow-400 fill-current" />
              <span className="ml-1 font-medium">{restaurant.rating}</span>
            </div>
            <span className="text-gray-600">({restaurant.totalReviews} reviews)</span>
          </div>

          <div className="flex flex-wrap gap-2 mb-4">
            {restaurant.cuisine.map((type) => (
              <span 
                key={type}
                className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-sm font-medium"
              >
                {type}
              </span>
            ))}
          </div>

          <div className="space-y-3 text-gray-600">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              <span>{restaurant.openingHours}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              <span>{restaurant.address}</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-5 h-5" />
              <span>{restaurant.phone}</span>
            </div>
            <div className="flex items-center gap-2">
              <DollarSign className="w-5 h-5" />
              <span>{'$'.repeat(restaurant.priceLevel)}</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              <span>Current wait: ~{restaurant.currentWaitTime} mins</span>
            </div>
          </div>
        </div>

        {/* Popular Dishes */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-4">
          <h2 className="text-xl font-bold mb-4">Popular Dishes</h2>
          <div className="space-y-4">
            {restaurant.popularDishes.map((dish) => (
              <div 
                key={dish.name}
                className="flex items-center justify-between pb-4 border-b last:border-0"
              >
                <div>
                  <h3 className="font-medium">{dish.name}</h3>
                  <div className="flex items-center gap-2 mt-1 text-sm text-gray-600">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span>{dish.rating}</span>
                    <span>•</span>
                    <span>{dish.orderCount.toLocaleString()} orders</span>
                  </div>
                </div>
                <span className="font-medium">${dish.price.toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4">
          <div className="max-w-2xl mx-auto flex gap-4">
            <button className="flex-1 bg-gray-100 hover:bg-gray-200 py-3 px-4 rounded-lg font-medium">
              Call Restaurant
            </button>
            <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-medium">
              Get Directions
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}