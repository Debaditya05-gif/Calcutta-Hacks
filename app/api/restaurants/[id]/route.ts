import { NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"
import { jsonResponse, errorResponse } from "@/lib/auth"

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params

        const restaurant = await prisma.restaurant.findUnique({
            where: { id },
            include: {
                reviews: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                fullName: true,
                                avatarUrl: true,
                            },
                        },
                    },
                    orderBy: { createdAt: "desc" },
                    take: 10,
                },
            },
        })

        if (!restaurant) {
            return errorResponse("Restaurant not found", 404)
        }

        return jsonResponse({ restaurant })
    } catch (error) {
        console.error("Get restaurant error:", error)
        return errorResponse("Internal server error", 500)
    }
}
