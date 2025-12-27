import { getCurrentUser, jsonResponse, errorResponse } from "@/lib/auth"

export async function GET() {
    try {
        const user = await getCurrentUser()

        if (!user) {
            return errorResponse("Not authenticated", 401)
        }

        return jsonResponse({ user })
    } catch (error) {
        console.error("Get current user error:", error)
        return errorResponse("Internal server error", 500)
    }
}
