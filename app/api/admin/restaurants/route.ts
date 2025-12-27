import { NextRequest } from "next/server"
import { jsonResponse, errorResponse } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

// POST create new restaurant
export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const {
            name,
            cuisineType,
            priceRange,
            rating,
            avgCostPerPerson,
            address,
            latitude,
            longitude,
            description,
        } = body

        if (!name) {
            return errorResponse("Name is required", 400)
        }

        const restaurant = await prisma.restaurant.create({
            data: {
                name,
                cuisineType: cuisineType || ["Bengali"],
                priceRange: priceRange || "$$",
                rating: rating || 4.0,
                avgCostPerPerson: avgCostPerPerson || 500,
                address: address || "",
                latitude: latitude || 22.5726,
                longitude: longitude || 88.3639,
                description: description || "",
                specialties: [],
            },
        })

        return jsonResponse({ success: true, restaurant })
    } catch (error) {
        console.error("Create restaurant error:", error)
        return errorResponse("Failed to create restaurant", 500)
    }
}

// DELETE restaurant
export async function DELETE(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const id = searchParams.get("id")

        if (!id) {
            return errorResponse("Restaurant ID required", 400)
        }

        await prisma.restaurant.delete({
            where: { id },
        })

        return jsonResponse({ success: true })
    } catch (error) {
        console.error("Delete restaurant error:", error)
        return errorResponse("Failed to delete restaurant", 500)
    }
}

// PUT update restaurant
export async function PUT(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const id = searchParams.get("id")

        if (!id) {
            return errorResponse("Restaurant ID required", 400)
        }

        const body = await request.json()
        const {
            name,
            cuisineType,
            priceRange,
            rating,
            avgCostPerPerson,
            address,
            isAssured,
        } = body

        const restaurant = await prisma.restaurant.update({
            where: { id },
            data: {
                name,
                cuisineType,
                priceRange,
                rating,
                avgCostPerPerson,
                address,
                isAssured,
            },
        })

        return jsonResponse({ success: true, restaurant })
    } catch (error) {
        console.error("Update restaurant error:", error)
        return errorResponse("Failed to update restaurant", 500)
    }
}
