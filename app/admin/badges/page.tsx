"use client"

import { useEffect, useState } from "react"
import { Trash2, Plus, Trophy, X } from "lucide-react"

interface BadgeData {
    id: string
    name: string
    description: string
    iconUrl: string | null
    pointsRequired: number
    category: string
    createdAt: string
    _count?: {
        users: number
    }
}

export default function AdminBadgesPage() {
    const [badges, setBadges] = useState<BadgeData[]>([])
    const [loading, setLoading] = useState(true)
    const [showAddModal, setShowAddModal] = useState(false)
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        pointsRequired: "100",
        category: "explorer",
    })

    useEffect(() => {
        fetchBadges()
    }, [])

    async function fetchBadges() {
        setLoading(true)
        try {
            const res = await fetch("/api/badges")
            if (res.ok) {
                const data = await res.json()
                setBadges(data.badges || data)
            }
        } catch (error) {
            console.error("Failed to fetch badges:", error)
        } finally {
            setLoading(false)
        }
    }

    async function deleteBadge(id: string) {
        if (!confirm("Are you sure you want to delete this badge?")) return

        try {
            const res = await fetch(`/api/admin/badges?id=${id}`, { method: "DELETE" })
            if (res.ok) {
                fetchBadges()
            }
        } catch (error) {
            console.error("Failed to delete badge:", error)
        }
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        try {
            const res = await fetch("/api/admin/badges", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...formData,
                    pointsRequired: parseInt(formData.pointsRequired),
                }),
            })
            if (res.ok) {
                setShowAddModal(false)
                setFormData({
                    name: "",
                    description: "",
                    pointsRequired: "100",
                    category: "explorer",
                })
                fetchBadges()
            }
        } catch (error) {
            console.error("Failed to create badge:", error)
        }
    }

    const categories = ["explorer", "foodie", "heritage", "social", "special"]
    const categoryColors: Record<string, string> = {
        explorer: "bg-blue-500",
        foodie: "bg-amber-500",
        heritage: "bg-orange-500",
        social: "bg-pink-500",
        special: "bg-purple-500",
    }

    return (
        <div>
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">Badges</h1>
                    <p className="text-gray-600">Manage achievement badges</p>
                </div>
                <button
                    onClick={() => setShowAddModal(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
                >
                    <Plus size={20} />
                    Create Badge
                </button>
            </div>

            {/* Badges Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {loading ? (
                    <div className="col-span-full text-center py-12 text-gray-500">Loading...</div>
                ) : badges.length === 0 ? (
                    <div className="col-span-full text-center py-12 text-gray-500">No badges found</div>
                ) : (
                    badges.map((badge) => (
                        <div key={badge.id} className="bg-white rounded-xl shadow-sm p-6 text-center">
                            <div
                                className={`w-16 h-16 ${categoryColors[badge.category] || "bg-gray-500"} rounded-full mx-auto mb-4 flex items-center justify-center`}
                            >
                                <Trophy size={32} className="text-white" />
                            </div>
                            <h3 className="font-bold text-gray-800 mb-1">{badge.name}</h3>
                            <p className="text-sm text-gray-500 mb-2 line-clamp-2">{badge.description}</p>
                            <div className="flex items-center justify-center gap-2 mb-3">
                                <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full">
                                    {badge.pointsRequired} pts
                                </span>
                                <span className="px-2 py-1 text-xs bg-purple-100 text-purple-600 rounded-full capitalize">
                                    {badge.category}
                                </span>
                            </div>
                            <button
                                onClick={() => deleteBadge(badge.id)}
                                className="text-red-500 hover:text-red-600 transition-colors"
                            >
                                <Trash2 size={18} />
                            </button>
                        </div>
                    ))
                )}
            </div>

            {/* Add Modal */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl w-full max-w-md mx-4">
                        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                            <h2 className="text-xl font-bold text-gray-800">Create Badge</h2>
                            <button onClick={() => setShowAddModal(false)} className="p-1 hover:bg-gray-100 rounded">
                                <X size={20} />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-4 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Badge Name *</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="e.g., Heritage Explorer"
                                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    placeholder="What the user needs to do to earn this badge"
                                    rows={2}
                                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Points Required</label>
                                    <input
                                        type="number"
                                        value={formData.pointsRequired}
                                        onChange={(e) => setFormData({ ...formData, pointsRequired: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                                    <select
                                        value={formData.category}
                                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500"
                                    >
                                        {categories.map((c) => (
                                            <option key={c} value={c} className="capitalize">{c}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div className="pt-4 flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => setShowAddModal(false)}
                                    className="flex-1 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600"
                                >
                                    Create Badge
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}
