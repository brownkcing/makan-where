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
  isOpenNow?: boolean;
  address: string;
  currentWaitTime: number;
}

export interface UserPreferences {
  budget: "simple" | "modest" | "extravagant";
  dietary: {
    halal: boolean;
    vegetarian: boolean;
  };
  hungerLevel: "light" | "normal" | "very hungry";
  favoriteTypes: string[];
  avoidTypes: string[];
}
