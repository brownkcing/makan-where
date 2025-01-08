import { NextResponse } from 'next/server';
import type { Restaurant, UserPreferences } from '@/lib/types';

// This would eventually be replaced with a real ML model
function calculateRestaurantScore(
  restaurant: Restaurant,
  preferences: UserPreferences,
  userHistory: any[], // This would be actual user history data
  timeOfDay: number
): number {
  let score = 0;

  // Budget match
  const budgetMap = { simple: 1, modest: 2, extravagant: 3 };
  if (restaurant.priceLevel === budgetMap[preferences.budget]) {
    score += 3;
  }

  // Dietary preferences match
  if (preferences.dietary.halal && restaurant.dietaryOptions.halal) {
    score += 2;
  }
  if (preferences.dietary.vegetarian && restaurant.dietaryOptions.vegetarian) {
    score += 2;
  }

  // Cuisine type preferences
  if (preferences.favoriteTypes.some(type => restaurant.cuisine.includes(type))) {
    score += 2;
  }
  if (preferences.avoidTypes.some(type => restaurant.cuisine.includes(type))) {
    score -= 3;
  }

  // Time-based scoring
  const isPopularAtThisHour = restaurant.peakHours.includes(timeOfDay.toString());
  if (isPopularAtThisHour) {
    score += 1;
  }

  // History-based scoring (simplified)
  const visitCount = userHistory.filter(visit => visit.restaurantId === restaurant.id).length;
  if (visitCount > 0) {
    score += 1; // Familiar place
    if (visitCount > 5) {
      score -= 1; // But don't suggest the same place too often
    }
  }

  return score;
}

export async function POST(request: Request) {
  try {
    const { preferences, location } = await request.json();
    
    // Mock data - In production, this would come from your database
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
      {
        id: '2',
        name: 'Veggie Haven',
        cuisine: ['Vegetarian', 'Indian'],
        distance: '0.5 km',
        rating: 4.3,
        priceLevel: 2,
        dietaryOptions: {
          halal: true,
          vegetarian: true
        },
        popularDishes: [
          { name: 'Mixed Veg Rice', price: 6.50, rating: 4.7, orderCount: 800 },
          { name: 'Mushroom Curry', price: 5.50, rating: 4.5, orderCount: 600 }
        ],
        peakHours: ['12', '13', '19', '20'],
        currentWaitTime: 10
      },
      // Add more mock restaurants...
    ];

    // Get current hour for time-based recommendations
    const currentHour = new Date().getHours();

    // Mock user history - In production, this would come from your database
    const mockUserHistory: any[] = [];

    // Score and sort restaurants
    const scoredRestaurants = mockRestaurants
      .map(restaurant => ({
        restaurant,
        score: calculateRestaurantScore(
          restaurant,
          preferences,
          mockUserHistory,
          currentHour
        )
      }))
      .sort((a, b) => b.score - a.score);

    // Return top 3 recommendations
    return NextResponse.json({
      recommendations: scoredRestaurants.slice(0, 3).map(item => item.restaurant)
    });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}