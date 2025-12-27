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

        const { id: questId } = await params

        // Check if quest exists
        const quest = await prisma.heritageQuest.findUnique({
            where: { id: questId },
        })

        if (!quest) {
            return errorResponse("Quest not found", 404)
        }

        // Check if already completed
        const existingCompletion = await prisma.userQuest.findUnique({
            where: {
                userId_questId: { userId: currentUser.id, questId },
            },
        })

        if (existingCompletion?.isCompleted) {
            return errorResponse("Quest already completed", 400)
        }

        // Complete the quest
        await prisma.userQuest.upsert({
            where: {
                userId_questId: { userId: currentUser.id, questId },
            },
            update: {
                isCompleted: true,
                completedAt: new Date(),
            },
            create: {
                userId: currentUser.id,
                questId,
                isCompleted: true,
                completedAt: new Date(),
            },
        })

        // Award points to user
        await prisma.user.update({
            where: { id: currentUser.id },
            data: {
                totalPoints: { increment: quest.rewardPoints },
            },
        })

        // Update quest badge progress
        const completedQuests = await prisma.userQuest.count({
            where: { userId: currentUser.id, isCompleted: true },
        })

        const questBadges = await prisma.badge.findMany({
            where: { requirementType: "quests" },
        })

        for (const badge of questBadges) {
            await prisma.userBadge.upsert({
                where: {
                    userId_badgeId: { userId: currentUser.id, badgeId: badge.id },
                },
                update: {
                    progress: completedQuests,
                    unlockedAt: completedQuests >= badge.requirementValue ? new Date() : null,
                },
                create: {
                    userId: currentUser.id,
                    badgeId: badge.id,
                    progress: completedQuests,
                    unlockedAt: completedQuests >= badge.requirementValue ? new Date() : null,
                },
            })
        }

        // Get updated user points
        const updatedUser = await prisma.user.findUnique({
            where: { id: currentUser.id },
            select: { totalPoints: true },
        })

        return jsonResponse({
            message: "Quest completed!",
            rewardPoints: quest.rewardPoints,
            rewardDiscount: quest.rewardDiscount,
            totalPoints: updatedUser?.totalPoints || 0,
            totalCompletedQuests: completedQuests,
        })
    } catch (error) {
        console.error("Complete quest error:", error)
        return errorResponse("Internal server error", 500)
    }
}
