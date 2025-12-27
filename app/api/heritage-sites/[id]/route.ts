import { NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"
import { jsonResponse, errorResponse } from "@/lib/auth"

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params

        const site = await prisma.heritageSite.findUnique({
            where: { id },
            include: {
                quests: true,
                _count: {
                    select: { visits: true },
                },
            },
        })

        if (!site) {
            return errorResponse("Heritage site not found", 404)
        }

        return jsonResponse({ site })
    } catch (error) {
        console.error("Get heritage site error:", error)
        return errorResponse("Internal server error", 500)
    }
}
