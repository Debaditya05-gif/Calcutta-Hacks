"use client"

import { useState, useMemo } from "react"
import type { Restaurant } from "@/lib/types"
import { mockRestaurants } from "@/lib/mock-data"
import { RestaurantFilters, type RestaurantFilterState } from "@/components/restaurant-explorer/restaurant-filters"
import { RestaurantCard } from "@/components/restaurant-explorer/restaurant-card"
import { RestaurantDetailsModal } from "@/components/restaurant-explorer/restaurant-details-modal"
import { MapPin } from "lucide-react"
import Link from "next/link"

export default function RestaurantsPage() {
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null)
  const [filters, setFilters] = useState<RestaurantFilterState>({
    priceRange: ["budget", "moderate", "luxury"],
    cuisines: ["Bengali", "Indian", "Continental", "Bakery"],
    minRating: 0,
    selectedDishes: [],
  })

  const filteredRestaurants = useMemo(() => {
    return mockRestaurants.filter((restaurant) => {
      // Price range filter
      if (!filters.priceRange.includes(restaurant.priceRange)) return false

      // Cuisine filter
      const hasCuisine = restaurant.cuisineType.some((cuisine) => filters.cuisines.includes(cuisine))
      if (!hasCuisine) return false

      // Rating filter
      if (restaurant.rating < filters.minRating) return false

      // Dishes filter
      if (filters.selectedDishes.length > 0) {
        const hasSpecialty = filters.selectedDishes.some((dish) => restaurant.specialties.includes(dish))
        if (!hasSpecialty) return false
      }

      return true
    })
  }, [filters])

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b border-border sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <Link href="/" className="flex items-center gap-2 mb-2 w-fit hover:text-primary transition">
                <span className="text-sm text-muted-foreground">← Back to Home</span>
              </Link>
              <h1 className="text-3xl font-bold text-foreground">Restaurant Guide</h1>
              <p className="text-muted-foreground">Discover Kolkata's culinary treasures</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-32">
              <RestaurantFilters onFiltersChange={setFilters} />
            </div>
          </div>

          {/* Restaurants Grid */}
          <div className="lg:col-span-3">
            <div className="mb-6">
              <p className="text-sm text-muted-foreground">Showing {filteredRestaurants.length} restaurants</p>
            </div>

            {filteredRestaurants.length > 0 ? (
              <div className="grid md:grid-cols-2 gap-6">
                {filteredRestaurants.map((restaurant) => (
                  <RestaurantCard key={restaurant.id} restaurant={restaurant} onSelect={setSelectedRestaurant} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <MapPin size={48} className="mx-auto text-muted-foreground mb-4 opacity-50" />
                <h3 className="text-lg font-semibold text-foreground mb-2">No restaurants found</h3>
                <p className="text-muted-foreground">Try adjusting your filters</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Details Modal */}
      {selectedRestaurant && (
        <RestaurantDetailsModal restaurant={selectedRestaurant} onClose={() => setSelectedRestaurant(null)} />
      )}
    </div>
  )
}
