import { NextRequest } from "next/server"
import { jsonResponse, errorResponse } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
    try {
        // Get counts for all entities
        const [users, sites, restaurants, badges, visits, reviews] = await Promise.all([
            prisma.user.count(),
            prisma.heritageSite.count(),
            prisma.restaurant.count(),
            prisma.badge.count(),
            prisma.siteVisit.count(),
            prisma.restaurantReview.count(),
        ])

        return jsonResponse({
            users,
            sites,
            restaurants,
            badges,
            visits,
            reviews,
        })
    } catch (error) {
        console.error("Admin stats error:", error)
        return errorResponse("Failed to fetch stats", 500)
    }
}
