import { NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"
import { getCurrentUser, jsonResponse, errorResponse } from "@/lib/auth"

export async function GET() {
    try {
        const currentUser = await getCurrentUser()
        if (!currentUser) {
            return errorResponse("Authentication required", 401)
        }

        const trips = await prisma.tripPlan.findMany({
            where: { userId: currentUser.id },
            include: {
                activities: {
                    include: {
                        site: true,
                        restaurant: true,
                    },
                    orderBy: [{ date: "asc" }, { orderIndex: "asc" }],
                },
            },
            orderBy: { startDate: "desc" },
        })

        return jsonResponse({ trips })
    } catch (error) {
        console.error("Get trips error:", error)
        return errorResponse("Internal server error", 500)
    }
}

export async function POST(request: NextRequest) {
    try {
        const currentUser = await getCurrentUser()
        if (!currentUser) {
            return errorResponse("Authentication required", 401)
        }

        const body = await request.json()
        const { name, startDate, endDate, budget, description } = body

        // Validate required fields
        if (!name || !startDate || !endDate) {
            return errorResponse("Name, start date, and end date are required", 400)
        }

        const trip = await prisma.tripPlan.create({
            data: {
                userId: currentUser.id,
                name,
                startDate: new Date(startDate),
                endDate: new Date(endDate),
                budget: budget ? parseInt(budget) : null,
                description: description || null,
            },
        })

        return jsonResponse({
            message: "Trip created successfully",
            trip,
        }, 201)
    } catch (error) {
        console.error("Create trip error:", error)
        return errorResponse("Internal server error", 500)
    }
}
