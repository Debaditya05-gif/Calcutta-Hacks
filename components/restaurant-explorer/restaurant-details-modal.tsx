"use client"

import type { Restaurant } from "@/lib/types"
import { Star, MapPin, Clock, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { mockRestaurantReviews } from "@/lib/mock-data"

interface RestaurantDetailsModalProps {
  restaurant: Restaurant
  onClose: () => void
}

export function RestaurantDetailsModal({ restaurant, onClose }: RestaurantDetailsModalProps) {
  const reviews = mockRestaurantReviews.filter((r) => r.restaurantId === restaurant.id)

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-card rounded-lg shadow-xl max-w-2xl w-full max-h-96 overflow-y-auto border border-border animate-slide-up">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold text-foreground">{restaurant.name}</h2>
              <div className="flex items-center gap-2 mt-2">
                <Star size={18} className="fill-yellow-400 text-yellow-400" />
                <span className="font-bold text-lg">{restaurant.rating}</span>
                <span className="text-sm text-muted-foreground">({restaurant.reviewCount} reviews)</span>
              </div>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-muted rounded-lg transition" aria-label="Close">
              <X size={20} />
            </button>
          </div>

          {/* Description */}
          <p className="text-sm text-muted-foreground mb-4">{restaurant.description}</p>

          {/* Cuisine & Price */}
          <div className="flex gap-3 mb-4">
            <div className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
              {restaurant.cuisineType.join(", ")}
            </div>
            <div className="px-3 py-1 bg-accent/10 text-accent rounded-full text-sm capitalize">
              {restaurant.priceRange}
            </div>
          </div>

          {/* Info */}
          <div className="space-y-2 mb-6 pb-6 border-b border-border">
            <div className="flex items-center gap-2">
              <MapPin size={16} className="text-accent flex-shrink-0" />
              <p className="text-sm">{restaurant.address}</p>
            </div>
            <div className="flex items-center gap-2">
              <Clock size={16} className="text-accent flex-shrink-0" />
              <p className="text-sm">Open 11:00 AM - 10:00 PM</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold">Avg. Cost:</span>
              <span className="text-sm">₹{restaurant.avgCostPerPerson} per person</span>
            </div>
          </div>

          {/* Specialties */}
          <div className="mb-6">
            <h3 className="font-semibold text-foreground mb-2">Specialties</h3>
            <div className="flex flex-wrap gap-2">
              {restaurant.specialties.map((specialty) => (
                <span key={specialty} className="px-3 py-1 bg-muted text-foreground text-sm rounded">
                  {specialty}
                </span>
              ))}
            </div>
          </div>

          {/* Reviews */}
          {reviews.length > 0 && (
            <div className="mb-6">
              <h3 className="font-semibold text-foreground mb-3">Recent Reviews</h3>
              <div className="space-y-3">
                {reviews.map((review) => (
                  <div key={review.id} className="p-3 bg-muted/50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-sm">{review.userName}</span>
                      <div className="flex items-center gap-1">
                        {Array.from({ length: review.rating }).map((_, i) => (
                          <Star key={i} size={12} className="fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{review.text}</p>
                    <div className="flex flex-wrap gap-1">
                      {review.dishesTried.map((dish) => (
                        <span key={dish} className="px-2 py-0.5 bg-accent/20 text-accent text-xs rounded">
                          {dish}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-2">
            <Button className="flex-1 bg-primary hover:bg-primary/90">Reserve a Table</Button>
            <Button className="flex-1 bg-accent hover:bg-accent/90">Get Directions</Button>
          </div>
        </div>
      </div>
    </div>
  )
}
