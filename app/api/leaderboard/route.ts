import { NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"
import { getCurrentUser, jsonResponse, errorResponse } from "@/lib/auth"

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams
        const limit = parseInt(searchParams.get("limit") || "10")
        const period = searchParams.get("period") || "weekly" // weekly, monthly, all-time

        // Calculate date filter based on period
        let dateFilter: Date | undefined
        const now = new Date()

        if (period === "weekly") {
            dateFilter = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
        } else if (period === "monthly") {
            dateFilter = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
        }

        // Get top users by points
        const topUsers = await prisma.user.findMany({
            select: {
                id: true,
                fullName: true,
                avatarUrl: true,
                totalPoints: true,
                _count: {
                    select: {
                        userBadges: {
                            where: { unlockedAt: { not: null } },
                        },
                    },
                },
            },
            orderBy: { totalPoints: "desc" },
            take: limit,
        })

        const currentUser = await getCurrentUser()

        // Format leaderboard
        const leaderboard = topUsers.map((user, index) => ({
            rank: index + 1,
            id: user.id,
            name: user.fullName,
            avatarUrl: user.avatarUrl,
            points: user.totalPoints,
            badges: user._count.userBadges,
            isCurrentUser: currentUser?.id === user.id,
        }))

        // If current user is not in top results, add their position
        let currentUserRank = null
        if (currentUser && !leaderboard.some((u) => u.isCurrentUser)) {
            const usersAbove = await prisma.user.count({
                where: { totalPoints: { gt: currentUser.totalPoints } },
            })

            const userBadgeCount = await prisma.userBadge.count({
                where: { userId: currentUser.id, unlockedAt: { not: null } },
            })

            currentUserRank = {
                rank: usersAbove + 1,
                id: currentUser.id,
                name: currentUser.fullName,
                avatarUrl: currentUser.avatarUrl,
                points: currentUser.totalPoints,
                badges: userBadgeCount,
                isCurrentUser: true,
            }
        }

        return jsonResponse({
            leaderboard,
            currentUserRank,
            period,
        })
    } catch (error) {
        console.error("Get leaderboard error:", error)
        return errorResponse("Internal server error", 500)
    }
}
