import { NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"
import { jsonResponse, errorResponse } from "@/lib/auth"

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id: userId } = await params

        const userBadges = await prisma.userBadge.findMany({
            where: { userId },
            include: {
                badge: true,
            },
            orderBy: { unlockedAt: "desc" },
        })

        const unlockedBadges = userBadges.filter((ub) => ub.unlockedAt !== null)
        const inProgressBadges = userBadges.filter((ub) => ub.unlockedAt === null)

        return jsonResponse({
            unlocked: unlockedBadges,
            inProgress: inProgressBadges,
            totalUnlocked: unlockedBadges.length,
        })
    } catch (error) {
        console.error("Get user badges error:", error)
        return errorResponse("Internal server error", 500)
    }
}
