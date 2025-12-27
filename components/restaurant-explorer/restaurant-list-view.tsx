"use client"

import type { HeritageSite } from "@/lib/types"
import { ArrowLeft, MapPin, Star, DollarSign, Utensils, BadgeCheck, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"

interface Restaurant {
  id: string
  name: string
  cuisineType: string[]
  priceRange: string
  rating: number
  avgCostPerPerson: number
  address: string
  description: string
  specialties: string[]
  isAssured?: boolean
}

interface RestaurantListViewProps {
  heritageSite: HeritageSite
  onBack: () => void
}

export function RestaurantListView({ heritageSite, onBack }: RestaurantListViewProps) {
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null)
  const [restaurants, setRestaurants] = useState<Restaurant[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchRestaurants()
  }, [])

  async function fetchRestaurants() {
    setLoading(true)
    try {
      const res = await fetch("/api/restaurants?limit=10")
      if (res.ok) {
        const data = await res.json()
        // Sort assured restaurants to the top
        const sorted = (data.restaurants || []).sort((a: Restaurant, b: Restaurant) =>
          (b.isAssured ? 1 : 0) - (a.isAssured ? 1 : 0)
        )
        setRestaurants(sorted)
      }
    } catch (error) {
      console.error("Failed to fetch restaurants:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="animate-slide-up bg-card rounded-xl shadow-lg overflow-hidden border border-border max-h-96 overflow-y-auto">
      <div className="p-4 border-b border-border flex items-center gap-3 sticky top-0 bg-card z-10">
        <button onClick={onBack} className="p-1 hover:bg-muted rounded transition">
          <ArrowLeft size={20} />
        </button>
        <div className="flex-1">
          <p className="text-xs text-muted-foreground">Near</p>
          <h3 className="font-semibold text-foreground">{heritageSite.name}</h3>
        </div>
      </div>

      <div className="p-4 space-y-3">
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="animate-spin text-primary" size={24} />
          </div>
        ) : restaurants.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">No restaurants found</div>
        ) : (
          restaurants.slice(0, 5).map((restaurant) => (
            <button
              key={restaurant.id}
              onClick={() => setSelectedRestaurant(restaurant)}
              className={`w-full text-left p-3 rounded-lg border transition-colors ${selectedRestaurant?.id === restaurant.id
                  ? "bg-primary/10 border-primary"
                  : restaurant.isAssured
                    ? "border-green-500 bg-green-50 hover:bg-green-100"
                    : "border-border hover:bg-muted"
                }`}
            >
              <div className="flex justify-between items-start gap-2">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-semibold text-foreground">{restaurant.name}</h4>
                    {restaurant.isAssured && (
                      <span className="flex items-center gap-1 px-1.5 py-0.5 bg-green-500 text-white text-xs font-semibold rounded">
                        <BadgeCheck size={10} />
                        Assured
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">{restaurant.cuisineType.join(", ")}</p>
                </div>
                <div className="flex items-center gap-1 bg-yellow-100 px-2 py-1 rounded">
                  <Star size={14} className="fill-yellow-500 text-yellow-500" />
                  <span className="text-xs font-semibold">{restaurant.rating}</span>
                </div>
              </div>

              <div className="flex gap-3 mt-2 text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Utensils size={12} />
                  {restaurant.priceRange}
                </div>
                <div className="flex items-center gap-1">
                  <DollarSign size={12} />₹{restaurant.avgCostPerPerson}
                </div>
              </div>
            </button>
          ))
        )}
      </div>

      {/* Selected Restaurant Details */}
      {selectedRestaurant && (
        <div className="p-4 border-t border-border bg-muted/30">
          <div className="flex items-center gap-2 mb-2">
            <h4 className="font-semibold">{selectedRestaurant.name}</h4>
            {selectedRestaurant.isAssured && (
              <span className="flex items-center gap-1 px-2 py-0.5 bg-green-500 text-white text-xs font-semibold rounded">
                <BadgeCheck size={12} />
                We Assured
              </span>
            )}
          </div>
          <p className="text-sm mb-3">{selectedRestaurant.description}</p>
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <MapPin size={14} className="text-accent" />
              <span>{selectedRestaurant.address}</span>
            </div>
            {selectedRestaurant.specialties && selectedRestaurant.specialties.length > 0 && (
              <div>
                <p className="font-semibold mb-1">Specialties:</p>
                <div className="flex flex-wrap gap-1">
                  {selectedRestaurant.specialties.map((specialty) => (
                    <span key={specialty} className="px-2 py-1 bg-accent/10 text-accent text-xs rounded">
                      {specialty}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
          <Button className="w-full mt-3 bg-accent hover:bg-accent/90">Get Directions</Button>
        </div>
      )}
    </div>
  )
}

