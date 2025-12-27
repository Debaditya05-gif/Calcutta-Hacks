"use client"

import { useEffect, useState } from "react"
import { Trash2, Plus, Scroll, MapPin, X } from "lucide-react"

interface QuestData {
    id: string
    title: string
    description: string
    questType: string
    pointsReward: number
    isActive: boolean
    site?: {
        id: string
        name: string
    }
}

interface SiteOption {
    id: string
    name: string
}

export default function AdminQuestsPage() {
    const [quests, setQuests] = useState<QuestData[]>([])
    const [sites, setSites] = useState<SiteOption[]>([])
    const [loading, setLoading] = useState(true)
    const [showAddModal, setShowAddModal] = useState(false)
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        questType: "visit",
        pointsReward: "50",
        siteId: "",
    })

    useEffect(() => {
        fetchQuests()
        fetchSites()
    }, [])

    async function fetchQuests() {
        setLoading(true)
        try {
            const res = await fetch("/api/quests")
            if (res.ok) {
                const data = await res.json()
                setQuests(data.quests || data)
            }
        } catch (error) {
            console.error("Failed to fetch quests:", error)
        } finally {
            setLoading(false)
        }
    }

    async function fetchSites() {
        try {
            const res = await fetch("/api/heritage-sites?limit=50")
            if (res.ok) {
                const data = await res.json()
                setSites(data.sites?.map((s: { id: string; name: string }) => ({ id: s.id, name: s.name })) || [])
            }
        } catch (error) {
            console.error("Failed to fetch sites:", error)
        }
    }

    async function deleteQuest(id: string) {
        if (!confirm("Are you sure you want to delete this quest?")) return

        try {
            const res = await fetch(`/api/admin/quests?id=${id}`, { method: "DELETE" })
            if (res.ok) {
                fetchQuests()
            }
        } catch (error) {
            console.error("Failed to delete quest:", error)
        }
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        try {
            const res = await fetch("/api/admin/quests", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...formData,
                    pointsReward: parseInt(formData.pointsReward),
                }),
            })
            if (res.ok) {
                setShowAddModal(false)
                setFormData({
                    title: "",
                    description: "",
                    questType: "visit",
                    pointsReward: "50",
                    siteId: "",
                })
                fetchQuests()
            }
        } catch (error) {
            console.error("Failed to create quest:", error)
        }
    }

    const questTypes = ["visit", "photo", "review", "checkin", "explore"]
    const typeColors: Record<string, string> = {
        visit: "bg-green-100 text-green-700",
        photo: "bg-blue-100 text-blue-700",
        review: "bg-amber-100 text-amber-700",
        checkin: "bg-pink-100 text-pink-700",
        explore: "bg-purple-100 text-purple-700",
    }

    return (
        <div>
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">Quests</h1>
                    <p className="text-gray-600">Manage gamified quests</p>
                </div>
                <button
                    onClick={() => setShowAddModal(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                >
                    <Plus size={20} />
                    Create Quest
                </button>
            </div>

            {/* Quests List */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Quest</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Site</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Points</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {loading ? (
                            <tr>
                                <td colSpan={6} className="px-6 py-12 text-center text-gray-500">Loading...</td>
                            </tr>
                        ) : quests.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="px-6 py-12 text-center text-gray-500">No quests found</td>
                            </tr>
                        ) : (
                            quests.map((quest) => (
                                <tr key={quest.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                                                <Scroll size={20} className="text-green-600" />
                                            </div>
                                            <div>
                                                <p className="font-medium text-gray-800">{quest.title}</p>
                                                <p className="text-sm text-gray-500 line-clamp-1">{quest.description}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 text-xs rounded-full capitalize ${typeColors[quest.questType] || "bg-gray-100 text-gray-700"}`}>
                                            {quest.questType}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        {quest.site ? (
                                            <div className="flex items-center gap-1 text-sm text-gray-600">
                                                <MapPin size={14} />
                                                {quest.site.name}
                                            </div>
                                        ) : (
                                            <span className="text-gray-400">-</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="font-semibold text-green-600">+{quest.pointsReward}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 text-xs rounded-full ${quest.isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"}`}>
                                            {quest.isActive ? "Active" : "Inactive"}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button
                                            onClick={() => deleteQuest(quest.id)}
                                            className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Add Modal */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl w-full max-w-md mx-4">
                        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                            <h2 className="text-xl font-bold text-gray-800">Create Quest</h2>
                            <button onClick={() => setShowAddModal(false)} className="p-1 hover:bg-gray-100 rounded">
                                <X size={20} />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-4 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Quest Title *</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    placeholder="e.g., Visit Victoria Memorial"
                                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    placeholder="Quest instructions"
                                    rows={2}
                                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Quest Type</label>
                                    <select
                                        value={formData.questType}
                                        onChange={(e) => setFormData({ ...formData, questType: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500"
                                    >
                                        {questTypes.map((t) => (
                                            <option key={t} value={t} className="capitalize">{t}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Points Reward</label>
                                    <input
                                        type="number"
                                        value={formData.pointsReward}
                                        onChange={(e) => setFormData({ ...formData, pointsReward: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Heritage Site (optional)</label>
                                <select
                                    value={formData.siteId}
                                    onChange={(e) => setFormData({ ...formData, siteId: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500"
                                >
                                    <option value="">No specific site</option>
                                    {sites.map((site) => (
                                        <option key={site.id} value={site.id}>{site.name}</option>
                                    ))}
                                </select>
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
                                    className="flex-1 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                                >
                                    Create Quest
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}
