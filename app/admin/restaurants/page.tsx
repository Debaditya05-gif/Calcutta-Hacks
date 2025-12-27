"use client"

import { useEffect, useState } from "react"
import { Search, Trash2, Plus, Utensils, Star, X, Loader2, Navigation, Pencil, BadgeCheck } from "lucide-react"

interface RestaurantData {
    id: string
    name: string
    cuisineType: string[]
    priceRange: string
    rating: number
    avgCostPerPerson: number
    address: string
    createdAt: string
    isAssured?: boolean
    _count?: {
        reviews: number
    }
}

export default function AdminRestaurantsPage() {
    const [restaurants, setRestaurants] = useState<RestaurantData[]>([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState("")
    const [showAddModal, setShowAddModal] = useState(false)
    const [showEditModal, setShowEditModal] = useState(false)
    const [editingRestaurant, setEditingRestaurant] = useState<RestaurantData | null>(null)
    const [geocoding, setGeocoding] = useState(false)
    const [geocodeError, setGeocodeError] = useState("")
    const [geocodeSuccess, setGeocodeSuccess] = useState("")
    const [formData, setFormData] = useState({
        name: "",
        cuisineType: "Bengali",
        priceRange: "$$",
        rating: "4.0",
        avgCostPerPerson: "500",
        address: "",
        latitude: "",
        longitude: "",
        description: "",
        isAssured: false,
    })

    useEffect(() => {
        fetchRestaurants()
    }, [search])

    async function fetchRestaurants() {
        setLoading(true)
        try {
            const res = await fetch(`/api/restaurants?search=${search}&limit=50`)
            if (res.ok) {
                const data = await res.json()
                setRestaurants(data.restaurants)
            }
        } catch (error) {
            console.error("Failed to fetch restaurants:", error)
        } finally {
            setLoading(false)
        }
    }

    async function deleteRestaurant(id: string) {
        if (!confirm("Are you sure you want to delete this restaurant?")) return

        try {
            const res = await fetch(`/api/admin/restaurants?id=${id}`, { method: "DELETE" })
            if (res.ok) {
                fetchRestaurants()
            }
        } catch (error) {
            console.error("Failed to delete restaurant:", error)
        }
    }

    function openEditModal(restaurant: RestaurantData) {
        setEditingRestaurant(restaurant)
        setFormData({
            name: restaurant.name,
            cuisineType: restaurant.cuisineType[0] || "Bengali",
            priceRange: restaurant.priceRange,
            rating: restaurant.rating.toString(),
            avgCostPerPerson: restaurant.avgCostPerPerson.toString(),
            address: restaurant.address,
            latitude: "",
            longitude: "",
            description: "",
            isAssured: restaurant.isAssured || false,
        })
        setGeocodeError("")
        setGeocodeSuccess("")
        setShowEditModal(true)
    }

    async function handleEditSubmit(e: React.FormEvent) {
        e.preventDefault()
        if (!editingRestaurant) return

        try {
            const res = await fetch(`/api/admin/restaurants?id=${editingRestaurant.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: formData.name,
                    cuisineType: [formData.cuisineType],
                    priceRange: formData.priceRange,
                    rating: parseFloat(formData.rating),
                    avgCostPerPerson: parseInt(formData.avgCostPerPerson),
                    address: formData.address,
                    isAssured: formData.isAssured,
                }),
            })
            if (res.ok) {
                setShowEditModal(false)
                setEditingRestaurant(null)
                setFormData({
                    name: "",
                    cuisineType: "Bengali",
                    priceRange: "$$",
                    rating: "4.0",
                    avgCostPerPerson: "500",
                    address: "",
                    latitude: "",
                    longitude: "",
                    description: "",
                    isAssured: false,
                })
                fetchRestaurants()
            } else {
                alert("Failed to update restaurant")
            }
        } catch (error) {
            console.error("Failed to update restaurant:", error)
            alert("Failed to update restaurant")
        }
    }

    // Auto-geocode function
    async function autoGeocode() {
        if (!formData.name) {
            setGeocodeError("Please enter a restaurant name first")
            return
        }

        setGeocoding(true)
        setGeocodeError("")
        setGeocodeSuccess("")

        try {
            const searchQuery = formData.name + " Restaurant"
            const res = await fetch(`/api/geocode?place=${encodeURIComponent(searchQuery)}`)
            const data = await res.json()

            if (res.ok && data.success) {
                setFormData({
                    ...formData,
                    latitude: data.latitude.toString(),
                    longitude: data.longitude.toString(),
                    address: data.formattedAddress || formData.address,
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
            const res = await fetch("/api/admin/restaurants", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...formData,
                    cuisineType: [formData.cuisineType],
                    rating: parseFloat(formData.rating),
                    avgCostPerPerson: parseInt(formData.avgCostPerPerson),
                    latitude: parseFloat(formData.latitude),
                    longitude: parseFloat(formData.longitude),
                }),
            })
            if (res.ok) {
                setShowAddModal(false)
                setFormData({
                    name: "",
                    cuisineType: "Bengali",
                    priceRange: "$$",
                    rating: "4.0",
                    avgCostPerPerson: "500",
                    address: "",
                    latitude: "",
                    longitude: "",
                    description: "",
                    isAssured: false,
                })
                setGeocodeError("")
                setGeocodeSuccess("")
                fetchRestaurants()
            }
        } catch (error) {
            console.error("Failed to create restaurant:", error)
        }
    }

    const cuisineTypes = ["Bengali", "Indian", "Mughlai", "Chinese", "Continental", "Street Food", "Cafe", "Sweets"]
    const priceRanges = ["$", "$$", "$$$", "$$$$"]

    return (
        <div>
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">Restaurants</h1>
                    <p className="text-gray-600">Manage restaurants in Kolkata</p>
                </div>
                <button
                    onClick={() => setShowAddModal(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors"
                >
                    <Plus size={20} />
                    Add Restaurant
                </button>
            </div>

            {/* Search */}
            <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input
                        type="text"
                        placeholder="Search restaurants..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                </div>
            </div>

            {/* Restaurants Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading ? (
                    <div className="col-span-full text-center py-12 text-gray-500">Loading...</div>
                ) : restaurants.length === 0 ? (
                    <div className="col-span-full text-center py-12 text-gray-500">No restaurants found</div>
                ) : (
                    [...restaurants]
                        .sort((a, b) => (b.isAssured ? 1 : 0) - (a.isAssured ? 1 : 0))
                        .map((restaurant) => (
                            <div key={restaurant.id} className={`bg-white rounded-xl shadow-sm overflow-hidden ${restaurant.isAssured ? 'ring-2 ring-green-500' : ''}`}>
                                <div className="h-32 bg-gradient-to-r from-amber-400 to-yellow-400 flex items-center justify-center relative">
                                    <Utensils size={48} className="text-white/50" />
                                    {restaurant.isAssured && (
                                        <div className="absolute top-2 right-2 flex items-center gap-1 px-2 py-1 bg-green-500 text-white text-xs font-semibold rounded-full">
                                            <BadgeCheck size={14} />
                                            We Assured
                                        </div>
                                    )}
                                </div>
                                <div className="p-4">
                                    <div className="flex items-start justify-between mb-2">
                                        <h3 className="font-bold text-gray-800">{restaurant.name}</h3>
                                        <div className="flex items-center gap-1 text-amber-500">
                                            <Star size={14} fill="currentColor" />
                                            <span className="text-sm">{restaurant.rating}</span>
                                        </div>
                                    </div>
                                    <p className="text-sm text-gray-600 mb-2">{restaurant.cuisineType.join(", ")}</p>
                                    <div className="flex items-center justify-between text-sm text-gray-500">
                                        <div>
                                            <span className="font-medium">{restaurant.priceRange}</span>
                                            <span className="mx-2">•</span>
                                            <span>₹{restaurant.avgCostPerPerson}/person</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <button
                                                onClick={() => openEditModal(restaurant)}
                                                className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                                                title="Edit"
                                            >
                                                <Pencil size={16} />
                                            </button>
                                            <button
                                                onClick={() => deleteRestaurant(restaurant.id)}
                                                className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                                title="Delete"
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
                            <h2 className="text-xl font-bold text-gray-800">Add Restaurant</h2>
                            <button onClick={() => setShowAddModal(false)} className="p-1 hover:bg-gray-100 rounded">
                                <X size={20} />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-4 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Restaurant Name *</label>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        required
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        placeholder="e.g., Peter Cat"
                                        className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500"
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
                                    Enter the restaurant name and click &quot;Find Location&quot; to auto-fill coordinates
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

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Cuisine Type</label>
                                    <select
                                        value={formData.cuisineType}
                                        onChange={(e) => setFormData({ ...formData, cuisineType: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500"
                                    >
                                        {cuisineTypes.map((c) => (
                                            <option key={c} value={c}>{c}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Price Range</label>
                                    <select
                                        value={formData.priceRange}
                                        onChange={(e) => setFormData({ ...formData, priceRange: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500"
                                    >
                                        {priceRanges.map((p) => (
                                            <option key={p} value={p}>{p}</option>
                                        ))}
                                    </select>
                                </div>
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
                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Avg Cost (₹)</label>
                                    <input
                                        type="number"
                                        value={formData.avgCostPerPerson}
                                        onChange={(e) => setFormData({ ...formData, avgCostPerPerson: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Address {formData.address && <span className="text-green-600">✓</span>}
                                </label>
                                <input
                                    type="text"
                                    value={formData.address}
                                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                    placeholder="Auto-filled from location search"
                                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 bg-gray-50"
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
                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 bg-gray-50"
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
                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 bg-gray-50"
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
                                    className="flex-1 px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
                                >
                                    Add Restaurant
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Edit Modal */}
            {showEditModal && editingRestaurant && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
                        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                            <h2 className="text-xl font-bold text-gray-800">Edit Restaurant</h2>
                            <button onClick={() => { setShowEditModal(false); setEditingRestaurant(null); }} className="p-1 hover:bg-gray-100 rounded">
                                <X size={20} />
                            </button>
                        </div>
                        <form onSubmit={handleEditSubmit} className="p-4 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Restaurant Name *</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Cuisine Type</label>
                                    <select
                                        value={formData.cuisineType}
                                        onChange={(e) => setFormData({ ...formData, cuisineType: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500"
                                    >
                                        {cuisineTypes.map((c) => (
                                            <option key={c} value={c}>{c}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Price Range</label>
                                    <select
                                        value={formData.priceRange}
                                        onChange={(e) => setFormData({ ...formData, priceRange: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500"
                                    >
                                        {priceRanges.map((p) => (
                                            <option key={p} value={p}>{p}</option>
                                        ))}
                                    </select>
                                </div>
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
                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Avg Cost (₹)</label>
                                    <input
                                        type="number"
                                        value={formData.avgCostPerPerson}
                                        onChange={(e) => setFormData({ ...formData, avgCostPerPerson: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                                <input
                                    type="text"
                                    value={formData.address}
                                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500"
                                />
                            </div>
                            <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-lg">
                                <div className="flex items-center gap-3">
                                    <BadgeCheck className="text-green-600" size={24} />
                                    <div>
                                        <p className="font-semibold text-gray-800">We Assured</p>
                                        <p className="text-xs text-gray-500">Mark this restaurant as verified and show at top</p>
                                    </div>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={formData.isAssured}
                                        onChange={(e) => setFormData({ ...formData, isAssured: e.target.checked })}
                                        className="sr-only peer"
                                    />
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                                </label>
                            </div>
                            <div className="pt-4 flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => { setShowEditModal(false); setEditingRestaurant(null); }}
                                    className="flex-1 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600"
                                >
                                    Save Changes
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}
