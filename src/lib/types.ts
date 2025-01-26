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
  userPreferences: {
    dietary: {
      halal: boolean;
      vegetarian: boolean;
    };
  };
  hungerLevel: "light" | "normal" | "very hungry";
  favoriteTypes: string[];
  avoidTypes: string[];
}

export interface PlaceResult {
  place_id: string;
  name: string;
  types: string[];
  distance: number;
  rating: number;
  price_level?: number;
  geometry: {
    location: {
      lat: number;
      lng: number;
    };
  };
}
