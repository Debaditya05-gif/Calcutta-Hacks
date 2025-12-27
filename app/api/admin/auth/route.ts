import { NextRequest } from "next/server"
import { jsonResponse, errorResponse } from "@/lib/auth"
import crypto from "crypto"

// Admin password - set this in your .env file
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin123"

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { password } = body

        if (!password) {
            return errorResponse("Password is required", 400)
        }

        if (password !== ADMIN_PASSWORD) {
            return errorResponse("Invalid password", 401)
        }

        // Generate a simple token
        const token = crypto.randomBytes(32).toString("hex")

        // In production, you would store this token in a database or use JWT
        // For now, we'll just return it and verify on the client side

        return jsonResponse({
            success: true,
            token,
            message: "Login successful",
        })
    } catch (error) {
        console.error("Admin auth error:", error)
        return errorResponse("Authentication failed", 500)
    }
}

// GET to verify token (simple check)
export async function GET(request: NextRequest) {
    try {
        const authHeader = request.headers.get("Authorization")

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return errorResponse("Unauthorized", 401)
        }

        // In a real app, verify the token against stored tokens
        // For now, just check if it exists and has valid format
        const token = authHeader.split(" ")[1]

        if (!token || token.length !== 64) {
            return errorResponse("Invalid token", 401)
        }

        return jsonResponse({ success: true, valid: true })
    } catch (error) {
        console.error("Token verification error:", error)
        return errorResponse("Verification failed", 500)
    }
}
