import { NextRequest } from "next/server"
import { jsonResponse, errorResponse } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

// POST create new quest
export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { title, description, questType, pointsReward, siteId } = body

        if (!title) {
            return errorResponse("Quest title is required", 400)
        }

        const quest = await prisma.quest.create({
            data: {
                title,
                description: description || "",
                questType: questType || "visit",
                pointsReward: pointsReward || 50,
                isActive: true,
                siteId: siteId || null,
            },
        })

        return jsonResponse({ success: true, quest })
    } catch (error) {
        console.error("Create quest error:", error)
        return errorResponse("Failed to create quest", 500)
    }
}

// DELETE quest
export async function DELETE(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const id = searchParams.get("id")

        if (!id) {
            return errorResponse("Quest ID required", 400)
        }

        await prisma.quest.delete({
            where: { id },
        })

        return jsonResponse({ success: true })
    } catch (error) {
        console.error("Delete quest error:", error)
        return errorResponse("Failed to delete quest", 500)
    }
}
