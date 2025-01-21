export interface Restaurant {
  id: string;
  name: string;
  cuisine: string[];
  distance: string;
  rating: number;
  priceLevel: number;
  coordinates: {
    lat: number;
    lng: number;
  };
  dietaryOptions: {
    halal: boolean;
    vegetarian: boolean;
  };
  popularDishes: Array<{
    name: string;
    price: number;
    rating: number;
    orderCount: number;
  }>;
  peakHours: string[];
  currentWaitTime: number;
}

export interface UserPreferences {
  budget?: any;
  hungerLevel?: any;
  favoriteTypes?: any;
  avoidTypes?: any;
  dietary: {
    halal: boolean;
    vegetarian: boolean;
  };
}
