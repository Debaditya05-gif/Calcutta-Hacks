import { NextRequest } from "next/server"
import { jsonResponse, errorResponse } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

// GET all heritage sites
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const page = parseInt(searchParams.get("page") || "1")
        const limit = parseInt(searchParams.get("limit") || "10")
        const search = searchParams.get("search") || ""

        const where = search
            ? {
                OR: [
                    { name: { contains: search } },
                    { category: { contains: search } },
                ],
            }
            : {}

        const [sites, total] = await Promise.all([
            prisma.heritageSite.findMany({
                where,
                select: {
                    id: true,
                    name: true,
                    shortDescription: true,
                    description: true,
                    category: true,
                    latitude: true,
                    longitude: true,
                    address: true,
                    entryFee: true,
                    openingHours: true,
                    bestTimeToVisit: true,
                    historicalSignificance: true,
                    rating: true,
                    imageUrl: true,
                    visitCount: true,
                    createdAt: true,
                    _count: {
                        select: { visits: true, quests: true },
                    },
                },
                skip: (page - 1) * limit,
                take: limit,
                orderBy: { createdAt: "desc" },
            }),
            prisma.heritageSite.count({ where }),
        ])

        return jsonResponse({
            sites,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit),
            },
        })
    } catch (error) {
        console.error("Admin sites error:", error)
        return errorResponse("Failed to fetch sites", 500)
    }
}

// POST create new site
export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { name, description, shortDescription, category, latitude, longitude, imageUrl, entryFee, timings, address, bestTimeToVisit, historicalSignificance, rating } = body

        if (!name || !category || !latitude || !longitude) {
            return errorResponse("Name, category, latitude and longitude are required", 400)
        }

        const site = await prisma.heritageSite.create({
            data: {
                name,
                shortDescription: shortDescription || null,
                description: description || shortDescription || name,
                category,
                latitude: parseFloat(latitude),
                longitude: parseFloat(longitude),
                address: address || `${name}, Kolkata, India`,
                imageUrl: imageUrl || "",
                entryFee: entryFee ? parseInt(entryFee) : null,
                openingHours: timings || null,
                bestTimeToVisit: bestTimeToVisit || null,
                historicalSignificance: historicalSignificance || null,
                rating: rating ? parseFloat(rating) : 0,
            },
        })

        return jsonResponse({ success: true, site })
    } catch (error) {
        console.error("Create site error:", error)
        return errorResponse("Failed to create site", 500)
    }
}

// PUT update site
export async function PUT(request: NextRequest) {
    try {
        const body = await request.json()
        const { id, name, description, shortDescription, category, latitude, longitude, imageUrl, entryFee, timings, address, bestTimeToVisit, historicalSignificance, rating } = body

        if (!id) {
            return errorResponse("Site ID is required", 400)
        }

        if (!name || !category || !latitude || !longitude) {
            return errorResponse("Name, category, latitude and longitude are required", 400)
        }

        const site = await prisma.heritageSite.update({
            where: { id },
            data: {
                name,
                shortDescription: shortDescription || null,
                description: description || name,
                category,
                latitude: parseFloat(latitude),
                longitude: parseFloat(longitude),
                address: address || `${name}, Kolkata, India`,
                imageUrl: imageUrl || undefined,
                entryFee: entryFee ? parseInt(entryFee) : null,
                openingHours: timings || null,
                bestTimeToVisit: bestTimeToVisit || null,
                historicalSignificance: historicalSignificance || null,
                rating: rating ? parseFloat(rating) : undefined,
            },
        })

        return jsonResponse({ success: true, site })
    } catch (error) {
        console.error("Update site error:", error)
        return errorResponse("Failed to update site", 500)
    }
}

// DELETE site
export async function DELETE(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const id = searchParams.get("id")

        if (!id) {
            return errorResponse("Site ID required", 400)
        }

        await prisma.heritageSite.delete({
            where: { id },
        })

        return jsonResponse({ success: true })
    } catch (error) {
        console.error("Delete site error:", error)
        return errorResponse("Failed to delete site", 500)
    }
}
