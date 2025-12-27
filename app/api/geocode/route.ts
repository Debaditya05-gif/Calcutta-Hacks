import { NextRequest } from "next/server"
import { jsonResponse, errorResponse } from "@/lib/auth"

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const placeName = searchParams.get("place")

        if (!placeName) {
            return errorResponse("Place name is required", 400)
        }

        // Add "Kolkata" to the search to get more accurate results
        const searchQuery = placeName.toLowerCase().includes("kolkata")
            ? placeName
            : `${placeName}, Kolkata, West Bengal, India`

        // Use Nominatim (OpenStreetMap) - FREE, no API key required
        const response = await fetch(
            `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&limit=1`,
            {
                headers: {
                    "User-Agent": "KolkataExplorer/1.0", // Required by Nominatim
                },
            }
        )

        if (!response.ok) {
            console.error("Nominatim API error:", response.status)
            return errorResponse("Failed to geocode location", 500)
        }

        const data = await response.json()

        if (!data || data.length === 0) {
            return errorResponse("Location not found. Try a more specific name.", 404)
        }

        const result = data[0]

        return jsonResponse({
            success: true,
            latitude: parseFloat(result.lat),
            longitude: parseFloat(result.lon),
            formattedAddress: result.display_name,
            placeId: result.place_id,
        })
    } catch (error) {
        console.error("Geocode error:", error)
        return errorResponse("Internal server error", 500)
    }
}
