"use client";

import { useState } from "react";
import Header from "@/components/Header";
import MapViewDrawer from "@/components/maps/MapViewDrawer";
import { Restaurant } from "@/lib/types";

interface MainLayoutProps {
  children: React.ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  const [isMapOpen, setIsMapOpen] = useState(false);
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onMapClick={() => setIsMapOpen(true)} />
      <main className="max-w-2xl mx-auto p-4">{children}</main>
      <MapViewDrawer
        isOpen={isMapOpen}
        onClose={() => setIsMapOpen(false)}
        restaurants={restaurants}
      />
    </div>
  );
}
