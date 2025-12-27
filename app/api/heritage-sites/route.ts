import { NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"
import { jsonResponse, errorResponse } from "@/lib/auth"

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams
        const category = searchParams.get("category")
        const search = searchParams.get("search")
        const limit = parseInt(searchParams.get("limit") || "50")
        const offset = parseInt(searchParams.get("offset") || "0")

        const where: Record<string, unknown> = {}

        if (category) {
            where.category = category
        }

        if (search) {
            where.OR = [
                { name: { contains: search } },
                { description: { contains: search } },
                { address: { contains: search } },
            ]
        }

        const [sites, total] = await Promise.all([
            prisma.heritageSite.findMany({
                where,
                take: limit,
                skip: offset,
                orderBy: { rating: "desc" },
            }),
            prisma.heritageSite.count({ where }),
        ])

        return jsonResponse({
            sites,
            pagination: {
                total,
                limit,
                offset,
                hasMore: offset + sites.length < total,
            },
        })
    } catch (error) {
        console.error("Get heritage sites error:", error)
        return errorResponse("Internal server error", 500)
    }
}
