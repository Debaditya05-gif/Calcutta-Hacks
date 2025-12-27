import { NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"
import { getCurrentUser, jsonResponse, errorResponse } from "@/lib/auth"

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params

        const user = await prisma.user.findUnique({
            where: { id },
            select: {
                id: true,
                email: true,
                fullName: true,
                avatarUrl: true,
                bio: true,
                age: true,
                gender: true,
                interests: true,
                travelStyle: true,
                isSoloTraveler: true,
                totalPoints: true,
                createdAt: true,
            },
        })

        if (!user) {
            return errorResponse("User not found", 404)
        }

        return jsonResponse({ user })
    } catch (error) {
        console.error("Get user error:", error)
        return errorResponse("Internal server error", 500)
    }
}

export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const currentUser = await getCurrentUser()
        if (!currentUser) {
            return errorResponse("Authentication required", 401)
        }

        const { id } = await params

        // Only allow users to update their own profile
        if (currentUser.id !== id) {
            return errorResponse("You can only update your own profile", 403)
        }

        const body = await request.json()
        const { fullName, bio, age, gender, interests, travelStyle, isSoloTraveler, avatarUrl } = body

        const updatedUser = await prisma.user.update({
            where: { id },
            data: {
                fullName: fullName !== undefined ? fullName : undefined,
                bio: bio !== undefined ? bio : undefined,
                age: age !== undefined ? age : undefined,
                gender: gender !== undefined ? gender : undefined,
                interests: interests !== undefined ? interests : undefined,
                travelStyle: travelStyle !== undefined ? travelStyle : undefined,
                isSoloTraveler: isSoloTraveler !== undefined ? isSoloTraveler : undefined,
                avatarUrl: avatarUrl !== undefined ? avatarUrl : undefined,
            },
            select: {
                id: true,
                email: true,
                fullName: true,
                avatarUrl: true,
                bio: true,
                age: true,
                gender: true,
                interests: true,
                travelStyle: true,
                isSoloTraveler: true,
                totalPoints: true,
                updatedAt: true,
            },
        })

        return jsonResponse({
            message: "Profile updated successfully",
            user: updatedUser,
        })
    } catch (error) {
        console.error("Update user error:", error)
        return errorResponse("Internal server error", 500)
    }
}
