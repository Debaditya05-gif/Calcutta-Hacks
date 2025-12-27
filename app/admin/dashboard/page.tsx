"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Users, MapPin, Utensils, Trophy, Eye, Star, Plus, TrendingUp } from "lucide-react"

interface StatsData {
    users: number
    sites: number
    restaurants: number
    badges: number
    visits: number
    reviews: number
}

export default function AdminDashboardPage() {
    const [stats, setStats] = useState<StatsData | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchStats()
    }, [])

    async function fetchStats() {
        try {
            const res = await fetch("/api/admin/stats")
            if (res.ok) {
                const data = await res.json()
                setStats(data)
            }
        } catch (error) {
            console.error("Failed to fetch stats:", error)
        } finally {
            setLoading(false)
        }
    }

    const statCards = [
        { label: "Total Users", value: stats?.users || 0, icon: Users, color: "bg-blue-500", href: "/admin/users" },
        { label: "Heritage Sites", value: stats?.sites || 0, icon: MapPin, color: "bg-orange-500", href: "/admin/sites" },
        { label: "Restaurants", value: stats?.restaurants || 0, icon: Utensils, color: "bg-amber-500", href: "/admin/restaurants" },
        { label: "Badges", value: stats?.badges || 0, icon: Trophy, color: "bg-purple-500", href: "/admin/badges" },
        { label: "Total Visits", value: stats?.visits || 0, icon: Eye, color: "bg-green-500", href: "#" },
        { label: "Reviews", value: stats?.reviews || 0, icon: Star, color: "bg-pink-500", href: "#" },
    ]

    const quickActions = [
        { label: "Add Heritage Site", href: "/admin/sites", icon: MapPin, color: "text-orange-600" },
        { label: "Add Restaurant", href: "/admin/restaurants", icon: Utensils, color: "text-amber-600" },
        { label: "Create Badge", href: "/admin/badges", icon: Trophy, color: "text-purple-600" },
        { label: "Create Quest", href: "/admin/quests", icon: TrendingUp, color: "text-green-600" },
    ]

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
                <p className="text-gray-600">Welcome to Kolkata Explorer Admin Panel</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {loading
                    ? Array(6)
                        .fill(0)
                        .map((_, i) => (
                            <div key={i} className="bg-white rounded-xl shadow-sm p-6 animate-pulse">
                                <div className="h-12 w-12 bg-gray-200 rounded-lg mb-4" />
                                <div className="h-8 bg-gray-200 rounded w-20 mb-2" />
                                <div className="h-4 bg-gray-200 rounded w-24" />
                            </div>
                        ))
                    : statCards.map((stat) => (
                        <Link
                            key={stat.label}
                            href={stat.href}
                            className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow"
                        >
                            <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center mb-4`}>
                                <stat.icon size={24} className="text-white" />
                            </div>
                            <h3 className="text-3xl font-bold text-gray-800">{stat.value.toLocaleString()}</h3>
                            <p className="text-gray-500">{stat.label}</p>
                        </Link>
                    ))}
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Quick Actions</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {quickActions.map((action) => (
                        <Link
                            key={action.label}
                            href={action.href}
                            className="flex flex-col items-center gap-2 p-4 border border-gray-200 rounded-lg hover:border-orange-300 hover:bg-orange-50 transition-colors"
                        >
                            <div className={`w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center ${action.color}`}>
                                <Plus size={20} />
                            </div>
                            <span className="text-sm text-gray-700 text-center">{action.label}</span>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    )
}
