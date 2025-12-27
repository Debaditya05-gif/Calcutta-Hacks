import { NextRequest } from "next/server"
import { jsonResponse, errorResponse } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

const GEMINI_API_KEY = process.env.GEMINI_API_KEY

interface Site {
    name: string
    category: string
    entryFee: number | null
    description: string
}

interface Restaurant {
    name: string
    cuisineType: unknown
    priceRange: string
    avgCostPerPerson: number | null
}

// Fallback itinerary when AI is unavailable
function getFallbackItinerary(duration: number) {
    const fallbackDays = [
        {
            day: 1,
            theme: "Heritage & History",
            activities: [
                { time: "9:00 AM", type: "site", name: "Victoria Memorial", description: "Start your day at the iconic marble building with its stunning architecture and museum", estimatedCost: 50, duration: "2 hours" },
                { time: "12:00 PM", type: "restaurant", name: "Peter Cat", description: "Enjoy the famous Chelo Kebab for lunch", estimatedCost: 800, duration: "1.5 hours" },
                { time: "2:30 PM", type: "site", name: "Indian Museum", description: "Explore one of the oldest museums in Asia", estimatedCost: 75, duration: "2 hours" },
                { time: "5:00 PM", type: "activity", name: "Park Street Walk", description: "Stroll through the famous street, enjoy coffee at Flurys", estimatedCost: 300, duration: "2 hours" },
                { time: "7:30 PM", type: "restaurant", name: "6 Ballygunge Place", description: "Traditional Bengali dinner", estimatedCost: 600, duration: "1.5 hours" }
            ]
        },
        {
            day: 2,
            theme: "Cultural Exploration",
            activities: [
                { time: "8:00 AM", type: "site", name: "Howrah Bridge", description: "Witness the iconic cantilever bridge at sunrise", estimatedCost: 0, duration: "1 hour" },
                { time: "9:30 AM", type: "site", name: "Marble Palace", description: "Explore this 19th-century mansion with art collection", estimatedCost: 0, duration: "1.5 hours" },
                { time: "12:00 PM", type: "restaurant", name: "Paramount Sharbat", description: "Famous cold drinks and snacks", estimatedCost: 200, duration: "30 mins" },
                { time: "1:00 PM", type: "site", name: "College Street", description: "Book lovers paradise - explore old bookshops", estimatedCost: 500, duration: "2 hours" },
                { time: "4:00 PM", type: "site", name: "Kumartuli", description: "See artisans crafting clay idols", estimatedCost: 0, duration: "1.5 hours" },
                { time: "6:30 PM", type: "restaurant", name: "Oh! Calcutta", description: "Fine dining Bengali cuisine", estimatedCost: 1200, duration: "2 hours" }
            ]
        },
        {
            day: 3,
            theme: "Spiritual & Local Life",
            activities: [
                { time: "6:00 AM", type: "site", name: "Dakshineswar Kali Temple", description: "Visit the famous temple associated with Ramakrishna", estimatedCost: 0, duration: "2 hours" },
                { time: "9:00 AM", type: "site", name: "Belur Math", description: "Headquarters of Ramakrishna Mission", estimatedCost: 0, duration: "1.5 hours" },
                { time: "12:00 PM", type: "restaurant", name: "Bhojohori Manna", description: "Authentic Bengali lunch", estimatedCost: 500, duration: "1 hour" },
                { time: "2:00 PM", type: "site", name: "Prinsep Ghat", description: "Relax by the Hooghly river", estimatedCost: 0, duration: "1.5 hours" },
                { time: "4:30 PM", type: "activity", name: "New Market Shopping", description: "Shop for souvenirs and local goods", estimatedCost: 1000, duration: "2 hours" },
                { time: "7:00 PM", type: "restaurant", name: "Arsalan", description: "Famous Biryani for dinner", estimatedCost: 700, duration: "1.5 hours" }
            ]
        }
    ]

    return {
        tripName: `${duration}-Day Kolkata Heritage Experience`,
        days: fallbackDays.slice(0, duration),
        totalEstimatedCost: fallbackDays.slice(0, duration).reduce((sum, day) =>
            sum + day.activities.reduce((daySum, act) => daySum + act.estimatedCost, 0), 0
        ),
        tips: [
            "Best time to visit heritage sites is early morning to avoid crowds",
            "Carry cash for entry fees and street food",
            "Yellow taxis and metro are convenient for getting around",
            "Try the famous Kolkata street food - puchka, jhalmuri, and mishti",
            "Evenings by the Hooghly river are magical"
        ]
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { duration, budget, interests, travelStyle } = body

        if (!duration) {
            return errorResponse("Duration is required", 400)
        }

        // Check if API key is configured
        if (!GEMINI_API_KEY) {
            console.log("GEMINI_API_KEY not configured, using fallback")
            return jsonResponse({
                success: true,
                itinerary: getFallbackItinerary(duration),
                source: "fallback"
            })
        }

        // Fetch available sites and restaurants
        const sites = await prisma.heritageSite.findMany({
            select: { name: true, category: true, entryFee: true, description: true },
            take: 10,
        })

        const restaurants = await prisma.restaurant.findMany({
            select: { name: true, cuisineType: true, priceRange: true, avgCostPerPerson: true },
            take: 10,
        })

        // Build prompt for Gemini
        const prompt = `You are a Kolkata travel expert. Create a ${duration}-day trip itinerary for Kolkata, India.

User Preferences:
- Budget: ${budget || "moderate"}
- Interests: ${interests?.join(", ") || "heritage, culture, food"}
- Travel Style: ${travelStyle || "cultural"}

Available Heritage Sites in our database:
${sites.map((s: Site) => `- ${s.name} (${s.category}) - Entry: ₹${s.entryFee || "Free"}`).join("\n")}

Available Restaurants:
${restaurants.map((r: Restaurant) => `- ${r.name} (${r.priceRange}) - ₹${r.avgCostPerPerson}/person`).join("\n")}

Create a detailed day-by-day itinerary in JSON format with this structure:
{
  "tripName": "Title for the trip",
  "days": [
    {
      "day": 1,
      "theme": "Day theme",
      "activities": [
        {
          "time": "9:00 AM",
          "type": "site",
          "name": "Place name",
          "description": "What to do here",
          "estimatedCost": 500,
          "duration": "2 hours"
        }
      ]
    }
  ],
  "totalEstimatedCost": 5000,
  "tips": ["Tip 1", "Tip 2"]
}

Only respond with valid JSON, no markdown or extra text.`

        // Call Gemini API - using gemini-pro model
        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    contents: [
                        {
                            parts: [{ text: prompt }],
                        },
                    ],
                    generationConfig: {
                        temperature: 0.7,
                        maxOutputTokens: 2048,
                    },
                }),
            }
        )

        if (!response.ok) {
            const errorData = await response.text()
            console.error("Gemini API error:", response.status, errorData)
            // Return fallback on error
            return jsonResponse({
                success: true,
                itinerary: getFallbackItinerary(duration),
                source: "fallback"
            })
        }

        const data = await response.json()
        const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text

        if (!generatedText) {
            console.error("No text in Gemini response:", JSON.stringify(data))
            return jsonResponse({
                success: true,
                itinerary: getFallbackItinerary(duration),
                source: "fallback"
            })
        }

        // Parse the JSON response
        let itinerary
        try {
            // Remove any markdown code blocks if present
            const cleanJson = generatedText.replace(/```json\n?|\n?```/g, "").trim()
            itinerary = JSON.parse(cleanJson)
        } catch (parseError) {
            console.error("Failed to parse Gemini response:", generatedText)
            return jsonResponse({
                success: true,
                itinerary: getFallbackItinerary(duration),
                source: "fallback"
            })
        }

        return jsonResponse({
            success: true,
            itinerary,
            source: "gemini"
        })
    } catch (error) {
        console.error("AI trip suggestion error:", error)
        return errorResponse("Internal server error", 500)
    }
}
