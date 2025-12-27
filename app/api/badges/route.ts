import { prisma } from "@/lib/prisma"
import { getCurrentUser, jsonResponse, errorResponse } from "@/lib/auth"

export async function GET() {
    try {
        const currentUser = await getCurrentUser()

        const badges = await prisma.badge.findMany({
            orderBy: { requirementValue: "asc" },
        })

        // If user is logged in, include their progress
        if (currentUser) {
            const userBadges = await prisma.userBadge.findMany({
                where: { userId: currentUser.id },
            })

            const badgeProgressMap = new Map(
                userBadges.map((ub) => [ub.badgeId, { progress: ub.progress, unlockedAt: ub.unlockedAt }])
            )

            const badgesWithProgress = badges.map((badge) => ({
                ...badge,
                userProgress: badgeProgressMap.get(badge.id)?.progress || 0,
                isUnlocked: !!badgeProgressMap.get(badge.id)?.unlockedAt,
                unlockedAt: badgeProgressMap.get(badge.id)?.unlockedAt || null,
            }))

            return jsonResponse({ badges: badgesWithProgress })
        }

        return jsonResponse({ badges })
    } catch (error) {
        console.error("Get badges error:", error)
        return errorResponse("Internal server error", 500)
    }
}
