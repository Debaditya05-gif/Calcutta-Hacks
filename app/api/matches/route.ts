import { NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"
import { getCurrentUser, jsonResponse, errorResponse } from "@/lib/auth"

// Calculate compatibility score between two users
function calculateCompatibility(user1Interests: string[], user2Interests: string[], user1Style: string | null, user2Style: string | null): { score: number; commonInterests: string[] } {
    const commonInterests = user1Interests.filter((i) => user2Interests.includes(i))

    let score = 0

    // Interest overlap: up to 70 points
    const interestScore = (commonInterests.length / Math.max(user1Interests.length, user2Interests.length, 1)) * 70
    score += interestScore

    // Travel style match: up to 30 points
    if (user1Style && user2Style && user1Style === user2Style) {
        score += 30
    } else if (user1Style && user2Style) {
        score += 10 // Partial score for having styles defined
    }

    return {
        score: Math.round(score),
        commonInterests,
    }
}

export async function GET(request: NextRequest) {
    try {
        const currentUser = await getCurrentUser()
        if (!currentUser) {
            return errorResponse("Authentication required", 401)
        }

        const searchParams = request.nextUrl.searchParams
        const minAge = parseInt(searchParams.get("minAge") || "18")
        const maxAge = parseInt(searchParams.get("maxAge") || "100")
        const gender = searchParams.get("gender")
        const minCompatibility = parseInt(searchParams.get("minCompatibility") || "0")

        // Get all solo travelers except current user
        const potentialMatches = await prisma.user.findMany({
            where: {
                id: { not: currentUser.id },
                isSoloTraveler: true,
                age: {
                    gte: minAge,
                    lte: maxAge,
                },
                ...(gender && { gender }),
            },
            select: {
                id: true,
                fullName: true,
                avatarUrl: true,
                bio: true,
                age: true,
                gender: true,
                interests: true,
                travelStyle: true,
            },
        })

        // Get existing matches to exclude
        const existingMatches = await prisma.travelMatch.findMany({
            where: {
                OR: [
                    { userId1: currentUser.id },
                    { userId2: currentUser.id },
                ],
            },
            select: { userId1: true, userId2: true },
        })

        const matchedUserIds = new Set(
            existingMatches.flatMap((m) => [m.userId1, m.userId2])
        )
        matchedUserIds.delete(currentUser.id)

        // Calculate compatibility for each potential match
        const currentUserInterests = currentUser.interests as string[]
        const matches = potentialMatches
            .filter((user) => !matchedUserIds.has(user.id))
            .map((user) => {
                const userInterests = user.interests as string[]
                const { score, commonInterests } = calculateCompatibility(
                    currentUserInterests,
                    userInterests,
                    currentUser.travelStyle,
                    user.travelStyle
                )
                return {
                    user,
                    compatibilityScore: score,
                    commonInterests,
                }
            })
            .filter((m) => m.compatibilityScore >= minCompatibility)
            .sort((a, b) => b.compatibilityScore - a.compatibilityScore)

        return jsonResponse({
            matches,
            total: matches.length,
        })
    } catch (error) {
        console.error("Get matches error:", error)
        return errorResponse("Internal server error", 500)
    }
}
