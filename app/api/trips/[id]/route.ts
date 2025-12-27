import { NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"
import { getCurrentUser, jsonResponse, errorResponse } from "@/lib/auth"

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const currentUser = await getCurrentUser()
        if (!currentUser) {
            return errorResponse("Authentication required", 401)
        }

        const { id } = await params

        const trip = await prisma.tripPlan.findUnique({
            where: { id },
            include: {
                activities: {
                    include: {
                        site: true,
                        restaurant: true,
                    },
                    orderBy: [{ date: "asc" }, { orderIndex: "asc" }],
                },
            },
        })

        if (!trip) {
            return errorResponse("Trip not found", 404)
        }

        if (trip.userId !== currentUser.id) {
            return errorResponse("Access denied", 403)
        }

        return jsonResponse({ trip })
    } catch (error) {
        console.error("Get trip error:", error)
        return errorResponse("Internal server error", 500)
    }
}

export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const currentUser = await getCurrentUser()
        if (!currentUser) {
            return errorResponse("Authentication required", 401)
        }

        const { id } = await params
        const body = await request.json()
        const { name, startDate, endDate, budget, description } = body

        // Check ownership
        const existingTrip = await prisma.tripPlan.findUnique({
            where: { id },
            select: { userId: true },
        })

        if (!existingTrip) {
            return errorResponse("Trip not found", 404)
        }

        if (existingTrip.userId !== currentUser.id) {
            return errorResponse("Access denied", 403)
        }

        const trip = await prisma.tripPlan.update({
            where: { id },
            data: {
                name: name !== undefined ? name : undefined,
                startDate: startDate !== undefined ? new Date(startDate) : undefined,
                endDate: endDate !== undefined ? new Date(endDate) : undefined,
                budget: budget !== undefined ? (budget ? parseInt(budget) : null) : undefined,
                description: description !== undefined ? description : undefined,
            },
        })

        return jsonResponse({
            message: "Trip updated successfully",
            trip,
        })
    } catch (error) {
        console.error("Update trip error:", error)
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

        const { id } = await params

        // Check ownership
        const trip = await prisma.tripPlan.findUnique({
            where: { id },
            select: { userId: true },
        })

        if (!trip) {
            return errorResponse("Trip not found", 404)
        }

        if (trip.userId !== currentUser.id) {
            return errorResponse("Access denied", 403)
        }

        await prisma.tripPlan.delete({ where: { id } })

        return jsonResponse({ message: "Trip deleted successfully" })
    } catch (error) {
        console.error("Delete trip error:", error)
        return errorResponse("Internal server error", 500)
    }
}
