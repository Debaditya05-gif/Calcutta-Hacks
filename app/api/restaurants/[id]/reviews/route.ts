import { NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"
import { getCurrentUser, jsonResponse, errorResponse } from "@/lib/auth"

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id: restaurantId } = await params
        const searchParams = request.nextUrl.searchParams
        const limit = parseInt(searchParams.get("limit") || "20")
        const offset = parseInt(searchParams.get("offset") || "0")

        const [reviews, total] = await Promise.all([
            prisma.restaurantReview.findMany({
                where: { restaurantId },
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
                take: limit,
                skip: offset,
            }),
            prisma.restaurantReview.count({ where: { restaurantId } }),
        ])

        return jsonResponse({
            reviews,
            pagination: {
                total,
                limit,
                offset,
                hasMore: offset + reviews.length < total,
            },
        })
    } catch (error) {
        console.error("Get reviews error:", error)
        return errorResponse("Internal server error", 500)
    }
}

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const user = await getCurrentUser()
        if (!user) {
            return errorResponse("Authentication required", 401)
        }

        const { id: restaurantId } = await params
        const body = await request.json()
        const { rating, text, dishesTried } = body

        // Validate required fields
        if (!rating || !text) {
            return errorResponse("Rating and text are required", 400)
        }

        if (rating < 1 || rating > 5) {
            return errorResponse("Rating must be between 1 and 5", 400)
        }

        // Check if restaurant exists
        const restaurant = await prisma.restaurant.findUnique({
            where: { id: restaurantId },
        })

        if (!restaurant) {
            return errorResponse("Restaurant not found", 404)
        }

        // Create review
        const review = await prisma.restaurantReview.create({
            data: {
                restaurantId,
                userId: user.id,
                rating,
                text,
                dishesTried: dishesTried || [],
            },
            include: {
                user: {
                    select: {
                        id: true,
                        fullName: true,
                        avatarUrl: true,
                    },
                },
            },
        })

        // Update restaurant rating and review count
        const allReviews = await prisma.restaurantReview.findMany({
            where: { restaurantId },
            select: { rating: true },
        })

        const avgRating = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length

        await prisma.restaurant.update({
            where: { id: restaurantId },
            data: {
                rating: Math.round(avgRating * 10) / 10,
                reviewCount: allReviews.length,
            },
        })

        // Update restaurant badge progress
        const uniqueRestaurants = await prisma.restaurantReview.findMany({
            where: { userId: user.id },
            select: { restaurantId: true },
            distinct: ["restaurantId"],
        })

        const restaurantBadges = await prisma.badge.findMany({
            where: { requirementType: "restaurants" },
        })

        for (const badge of restaurantBadges) {
            await prisma.userBadge.upsert({
                where: {
                    userId_badgeId: { userId: user.id, badgeId: badge.id },
                },
                update: {
                    progress: uniqueRestaurants.length,
                    unlockedAt: uniqueRestaurants.length >= badge.requirementValue ? new Date() : null,
                },
                create: {
                    userId: user.id,
                    badgeId: badge.id,
                    progress: uniqueRestaurants.length,
                    unlockedAt: uniqueRestaurants.length >= badge.requirementValue ? new Date() : null,
                },
            })
        }

        return jsonResponse({
            message: "Review added successfully",
            review,
        }, 201)
    } catch (error) {
        console.error("Add review error:", error)
        return errorResponse("Internal server error", 500)
    }
}
