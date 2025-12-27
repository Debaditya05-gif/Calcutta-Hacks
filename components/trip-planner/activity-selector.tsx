"use client"

import { useState } from "react"
import type { HeritageSite, Restaurant } from "@/lib/types"
import { mockHeritageSites, mockRestaurants } from "@/lib/mock-data"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Search, MapPin } from "lucide-react"

interface ActivitySelectorProps {
  date: string
  onSelectActivity: (site?: HeritageSite, restaurant?: Restaurant, cost?: number, notes?: string) => void
}

export function ActivitySelector({ date, onSelectActivity }: ActivitySelectorProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedItem, setSelectedItem] = useState<string | null>(null)
  const [cost, setCost] = useState("")
  const [notes, setNotes] = useState("")

  const filteredSites = mockHeritageSites.filter((site) => site.name.toLowerCase().includes(searchTerm.toLowerCase()))

  const filteredRestaurants = mockRestaurants.filter((restaurant) =>
    restaurant.name.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleSelectSite = (site: HeritageSite) => {
    onSelectActivity(site, undefined, cost ? Number.parseInt(cost) : site.entryFee, notes)
    setSelectedItem(null)
    setSearchTerm("")
    setCost("")
    setNotes("")
  }

  const handleSelectRestaurant = (restaurant: Restaurant) => {
    onSelectActivity(undefined, restaurant, cost ? Number.parseInt(cost) : restaurant.avgCostPerPerson, notes)
    setSelectedItem(null)
    setSearchTerm("")
    setCost("")
    setNotes("")
  }

  return (
    <div className="bg-card rounded-lg border border-border p-4 space-y-4">
      <h3 className="font-semibold text-foreground">Add Activity for {new Date(date).toDateString()}</h3>

      <Tabs defaultValue="sites" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="sites">Heritage Sites</TabsTrigger>
          <TabsTrigger value="restaurants">Restaurants</TabsTrigger>
        </TabsList>

        <TabsContent value="sites" className="space-y-3">
          <div className="relative">
            <Search size={16} className="absolute left-2 top-3 text-muted-foreground pointer-events-none" />
            <Input
              placeholder="Search heritage sites..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {filteredSites.map((site) => (
              <button
                key={site.id}
                onClick={() => handleSelectSite(site)}
                className="w-full text-left p-3 hover:bg-primary/10 rounded-lg border border-border transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-semibold text-foreground">{site.name}</p>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                      <MapPin size={12} />
                      <span>{site.category}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">₹{site.entryFee || "Free"}</p>
                    <p className="text-xs text-muted-foreground">⭐ {site.rating}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="restaurants" className="space-y-3">
          <div className="relative">
            <Search size={16} className="absolute left-2 top-3 text-muted-foreground pointer-events-none" />
            <Input
              placeholder="Search restaurants..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {filteredRestaurants.map((restaurant) => (
              <button
                key={restaurant.id}
                onClick={() => handleSelectRestaurant(restaurant)}
                className="w-full text-left p-3 hover:bg-accent/10 rounded-lg border border-border transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-semibold text-foreground">{restaurant.name}</p>
                    <p className="text-xs text-muted-foreground">{restaurant.cuisineType.join(", ")}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">₹{restaurant.avgCostPerPerson}</p>
                    <p className="text-xs text-muted-foreground">⭐ {restaurant.rating}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Cost & Notes */}
      <div className="space-y-3 border-t border-border pt-3">
        <input
          type="number"
          placeholder="Estimated cost (optional)"
          value={cost}
          onChange={(e) => setCost(e.target.value)}
          className="w-full px-3 py-2 border border-border rounded-lg bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
        />
        <textarea
          placeholder="Add notes..."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={2}
          className="w-full px-3 py-2 border border-border rounded-lg bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>
    </div>
  )
}
