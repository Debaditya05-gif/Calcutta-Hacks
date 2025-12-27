import { NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"
import { jsonResponse, errorResponse } from "@/lib/auth"

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams
        const cuisine = searchParams.get("cuisine")
        const priceRange = searchParams.get("priceRange")
        const minRating = parseFloat(searchParams.get("minRating") || "0")
        const search = searchParams.get("search")
        const limit = parseInt(searchParams.get("limit") || "50")
        const offset = parseInt(searchParams.get("offset") || "0")

        const where: Record<string, unknown> = {}

        if (priceRange) {
            where.priceRange = priceRange
        }

        if (minRating > 0) {
            where.rating = { gte: minRating }
        }

        if (search) {
            where.OR = [
                { name: { contains: search } },
                { description: { contains: search } },
                { address: { contains: search } },
            ]
        }

        const [restaurants, total] = await Promise.all([
            prisma.restaurant.findMany({
                where,
                take: limit,
                skip: offset,
                orderBy: { rating: "desc" },
            }),
            prisma.restaurant.count({ where }),
        ])

        // Filter by cuisine type (JSON array filtering)
        let filteredRestaurants = restaurants
        if (cuisine) {
            const cuisines = cuisine.split(",")
            filteredRestaurants = restaurants.filter((r) => {
                const types = r.cuisineType as string[]
                return types.some((t) => cuisines.includes(t))
            })
        }

        return jsonResponse({
            restaurants: filteredRestaurants,
            pagination: {
                total,
                limit,
                offset,
                hasMore: offset + restaurants.length < total,
            },
        })
    } catch (error) {
        console.error("Get restaurants error:", error)
        return errorResponse("Internal server error", 500)
    }
}
