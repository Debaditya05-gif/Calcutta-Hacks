"use client"

import type { HeritageSite } from "@/lib/types"
import { Star, MapPin, Clock, DollarSign, Heart } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"

interface SiteDetailsCardProps {
  site: HeritageSite
  onClose: () => void
  onViewRestaurants: () => void
}

export function SiteDetailsCard({ site, onClose, onViewRestaurants }: SiteDetailsCardProps) {
  const [isFavorited, setIsFavorited] = useState(false)

  return (
    <div className="animate-slide-up bg-card rounded-xl shadow-lg overflow-hidden border border-border max-h-96 overflow-y-auto">
      {/* Header Image */}
      <div className="relative h-48 bg-gradient-to-b from-primary/20 to-accent/20">
        <img src={site.imageUrl || "/placeholder.svg"} alt={site.name} className="w-full h-full object-cover" />
        <button
          onClick={() => setIsFavorited(!isFavorited)}
          className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-md hover:bg-opacity-90 transition"
        >
          <Heart size={20} className={isFavorited ? "fill-red-500 text-red-500" : ""} />
        </button>
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        {/* Title and Rating */}
        <div>
          <h2 className="text-2xl font-bold text-foreground">{site.name}</h2>
          <div className="flex items-center gap-2 mt-1">
            <div className="flex items-center gap-1">
              <Star size={16} className="fill-yellow-400 text-yellow-400" />
              <span className="font-semibold">{site.rating}</span>
            </div>
            <span className="text-sm text-muted-foreground">({site.visitCount.toLocaleString()} visits)</span>
          </div>
        </div>

        {/* Category */}
        <div>
          <span className="inline-block px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
            {site.category}
          </span>
        </div>

        {/* Description */}
        <p className="text-sm text-foreground">{site.description}</p>

        {/* Info Grid */}
        <div className="grid grid-cols-2 gap-3 py-3 border-t border-b border-border">
          {site.entryFee !== undefined && (
            <div className="flex items-start gap-2">
              <DollarSign size={18} className="text-accent mt-0.5" />
              <div>
                <p className="text-xs text-muted-foreground">Entry Fee</p>
                <p className="font-semibold">₹{site.entryFee}</p>
              </div>
            </div>
          )}
          {site.openingHours && (
            <div className="flex items-start gap-2">
              <Clock size={18} className="text-accent mt-0.5" />
              <div>
                <p className="text-xs text-muted-foreground">Hours</p>
                <p className="font-semibold text-sm">{site.openingHours}</p>
              </div>
            </div>
          )}
        </div>

        {/* Additional Info */}
        {site.bestTimeToVisit && (
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase">Best Time to Visit</p>
            <p className="text-sm">{site.bestTimeToVisit}</p>
          </div>
        )}

        {site.historicalSignificance && (
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase">Historical Significance</p>
            <p className="text-sm">{site.historicalSignificance}</p>
          </div>
        )}

        {/* Address */}
        <div className="flex gap-2 text-sm">
          <MapPin size={16} className="text-accent flex-shrink-0 mt-0.5" />
          <p>{site.address}</p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-3">
          <Button onClick={onViewRestaurants} className="flex-1 bg-primary hover:bg-primary/90">
            View Nearby Restaurants
          </Button>
          <Button onClick={onClose} variant="outline" className="flex-1 bg-transparent">
            Close
          </Button>
        </div>
      </div>
    </div>
  )
}
