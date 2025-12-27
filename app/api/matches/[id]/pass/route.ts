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

        const { id: targetUserId } = await params

        // Create or update match with passed status
        await prisma.travelMatch.upsert({
            where: {
                userId1_userId2: { userId1: currentUser.id, userId2: targetUserId },
            },
            update: { status: "passed" },
            create: {
                userId1: currentUser.id,
                userId2: targetUserId,
                status: "passed",
                compatibilityScore: 0,
                commonInterests: [],
            },
        })

        return jsonResponse({ message: "User passed" })
    } catch (error) {
        console.error("Pass match error:", error)
        return errorResponse("Internal server error", 500)
    }
}
