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

        // Check if target user exists
        const targetUser = await prisma.user.findUnique({
            where: { id: targetUserId },
        })

        if (!targetUser) {
            return errorResponse("User not found", 404)
        }

        // Check if there's already a match from the other user
        const existingMatch = await prisma.travelMatch.findFirst({
            where: {
                userId1: targetUserId,
                userId2: currentUser.id,
                status: "liked",
            },
        })

        if (existingMatch) {
            // Mutual match! Update status
            await prisma.travelMatch.update({
                where: { id: existingMatch.id },
                data: { status: "matched" },
            })

            // Update match badge progress
            const matchCount = await prisma.travelMatch.count({
                where: {
                    OR: [
                        { userId1: currentUser.id, status: "matched" },
                        { userId2: currentUser.id, status: "matched" },
                    ],
                },
            })

            const matchBadges = await prisma.badge.findMany({
                where: { requirementType: "matches" },
            })

            for (const badge of matchBadges) {
                await prisma.userBadge.upsert({
                    where: {
                        userId_badgeId: { userId: currentUser.id, badgeId: badge.id },
                    },
                    update: {
                        progress: matchCount,
                        unlockedAt: matchCount >= badge.requirementValue ? new Date() : null,
                    },
                    create: {
                        userId: currentUser.id,
                        badgeId: badge.id,
                        progress: matchCount,
                        unlockedAt: matchCount >= badge.requirementValue ? new Date() : null,
                    },
                })
            }

            return jsonResponse({
                message: "It's a match!",
                matched: true,
                matchId: existingMatch.id,
            })
        }

        // Create new match with liked status
        const match = await prisma.travelMatch.upsert({
            where: {
                userId1_userId2: { userId1: currentUser.id, userId2: targetUserId },
            },
            update: { status: "liked" },
            create: {
                userId1: currentUser.id,
                userId2: targetUserId,
                status: "liked",
                compatibilityScore: 0, // Will be calculated later if needed
                commonInterests: [],
            },
        })

        return jsonResponse({
            message: "User liked",
            matched: false,
            matchId: match.id,
        })
    } catch (error) {
        console.error("Like match error:", error)
        return errorResponse("Internal server error", 500)
    }
}
