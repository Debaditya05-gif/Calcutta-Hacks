"use client"

import type { HeritageSite, Restaurant } from "@/lib/types"
import { MapPin, DollarSign, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ItineraryItemProps {
  index: number
  date: string
  site?: HeritageSite
  restaurant?: Restaurant
  estimatedCost?: number
  notes?: string
  onRemove: () => void
  onEdit: () => void
}

export function ItineraryItem({
  index,
  date,
  site,
  restaurant,
  estimatedCost,
  notes,
  onRemove,
  onEdit,
}: ItineraryItemProps) {
  const item = site || restaurant
  const isRestaurant = !!restaurant
  const dateObj = new Date(date)
  const dayName = dateObj.toLocaleDateString("en-US", { weekday: "short" })

  return (
    <div className="animate-slide-up bg-card border border-border rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex gap-4">
        {/* Day Badge */}
        <div className="flex flex-col items-center justify-start pt-1 min-w-fit">
          <div className="w-12 h-12 bg-primary/10 rounded-lg flex flex-col items-center justify-center">
            <p className="text-xs font-semibold text-primary">{dayName}</p>
            <p className="text-sm font-bold text-primary">{dateObj.getDate()}</p>
          </div>
          {index < 4 && <div className="w-0.5 h-8 bg-border mt-2" />}
        </div>

        {/* Content */}
        <div className="flex-1 pt-1">
          {item && (
            <div>
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h4 className="font-semibold text-foreground">{item.name}</h4>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                    <MapPin size={12} />
                    <span>{item.address}</span>
                  </div>
                </div>
                <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded font-medium">
                  {isRestaurant ? "Restaurant" : "Heritage"}
                </span>
              </div>

              {/* Cost & Details */}
              <div className="flex gap-4 mt-3 text-sm">
                {estimatedCost && (
                  <div className="flex items-center gap-1">
                    <DollarSign size={14} className="text-accent" />
                    <span>₹{estimatedCost}</span>
                  </div>
                )}
                {site?.rating && (
                  <div className="text-accent">
                    ⭐ {site.rating} ({site.visitCount} visits)
                  </div>
                )}
              </div>

              {notes && <p className="text-sm text-muted-foreground mt-2">{notes}</p>}
            </div>
          )}

          {!item && notes && (
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
              <div className="flex items-center justify-between mb-2">
                <span className="px-2 py-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs rounded font-medium">
                  ✨ AI Generated
                </span>
                {estimatedCost && (
                  <div className="flex items-center gap-1 text-sm font-semibold text-purple-700">
                    <DollarSign size={14} />
                    <span>₹{estimatedCost}</span>
                  </div>
                )}
              </div>
              <div className="text-sm text-purple-900 whitespace-pre-line">
                {notes}
              </div>
            </div>
          )}

          {!item && !notes && (
            <div className="text-muted-foreground text-sm py-2">
              <p>Day {index + 1}: No activities planned</p>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-1">
          <Button onClick={onEdit} size="sm" variant="ghost" className="text-muted-foreground hover:text-primary">
            Edit
          </Button>
          <Button onClick={onRemove} size="sm" variant="ghost" className="text-destructive hover:bg-destructive/10">
            <Trash2 size={16} />
          </Button>
        </div>
      </div>
    </div>
  )
}
