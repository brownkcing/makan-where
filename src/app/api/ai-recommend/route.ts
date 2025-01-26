import { UserPreferences } from "@/lib/types";
import { Mistral } from "@mistralai/mistralai";
import { NextResponse } from "next/server";

interface Restaurant {
  id: string;
  name: string;
  isOpenNow: boolean;
  cuisine: string[];
  rating?: number;
  dietaryOptions?: {
    halal: boolean;
    vegetarian: boolean;
  };
}

export async function POST(request: Request) {
  try {
    // 1. Init client
    if (!process.env.MISTRAL_API_KEY) {
      throw new Error("MISTRAL_API_KEY not configured");
    }

    const client = new Mistral({
      apiKey: process.env.MISTRAL_API_KEY,
    });

    // 2. Parse request
    const data = await request.json();

    if (!data.availableRestaurants?.length) {
      throw new Error("No restaurants provided");
    }

    // 3. Generate prompt
    const prompt = `Time: ${getTimeOfDay(data.timeOfDay)}
Available restaurants:
${data.availableRestaurants
  .map((r: Restaurant) => `- ${r.name} (Rating: ${r.rating}/5)`)
  .join("\n")}

Dietary preferences: ${getDietaryPreferences(data)}

Consider the time, ratings, and preferences. Recommend ONE restaurant using this exact format:
Restaurant: [Name]
Reason: [Brief explanation]

Be concise and specific.`;

    console.log("Generated prompt:", prompt);

    try {
      // 4. Get recommendation from Mistral
      const stream = await client.chat.stream({
        model: "mistral-tiny",
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
      });

      let response = "";
      for await (const chunk of stream) {
        if (chunk.data?.choices?.[0]?.delta?.content) {
          const content = chunk.data.choices[0].delta.content;
          console.log("Received content:", content);
          response += content;
        }
      }

      console.log("Complete AI response:", response);

      if (!response) {
        throw new Error("Empty response from API");
      }

      // 5. Parse response
      const lines = response.split("\n");
      const nameMatch = lines.find((line) =>
        line.toLowerCase().startsWith("restaurant:")
      );
      if (!nameMatch) {
        throw new Error("Could not find restaurant name in response");
      }

      const restaurantName = nameMatch.split(":")?.[1]?.trim();
      console.log("Extracted name:", restaurantName);

      // 6. Find matching restaurant
      const recommended = data.availableRestaurants.find((r: Restaurant) =>
        r.name.toLowerCase().includes(restaurantName.toLowerCase())
      );

      if (recommended) {
        return NextResponse.json({
          success: true,
          data: {
            recommendation: recommended,
            explanation: response,
          },
        });
      }

      // 7. Fallback if no match found
      console.log("No matching restaurant found, using fallback");
      const fallback = [...data.availableRestaurants].sort(
        (a, b) => (b.rating || 0) - (a.rating || 0)
      )[0];

      return NextResponse.json({
        success: true,
        data: {
          recommendation: fallback,
          explanation: `Recommended ${fallback.name} based on its high rating of ${fallback.rating}/5.`,
          isFailover: true,
        },
      });
    } catch (aiError) {
      console.error("AI API Error:", aiError);
      // Fallback to highest rated
      const fallback = [...data.availableRestaurants].sort(
        (a, b) => (b.rating || 0) - (a.rating || 0)
      )[0];

      return NextResponse.json({
        success: true,
        data: {
          recommendation: fallback,
          explanation: `Recommended ${fallback.name} based on its high rating of ${fallback.rating}/5.`,
          isFailover: true,
        },
      });
    }
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to get recommendation",
    });
  }
}

function getTimeOfDay(hour: number): string {
  if (hour >= 5 && hour < 11) return "Morning (breakfast)";
  if (hour >= 11 && hour < 15) return "Midday (lunch)";
  if (hour >= 15 && hour < 18) return "Afternoon";
  if (hour >= 18 && hour < 22) return "Evening (dinner)";
  return "Late night";
}

function getDietaryPreferences(data: UserPreferences): string {
  const prefs = [];
  if (data.userPreferences?.dietary?.halal) prefs.push("Halal");
  if (data.userPreferences?.dietary?.vegetarian) prefs.push("Vegetarian");
  return prefs.length ? prefs.join(", ") : "None specified";
}
