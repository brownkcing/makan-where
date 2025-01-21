import { NextResponse } from "next/server";
import type { Restaurant } from "@/lib/types";

export async function POST(request: Request) {
  try {
    const {
      userLocation,
      currentHour,
      preferences,
      filters = [],
    } = await request.json();

    // First get all restaurants from main endpoint
    const response = await fetch(
      `${request.headers.get("origin")}/api/restaurants`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          filters,
          userLocation,
        }),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch restaurants");
    }

    let recommendations: Restaurant[] = await response.json();

    // Apply time-based sorting
    if (currentHour >= 6 && currentHour < 11) {
      // Breakfast time
      recommendations = recommendations.sort((a, b) => {
        const aIsBreakfast =
          a.peakHours.includes("7") || a.peakHours.includes("8");
        const bIsBreakfast =
          b.peakHours.includes("7") || b.peakHours.includes("8");
        return (bIsBreakfast ? 1 : 0) - (aIsBreakfast ? 1 : 0);
      });
    } else if (currentHour >= 11 && currentHour < 15) {
      // Lunch time
      recommendations = recommendations.sort((a, b) => {
        const aIsLunch =
          a.peakHours.includes("12") || a.peakHours.includes("13");
        const bIsLunch =
          b.peakHours.includes("12") || b.peakHours.includes("13");
        return (bIsLunch ? 1 : 0) - (aIsLunch ? 1 : 0);
      });
    } else if (currentHour >= 17 && currentHour < 22) {
      // Dinner time
      recommendations = recommendations.sort((a, b) => {
        const aIsDinner =
          a.peakHours.includes("18") || a.peakHours.includes("19");
        const bIsDinner =
          b.peakHours.includes("18") || b.peakHours.includes("19");
        return (bIsDinner ? 1 : 0) - (aIsDinner ? 1 : 0);
      });
    }

    // Apply additional scoring based on rating and wait time
    recommendations = recommendations.sort((a, b) => {
      // Score based on rating (0-5 points)
      const ratingScore = (b.rating - a.rating) * 5;

      // Score based on wait time (-3 to 0 points)
      const waitScore = (a.currentWaitTime - b.currentWaitTime) / 10;

      return ratingScore + waitScore;
    });

    // Limit to top 5 recommendations
    recommendations = recommendations.slice(0, 5);

    return NextResponse.json(recommendations);
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: "Failed to get recommendations" },
      { status: 500 }
    );
  }
}
