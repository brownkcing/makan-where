export interface Restaurant {
    id: string;
    name: string;
    cuisine: string[];
    distance: string;
    rating: number;
    priceLevel: 1 | 2 | 3; // 1: simple, 2: modest, 3: extravagant
    dietaryOptions: {
      halal: boolean;
      vegetarian: boolean;
      other?: string[];
    };
    popularDishes: Array<{
      name: string;
      price: number;
      rating: number;
      orderCount: number;
    }>;
    peakHours: string[];
    currentWaitTime?: number;
    coordinates: {
        lat: number;
        lng: number;
      };
    address?: number | string;
  }
  
  export interface UserPreferences {
    budget: 'simple' | 'modest' | 'extravagant';
    dietary: {
      halal: boolean;
      vegetarian: boolean;
      other?: string[];
    };
    hungerLevel: 'light' | 'normal' | 'very hungry';
    favoriteTypes: string[];
    avoidTypes: string[];
  }