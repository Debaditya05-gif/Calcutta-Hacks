import { NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"
import { getCurrentUser, jsonResponse, errorResponse } from "@/lib/auth"

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const currentUser = await getCurrentUser()
        if (!currentUser) {
            return errorResponse("Authentication required", 401)
        }

        const { id: tripId } = await params
        const body = await request.json()
        const { date, siteId, restaurantId, estimatedCost, notes } = body

        // Check trip ownership
        const trip = await prisma.tripPlan.findUnique({
            where: { id: tripId },
            select: { userId: true },
        })

        if (!trip) {
            return errorResponse("Trip not found", 404)
        }

        if (trip.userId !== currentUser.id) {
            return errorResponse("Access denied", 403)
        }

        // Validate required fields
        if (!date) {
            return errorResponse("Date is required", 400)
        }

        // Get next order index for this date
        const existingActivities = await prisma.tripActivity.count({
            where: { tripId, date: new Date(date) },
        })

        const activity = await prisma.tripActivity.create({
            data: {
                tripId,
                date: new Date(date),
                siteId: siteId || null,
                restaurantId: restaurantId || null,
                estimatedCost: estimatedCost ? parseInt(estimatedCost) : null,
                notes: notes || null,
                orderIndex: existingActivities,
            },
            include: {
                site: true,
                restaurant: true,
            },
        })

        return jsonResponse({
            message: "Activity added successfully",
            activity,
        }, 201)
    } catch (error) {
        console.error("Add activity error:", error)
        return errorResponse("Internal server error", 500)
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const currentUser = await getCurrentUser()
        if (!currentUser) {
            return errorResponse("Authentication required", 401)
        }

        const { id: tripId } = await params
        const searchParams = request.nextUrl.searchParams
        const activityId = searchParams.get("activityId")

        if (!activityId) {
            return errorResponse("Activity ID is required", 400)
        }

        // Check trip ownership
        const trip = await prisma.tripPlan.findUnique({
            where: { id: tripId },
            select: { userId: true },
        })

        if (!trip) {
            return errorResponse("Trip not found", 404)
        }

        if (trip.userId !== currentUser.id) {
            return errorResponse("Access denied", 403)
        }

        await prisma.tripActivity.delete({
            where: { id: activityId, tripId },
        })

        return jsonResponse({ message: "Activity deleted successfully" })
    } catch (error) {
        console.error("Delete activity error:", error)
        return errorResponse("Internal server error", 500)
    }
}
