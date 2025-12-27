import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { prisma } from "./prisma"

export async function getCurrentUser() {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
        return null
    }

    const user = await prisma.user.findUnique({
        where: { email: session.user.email },
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
            updatedAt: true,
        },
    })

    return user
}

export async function requireAuth() {
    const user = await getCurrentUser()

    if (!user) {
        throw new Error("Unauthorized")
    }

    return user
}

// Helper to create a JSON response
export function jsonResponse(data: unknown, status = 200) {
    return new Response(JSON.stringify(data), {
        status,
        headers: { "Content-Type": "application/json" },
    })
}

// Helper for error responses
export function errorResponse(message: string, status = 400) {
    return jsonResponse({ error: message }, status)
}
