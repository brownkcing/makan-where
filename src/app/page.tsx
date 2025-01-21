"use client";

import { useState } from "react";
import Header from "@/components/Header";
import RestaurantFeed from "@/components/RestaurantFeed";
import MapViewDrawer from "@/components/maps/MapViewDrawer";
import type { Restaurant } from "@/lib/types";

export default function Home() {
  const [isMapOpen, setIsMapOpen] = useState(false);
  const [recommendations, setRecommendations] = useState<Restaurant[]>([]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onMapClick={() => setIsMapOpen(true)} />

      <main className="max-w-2xl mx-auto p-4">
        <RestaurantFeed onRecommendationsChange={setRecommendations} />
      </main>

      <MapViewDrawer
        isOpen={isMapOpen}
        onClose={() => setIsMapOpen(false)}
        restaurants={recommendations}
      />
    </div>
  );
}
