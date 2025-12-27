import { NextRequest } from "next/server"
import { jsonResponse, errorResponse } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

// POST create new badge
export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { name, description, pointsRequired, category } = body

        if (!name) {
            return errorResponse("Badge name is required", 400)
        }

        const badge = await prisma.badge.create({
            data: {
                name,
                description: description || "",
                pointsRequired: pointsRequired || 100,
                category: category || "explorer",
            },
        })

        return jsonResponse({ success: true, badge })
    } catch (error) {
        console.error("Create badge error:", error)
        return errorResponse("Failed to create badge", 500)
    }
}

// DELETE badge
export async function DELETE(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const id = searchParams.get("id")

        if (!id) {
            return errorResponse("Badge ID required", 400)
        }

        await prisma.badge.delete({
            where: { id },
        })

        return jsonResponse({ success: true })
    } catch (error) {
        console.error("Delete badge error:", error)
        return errorResponse("Failed to delete badge", 500)
    }
}
