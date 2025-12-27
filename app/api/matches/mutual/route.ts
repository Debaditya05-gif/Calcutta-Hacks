import { prisma } from "@/lib/prisma"
import { getCurrentUser, jsonResponse, errorResponse } from "@/lib/auth"

export async function GET() {
    try {
        const currentUser = await getCurrentUser()
        if (!currentUser) {
            return errorResponse("Authentication required", 401)
        }

        // Get all mutual matches
        const mutualMatches = await prisma.travelMatch.findMany({
            where: {
                status: "matched",
                OR: [
                    { userId1: currentUser.id },
                    { userId2: currentUser.id },
                ],
            },
            include: {
                user1: {
                    select: {
                        id: true,
                        fullName: true,
                        avatarUrl: true,
                        bio: true,
                        interests: true,
                        travelStyle: true,
                    },
                },
                user2: {
                    select: {
                        id: true,
                        fullName: true,
                        avatarUrl: true,
                        bio: true,
                        interests: true,
                        travelStyle: true,
                    },
                },
            },
        })

        // Format matches to show the other user
        const formattedMatches = mutualMatches.map((match) => ({
            matchId: match.id,
            matchedAt: match.updatedAt,
            user: match.userId1 === currentUser.id ? match.user2 : match.user1,
            commonInterests: match.commonInterests,
        }))

        return jsonResponse({
            matches: formattedMatches,
            total: formattedMatches.length,
        })
    } catch (error) {
        console.error("Get mutual matches error:", error)
        return errorResponse("Internal server error", 500)
    }
}
