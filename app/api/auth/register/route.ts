import { NextRequest } from "next/server"
import bcrypt from "bcryptjs"
import { prisma } from "@/lib/prisma"
import { jsonResponse, errorResponse } from "@/lib/auth"

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { email, password, fullName, age, gender, interests, travelStyle } = body

        // Validate required fields
        if (!email || !password || !fullName) {
            return errorResponse("Email, password, and full name are required", 400)
        }

        // Check if user already exists
        const existingUser = await prisma.user.findUnique({
            where: { email },
        })

        if (existingUser) {
            return errorResponse("User with this email already exists", 409)
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 12)

        // Create user
        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                fullName,
                age: age || null,
                gender: gender || null,
                interests: interests || [],
                travelStyle: travelStyle || null,
                isSoloTraveler: true,
                avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(fullName)}`,
            },
            select: {
                id: true,
                email: true,
                fullName: true,
                avatarUrl: true,
                createdAt: true,
            },
        })

        return jsonResponse({
            message: "User registered successfully",
            user
        }, 201)
    } catch (error) {
        console.error("Registration error:", error)
        return errorResponse("Internal server error", 500)
    }
}
