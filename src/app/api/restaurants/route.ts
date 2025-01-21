import { NextResponse } from "next/server";
import type { Restaurant } from "@/lib/types";

// Mock data - will be replaced with database calls later
const mockRestaurants: Restaurant[] = [
  {
    id: "1",
    name: "Nasi Lemak Paradise",
    cuisine: ["Malaysian", "Halal"],
    distance: "0.3 km",
    rating: 4.5,
    priceLevel: 1,
    coordinates: {
      lat: 3.139,
      lng: 101.6869,
    },
    dietaryOptions: {
      halal: true,
      vegetarian: false,
    },
    popularDishes: [
      { name: "Special Nasi Lemak", price: 5.5, rating: 4.8, orderCount: 1000 },
      { name: "Mee Goreng", price: 4.5, rating: 4.6, orderCount: 500 },
    ],
    peakHours: ["7", "8", "12", "13", "18", "19"],
    currentWaitTime: 15,
  },
  {
    id: "2",
    name: "Vegetarian Delight",
    cuisine: ["Chinese", "Vegetarian"],
    distance: "0.5 km",
    rating: 4.3,
    priceLevel: 2,
    coordinates: {
      lat: 3.1395,
      lng: 101.6875,
    },
    dietaryOptions: {
      halal: false,
      vegetarian: true,
    },
    popularDishes: [
      { name: "Mixed Veg Rice", price: 6.5, rating: 4.7, orderCount: 800 },
      { name: "Tofu Curry", price: 5.5, rating: 4.5, orderCount: 600 },
    ],
    peakHours: ["12", "13", "18", "19"],
    currentWaitTime: 10,
  },
];

export async function GET() {
  return NextResponse.json(mockRestaurants);
}

export async function POST(request: Request) {
  try {
    const { filters, userLocation, currentHour } = await request.json();

    let filtered = [...mockRestaurants];

    // Apply filters
    if (filters?.length > 0) {
      if (filters.includes("halal")) {
        filtered = filtered.filter((r) => r.dietaryOptions.halal);
      }
      if (filters.includes("vegetarian")) {
        filtered = filtered.filter((r) => r.dietaryOptions.vegetarian);
      }
    }

    // Apply location-based sorting if location is provided
    if (userLocation) {
      filtered = filtered
        .filter((r) => r.coordinates)
        .sort((a, b) => {
          if (!a.coordinates || !b.coordinates) return 0;
          const distA = calculateDistance(userLocation, a.coordinates);
          const distB = calculateDistance(userLocation, b.coordinates);
          return distA - distB;
        });
    }

    return NextResponse.json(filtered);
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: "Failed to process request" },
      { status: 500 }
    );
  }
}

function calculateDistance(
  point1: { lat: number; lng: number },
  point2: { lat: number; lng: number }
) {
  const R = 6371; // Earth's radius in km
  const dLat = toRad(point2.lat - point1.lat);
  const dLon = toRad(point2.lng - point1.lng);
  const lat1 = toRad(point1.lat);
  const lat2 = toRad(point2.lat);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRad(value: number) {
  return (value * Math.PI) / 180;
}
