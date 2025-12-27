import { NextRequest } from "next/server"
import { jsonResponse, errorResponse } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

// GET all users
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const page = parseInt(searchParams.get("page") || "1")
        const limit = parseInt(searchParams.get("limit") || "10")
        const search = searchParams.get("search") || ""

        const where = search
            ? {
                OR: [
                    { fullName: { contains: search } },
                    { email: { contains: search } },
                ],
            }
            : {}

        const [users, total] = await Promise.all([
            prisma.user.findMany({
                where,
                select: {
                    id: true,
                    fullName: true,
                    email: true,
                    age: true,
                    gender: true,
                    travelStyle: true,
                    totalPoints: true,
                    createdAt: true,
                    _count: {
                        select: {
                            userBadges: true,
                            trips: true,
                            reviews: true,
                        },
                    },
                },
                skip: (page - 1) * limit,
                take: limit,
                orderBy: { createdAt: "desc" },
            }),
            prisma.user.count({ where }),
        ])

        // Transform to expected format
        const transformedUsers = users.map((u) => ({
            id: u.id,
            name: u.fullName,
            email: u.email,
            age: u.age,
            gender: u.gender,
            travelStyle: u.travelStyle,
            points: u.totalPoints,
            createdAt: u.createdAt,
            isAdmin: false, // Can be added to schema later
            _count: {
                badges: u._count.userBadges,
                trips: u._count.trips,
                reviews: u._count.reviews,
            },
        }))

        return jsonResponse({
            users: transformedUsers,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit),
            },
        })
    } catch (error) {
        console.error("Admin users error:", error)
        return errorResponse("Failed to fetch users", 500)
    }
}

// DELETE user
export async function DELETE(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const id = searchParams.get("id")

        if (!id) {
            return errorResponse("User ID required", 400)
        }

        await prisma.user.delete({
            where: { id },
        })

        return jsonResponse({ success: true })
    } catch (error) {
        console.error("Delete user error:", error)
        return errorResponse("Failed to delete user", 500)
    }
}
