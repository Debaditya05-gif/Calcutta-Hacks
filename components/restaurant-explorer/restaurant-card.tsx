"use client"

import type { Restaurant } from "@/lib/types"
import { Star, DollarSign, Utensils, Heart } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"

interface RestaurantCardProps {
  restaurant: Restaurant
  onSelect: (restaurant: Restaurant) => void
}

export function RestaurantCard({ restaurant, onSelect }: RestaurantCardProps) {
  const [isFavorited, setIsFavorited] = useState(false)

  return (
    <div className="animate-fade-in bg-card rounded-lg border border-border overflow-hidden hover:shadow-lg hover:border-primary transition-all group cursor-pointer">
      {/* Image Container */}
      <div className="relative h-40 bg-gradient-to-b from-accent/20 to-primary/20 overflow-hidden">
        <img
          src={restaurant.imageUrl || "/placeholder.svg?height=160&width=300"}
          alt={restaurant.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
        />
        <button
          onClick={(e) => {
            e.stopPropagation()
            setIsFavorited(!isFavorited)
          }}
          className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:bg-opacity-90 transition"
        >
          <Heart size={16} className={isFavorited ? "fill-red-500 text-red-500" : ""} />
        </button>
        <div className="absolute top-2 left-2 bg-white px-2 py-1 rounded-full shadow-md">
          <div className="flex items-center gap-1">
            <Star size={14} className="fill-yellow-400 text-yellow-400" />
            <span className="font-semibold text-sm">{restaurant.rating}</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        <div>
          <h3 className="font-bold text-foreground">{restaurant.name}</h3>
          <p className="text-xs text-muted-foreground">{restaurant.cuisineType.join(", ")}</p>
        </div>

        <p className="text-sm text-muted-foreground line-clamp-2">{restaurant.description}</p>

        {/* Info Grid */}
        <div className="flex gap-3 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <DollarSign size={12} />
            <span className="capitalize">{restaurant.priceRange}</span>
          </div>
          <div className="flex items-center gap-1">
            <Utensils size={12} />
            <span>₹{restaurant.avgCostPerPerson}</span>
          </div>
        </div>

        {/* Specialties */}
        <div className="flex flex-wrap gap-1">
          {restaurant.specialties.slice(0, 2).map((specialty) => (
            <span key={specialty} className="px-2 py-1 bg-accent/10 text-accent text-xs rounded">
              {specialty}
            </span>
          ))}
        </div>

        {/* Action Button */}
        <Button onClick={() => onSelect(restaurant)} className="w-full bg-primary hover:bg-primary/90" size="sm">
          View Details
        </Button>
      </div>
    </div>
  )
}
