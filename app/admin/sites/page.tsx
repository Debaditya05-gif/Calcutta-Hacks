"use client"

import { useEffect, useState } from "react"
import { Search, Trash2, Plus, MapPin, Eye, X, Loader2, Navigation, Pencil } from "lucide-react"

interface SiteData {
    id: string
    name: string
    category: string
    shortDescription: string | null
    description: string
    latitude: number
    longitude: number
    address: string
    entryFee: number | null
    openingHours: string | null
    bestTimeToVisit: string | null
    historicalSignificance: string | null
    rating: number
    imageUrl: string | null
    visitCount: number
    createdAt: string
    _count: {
        visits: number
        quests: number
    }
}

export default function AdminSitesPage() {
    const [sites, setSites] = useState<SiteData[]>([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState("")
    const [showAddModal, setShowAddModal] = useState(false)
    const [showEditModal, setShowEditModal] = useState(false)
    const [editingSite, setEditingSite] = useState<SiteData | null>(null)
    const [geocoding, setGeocoding] = useState(false)
    const [geocodeError, setGeocodeError] = useState("")
    const [geocodeSuccess, setGeocodeSuccess] = useState("")
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        shortDescription: "",
        category: "Monument",
        latitude: "",
        longitude: "",
        address: "",
        entryFee: "",
        timings: "",
        bestTimeToVisit: "",
        historicalSignificance: "",
        rating: "",
        imageUrl: "",
    })
    const [editFormData, setEditFormData] = useState({
        name: "",
        description: "",
        shortDescription: "",
        category: "Monument",
        latitude: "",
        longitude: "",
        address: "",
        entryFee: "",
        timings: "",
        bestTimeToVisit: "",
        historicalSignificance: "",
        rating: "",
        imageUrl: "",
    })

    useEffect(() => {
        fetchSites()
    }, [search])

    async function fetchSites() {
        setLoading(true)
        try {
            const res = await fetch(`/api/admin/sites?search=${search}`)
            if (res.ok) {
                const data = await res.json()
                setSites(data.sites)
            }
        } catch (error) {
            console.error("Failed to fetch sites:", error)
        } finally {
            setLoading(false)
        }
    }

    async function deleteSite(id: string) {
        if (!confirm("Are you sure you want to delete this heritage site?")) return

        try {
            const res = await fetch(`/api/admin/sites?id=${id}`, { method: "DELETE" })
            if (res.ok) {
                fetchSites()
            }
        } catch (error) {
            console.error("Failed to delete site:", error)
        }
    }

    // Auto-geocode function
    async function autoGeocode() {
        if (!formData.name) {
            setGeocodeError("Please enter a site name first")
            return
        }

        setGeocoding(true)
        setGeocodeError("")
        setGeocodeSuccess("")

        try {
            const res = await fetch(`/api/geocode?place=${encodeURIComponent(formData.name)}`)
            const data = await res.json()

            if (res.ok && data.success) {
                setFormData({
                    ...formData,
                    latitude: data.latitude.toString(),
                    longitude: data.longitude.toString(),
                })
                setGeocodeSuccess(`Found: ${data.formattedAddress}`)
            } else {
                setGeocodeError(data.error || "Location not found. Please enter coordinates manually.")
            }
        } catch (error) {
            setGeocodeError("Failed to geocode. Please enter coordinates manually.")
        } finally {
            setGeocoding(false)
        }
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()

        // Validate coordinates
        if (!formData.latitude || !formData.longitude) {
            setGeocodeError("Please fetch location or enter coordinates manually")
            return
        }

        try {
            const res = await fetch("/api/admin/sites", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            })
            if (res.ok) {
                setShowAddModal(false)
                setFormData({
                    name: "",
                    description: "",
                    shortDescription: "",
                    category: "Monument",
                    latitude: "",
                    longitude: "",
                    address: "",
                    entryFee: "",
                    timings: "",
                    bestTimeToVisit: "",
                    historicalSignificance: "",
                    rating: "",
                    imageUrl: "",
                })
                setGeocodeError("")
                setGeocodeSuccess("")
                fetchSites()
            }
        } catch (error) {
            console.error("Failed to create site:", error)
        }
    }

    // Open edit modal with site data
    function openEditModal(site: SiteData) {
        setEditingSite(site)
        setEditFormData({
            name: site.name,
            description: site.description || "",
            shortDescription: site.shortDescription || "",
            category: site.category,
            latitude: site.latitude.toString(),
            longitude: site.longitude.toString(),
            address: site.address || "",
            entryFee: site.entryFee?.toString() || "",
            timings: site.openingHours || "",
            bestTimeToVisit: site.bestTimeToVisit || "",
            historicalSignificance: site.historicalSignificance || "",
            rating: site.rating?.toString() || "",
            imageUrl: site.imageUrl || "",
        })
        setGeocodeError("")
        setGeocodeSuccess("")
        setShowEditModal(true)
    }

    // Auto-geocode function for edit modal
    async function autoGeocodeEdit() {
        if (!editFormData.name) {
            setGeocodeError("Please enter a site name first")
            return
        }

        setGeocoding(true)
        setGeocodeError("")
        setGeocodeSuccess("")

        try {
            const res = await fetch(`/api/geocode?place=${encodeURIComponent(editFormData.name)}`)
            const data = await res.json()

            if (res.ok && data.success) {
                setEditFormData({
                    ...editFormData,
                    latitude: data.latitude.toString(),
                    longitude: data.longitude.toString(),
                })
                setGeocodeSuccess(`Found: ${data.formattedAddress}`)
            } else {
                setGeocodeError(data.error || "Location not found. Please enter coordinates manually.")
            }
        } catch (error) {
            setGeocodeError("Failed to geocode. Please enter coordinates manually.")
        } finally {
            setGeocoding(false)
        }
    }

    // Handle edit form submission
    async function handleEditSubmit(e: React.FormEvent) {
        e.preventDefault()

        if (!editingSite) return

        // Validate coordinates
        if (!editFormData.latitude || !editFormData.longitude) {
            setGeocodeError("Please fetch location or enter coordinates manually")
            return
        }

        try {
            const res = await fetch("/api/admin/sites", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    id: editingSite.id,
                    ...editFormData,
                }),
            })
            if (res.ok) {
                setShowEditModal(false)
                setEditingSite(null)
                setEditFormData({
                    name: "",
                    description: "",
                    shortDescription: "",
                    category: "Monument",
                    latitude: "",
                    longitude: "",
                    address: "",
                    entryFee: "",
                    timings: "",
                    bestTimeToVisit: "",
                    historicalSignificance: "",
                    rating: "",
                    imageUrl: "",
                })
                setGeocodeError("")
                setGeocodeSuccess("")
                fetchSites()
            } else {
                const data = await res.json()
                setGeocodeError(data.message || "Failed to update site")
            }
        } catch (error) {
            console.error("Failed to update site:", error)
            setGeocodeError("Failed to update site")
        }
    }

    const categories = ["Monument", "Temple", "Museum", "Bridge", "Market", "Park", "Colonial", "Religious"]

    return (
        <div>
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">Heritage Sites</h1>
                    <p className="text-gray-600">Manage heritage sites in Kolkata</p>
                </div>
                <button
                    onClick={() => setShowAddModal(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                >
                    <Plus size={20} />
                    Add Site
                </button>
            </div>

            {/* Search */}
            <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input
                        type="text"
                        placeholder="Search sites..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                </div>
            </div>

            {/* Sites Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading ? (
                    <div className="col-span-full text-center py-12 text-gray-500">Loading...</div>
                ) : sites.length === 0 ? (
                    <div className="col-span-full text-center py-12 text-gray-500">No sites found</div>
                ) : (
                    sites.map((site) => (
                        <div key={site.id} className="bg-white rounded-xl shadow-sm overflow-hidden">
                            <div className="h-32 bg-gradient-to-r from-orange-400 to-amber-400 flex items-center justify-center">
                                <MapPin size={48} className="text-white/50" />
                            </div>
                            <div className="p-4">
                                <div className="flex items-start justify-between mb-2">
                                    <h3 className="font-bold text-gray-800">{site.name}</h3>
                                    <span className="px-2 py-1 text-xs bg-orange-100 text-orange-700 rounded-full">
                                        {site.category}
                                    </span>
                                </div>
                                <p className="text-sm text-gray-600 mb-3 line-clamp-2">{site.shortDescription}</p>
                                <div className="flex items-center justify-between text-sm text-gray-500">
                                    <div className="flex items-center gap-4">
                                        <span className="flex items-center gap-1">
                                            <Eye size={14} />
                                            {site._count.visits} visits
                                        </span>
                                        <span>₹{site.entryFee || "Free"}</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <button
                                            onClick={() => openEditModal(site)}
                                            className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                                            title="Edit site"
                                        >
                                            <Pencil size={16} />
                                        </button>
                                        <button
                                            onClick={() => deleteSite(site.id)}
                                            className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                            title="Delete site"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Add Modal */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
                        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                            <h2 className="text-xl font-bold text-gray-800">Add Heritage Site</h2>
                            <button onClick={() => setShowAddModal(false)} className="p-1 hover:bg-gray-100 rounded">
                                <X size={20} />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-4 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Site Name *</label>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        required
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        placeholder="e.g., Victoria Memorial"
                                        className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500"
                                    />
                                    <button
                                        type="button"
                                        onClick={autoGeocode}
                                        disabled={geocoding || !formData.name}
                                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center gap-2"
                                    >
                                        {geocoding ? (
                                            <Loader2 size={18} className="animate-spin" />
                                        ) : (
                                            <Navigation size={18} />
                                        )}
                                        {geocoding ? "Finding..." : "Find Location"}
                                    </button>
                                </div>
                                <p className="text-xs text-gray-500 mt-1">
                                    Enter the site name and click &quot;Find Location&quot; to auto-fill coordinates
                                </p>
                            </div>

                            {geocodeError && (
                                <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-lg text-sm">
                                    {geocodeError}
                                </div>
                            )}

                            {geocodeSuccess && (
                                <div className="bg-green-50 border border-green-200 text-green-700 px-3 py-2 rounded-lg text-sm">
                                    ✓ {geocodeSuccess}
                                </div>
                            )}

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
                                <select
                                    value={formData.category}
                                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500"
                                >
                                    {categories.map((cat) => (
                                        <option key={cat} value={cat}>{cat}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Short Description</label>
                                <input
                                    type="text"
                                    value={formData.shortDescription}
                                    onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    rows={3}
                                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Latitude {formData.latitude && <span className="text-green-600">✓</span>}
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.latitude}
                                        onChange={(e) => setFormData({ ...formData, latitude: e.target.value })}
                                        placeholder="Auto-filled"
                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 bg-gray-50"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Longitude {formData.longitude && <span className="text-green-600">✓</span>}
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.longitude}
                                        onChange={(e) => setFormData({ ...formData, longitude: e.target.value })}
                                        placeholder="Auto-filled"
                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 bg-gray-50"
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Entry Fee (₹)</label>
                                    <input
                                        type="number"
                                        value={formData.entryFee}
                                        onChange={(e) => setFormData({ ...formData, entryFee: e.target.value })}
                                        placeholder="0 for free entry"
                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Timings (Hours)</label>
                                    <input
                                        type="text"
                                        value={formData.timings}
                                        onChange={(e) => setFormData({ ...formData, timings: e.target.value })}
                                        placeholder="10:00 AM - 5:00 PM"
                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                                <input
                                    type="text"
                                    value={formData.address}
                                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                    placeholder="27 Chowringhee Road, Kolkata 700071"
                                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Best Time to Visit</label>
                                <input
                                    type="text"
                                    value={formData.bestTimeToVisit}
                                    onChange={(e) => setFormData({ ...formData, bestTimeToVisit: e.target.value })}
                                    placeholder="Weekday mornings"
                                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Historical Significance</label>
                                <textarea
                                    value={formData.historicalSignificance}
                                    onChange={(e) => setFormData({ ...formData, historicalSignificance: e.target.value })}
                                    rows={2}
                                    placeholder="Founded in 1814, houses over 1 million artifacts"
                                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Rating (0-5)</label>
                                    <input
                                        type="number"
                                        step="0.1"
                                        min="0"
                                        max="5"
                                        value={formData.rating}
                                        onChange={(e) => setFormData({ ...formData, rating: e.target.value })}
                                        placeholder="4.5"
                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                                    <input
                                        type="text"
                                        value={formData.imageUrl}
                                        onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                                        placeholder="https://..."
                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500"
                                    />
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
                                    disabled={!formData.latitude || !formData.longitude}
                                    className="flex-1 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
                                >
                                    Add Site
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Edit Modal */}
            {showEditModal && editingSite && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
                        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                            <h2 className="text-xl font-bold text-gray-800">Edit Heritage Site</h2>
                            <button onClick={() => { setShowEditModal(false); setEditingSite(null); }} className="p-1 hover:bg-gray-100 rounded">
                                <X size={20} />
                            </button>
                        </div>
                        <form onSubmit={handleEditSubmit} className="p-4 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Site Name *</label>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        required
                                        value={editFormData.name}
                                        onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                                        placeholder="e.g., Victoria Memorial"
                                        className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500"
                                    />
                                    <button
                                        type="button"
                                        onClick={autoGeocodeEdit}
                                        disabled={geocoding || !editFormData.name}
                                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center gap-2"
                                    >
                                        {geocoding ? (
                                            <Loader2 size={18} className="animate-spin" />
                                        ) : (
                                            <Navigation size={18} />
                                        )}
                                        {geocoding ? "Finding..." : "Find Location"}
                                    </button>
                                </div>
                                <p className="text-xs text-gray-500 mt-1">
                                    Enter the site name and click &quot;Find Location&quot; to update coordinates
                                </p>
                            </div>

                            {geocodeError && (
                                <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-lg text-sm">
                                    {geocodeError}
                                </div>
                            )}

                            {geocodeSuccess && (
                                <div className="bg-green-50 border border-green-200 text-green-700 px-3 py-2 rounded-lg text-sm">
                                    ✓ {geocodeSuccess}
                                </div>
                            )}

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
                                <select
                                    value={editFormData.category}
                                    onChange={(e) => setEditFormData({ ...editFormData, category: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500"
                                >
                                    {categories.map((cat) => (
                                        <option key={cat} value={cat}>{cat}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Short Description</label>
                                <input
                                    type="text"
                                    value={editFormData.shortDescription}
                                    onChange={(e) => setEditFormData({ ...editFormData, shortDescription: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                <textarea
                                    value={editFormData.description}
                                    onChange={(e) => setEditFormData({ ...editFormData, description: e.target.value })}
                                    rows={3}
                                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Latitude {editFormData.latitude && <span className="text-green-600">✓</span>}
                                    </label>
                                    <input
                                        type="text"
                                        value={editFormData.latitude}
                                        onChange={(e) => setEditFormData({ ...editFormData, latitude: e.target.value })}
                                        placeholder="Auto-filled"
                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 bg-gray-50"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Longitude {editFormData.longitude && <span className="text-green-600">✓</span>}
                                    </label>
                                    <input
                                        type="text"
                                        value={editFormData.longitude}
                                        onChange={(e) => setEditFormData({ ...editFormData, longitude: e.target.value })}
                                        placeholder="Auto-filled"
                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 bg-gray-50"
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Entry Fee (₹)</label>
                                    <input
                                        type="number"
                                        value={editFormData.entryFee}
                                        onChange={(e) => setEditFormData({ ...editFormData, entryFee: e.target.value })}
                                        placeholder="0 for free entry"
                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Timings (Hours)</label>
                                    <input
                                        type="text"
                                        value={editFormData.timings}
                                        onChange={(e) => setEditFormData({ ...editFormData, timings: e.target.value })}
                                        placeholder="10:00 AM - 5:00 PM"
                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                                <input
                                    type="text"
                                    value={editFormData.address}
                                    onChange={(e) => setEditFormData({ ...editFormData, address: e.target.value })}
                                    placeholder="27 Chowringhee Road, Kolkata 700071"
                                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Best Time to Visit</label>
                                <input
                                    type="text"
                                    value={editFormData.bestTimeToVisit}
                                    onChange={(e) => setEditFormData({ ...editFormData, bestTimeToVisit: e.target.value })}
                                    placeholder="Weekday mornings"
                                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Historical Significance</label>
                                <textarea
                                    value={editFormData.historicalSignificance}
                                    onChange={(e) => setEditFormData({ ...editFormData, historicalSignificance: e.target.value })}
                                    rows={2}
                                    placeholder="Founded in 1814, houses over 1 million artifacts"
                                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Rating (0-5)</label>
                                    <input
                                        type="number"
                                        step="0.1"
                                        min="0"
                                        max="5"
                                        value={editFormData.rating}
                                        onChange={(e) => setEditFormData({ ...editFormData, rating: e.target.value })}
                                        placeholder="4.5"
                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                                    <input
                                        type="text"
                                        value={editFormData.imageUrl}
                                        onChange={(e) => setEditFormData({ ...editFormData, imageUrl: e.target.value })}
                                        placeholder="https://..."
                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500"
                                    />
                                </div>
                            </div>
                            <div className="pt-4 flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => { setShowEditModal(false); setEditingSite(null); }}
                                    className="flex-1 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={!editFormData.latitude || !editFormData.longitude}
                                    className="flex-1 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
                                >
                                    Update Site
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}
