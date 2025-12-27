import { prisma } from "@/lib/prisma"
import { getCurrentUser, jsonResponse, errorResponse } from "@/lib/auth"

export async function GET() {
    try {
        const currentUser = await getCurrentUser()

        const quests = await prisma.heritageQuest.findMany({
            include: {
                heritageSite: {
                    select: {
                        id: true,
                        name: true,
                        imageUrl: true,
                        address: true,
                    },
                },
            },
            orderBy: { rewardPoints: "desc" },
        })

        // If user is logged in, include their quest status
        if (currentUser) {
            const userQuests = await prisma.userQuest.findMany({
                where: { userId: currentUser.id },
            })

            const questStatusMap = new Map(
                userQuests.map((uq) => [uq.questId, { isCompleted: uq.isCompleted, completedAt: uq.completedAt }])
            )

            const questsWithStatus = quests.map((quest) => ({
                ...quest,
                isCompleted: questStatusMap.get(quest.id)?.isCompleted || false,
                completedAt: questStatusMap.get(quest.id)?.completedAt || null,
            }))

            return jsonResponse({ quests: questsWithStatus })
        }

        return jsonResponse({ quests })
    } catch (error) {
        console.error("Get quests error:", error)
        return errorResponse("Internal server error", 500)
    }
}
