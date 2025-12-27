import { NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"
import { getCurrentUser, jsonResponse, errorResponse } from "@/lib/auth"

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const user = await getCurrentUser()
        if (!user) {
            return errorResponse("Authentication required", 401)
        }

        const { id: siteId } = await params

        // Check if site exists
        const site = await prisma.heritageSite.findUnique({
            where: { id: siteId },
        })

        if (!site) {
            return errorResponse("Heritage site not found", 404)
        }

        // Record the visit
        const visit = await prisma.siteVisit.create({
            data: {
                userId: user.id,
                siteId,
            },
        })

        // Update site visit count
        await prisma.heritageSite.update({
            where: { id: siteId },
            data: { visitCount: { increment: 1 } },
        })

        // Check and update badges for site visits
        const totalVisits = await prisma.siteVisit.count({
            where: { userId: user.id },
        })

        // Find badges related to visits
        const visitBadges = await prisma.badge.findMany({
            where: { requirementType: "visits" },
        })

        for (const badge of visitBadges) {
            // Update or create user badge progress
            await prisma.userBadge.upsert({
                where: {
                    userId_badgeId: { userId: user.id, badgeId: badge.id },
                },
                update: {
                    progress: totalVisits,
                    unlockedAt: totalVisits >= badge.requirementValue ? new Date() : null,
                },
                create: {
                    userId: user.id,
                    badgeId: badge.id,
                    progress: totalVisits,
                    unlockedAt: totalVisits >= badge.requirementValue ? new Date() : null,
                },
            })
        }

        return jsonResponse({
            message: "Visit recorded successfully",
            visit,
            totalVisits,
        }, 201)
    } catch (error) {
        console.error("Record visit error:", error)
        return errorResponse("Internal server error", 500)
    }
}
