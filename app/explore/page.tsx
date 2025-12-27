"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import type { HeritageSite } from "@/lib/types"
import { MapView } from "@/components/heritage-explorer/map-view"
import { SiteDetailsCard } from "@/components/heritage-explorer/site-details-card"
import { ExplorerSidebar } from "@/components/heritage-explorer/explorer-sidebar"
import { RestaurantListView } from "@/components/restaurant-explorer/restaurant-list-view"

interface InitialMapCenter {
  lat: number
  lng: number
  zoom: number
}

export default function ExplorePage() {
  const searchParams = useSearchParams()
  const [selectedSite, setSelectedSite] = useState<HeritageSite | null>(null)
  const [showRestaurants, setShowRestaurants] = useState(false)
  const [initialCenter, setInitialCenter] = useState<InitialMapCenter | null>(null)

  // Check for URL parameters to center the map
  useEffect(() => {
    const lat = searchParams.get("lat")
    const lng = searchParams.get("lng")
    const zoom = searchParams.get("zoom")

    if (lat && lng) {
      setInitialCenter({
        lat: parseFloat(lat),
        lng: parseFloat(lng),
        zoom: zoom ? parseInt(zoom) : 15
      })
    }
  }, [searchParams])

  return (
    <div className="min-h-screen bg-background">
      <div className="h-screen flex">
        {/* Sidebar */}
        <div className="w-80 max-h-screen overflow-hidden border-r border-border">
          <ExplorerSidebar onSiteSelect={setSelectedSite} selectedSite={selectedSite || undefined} />
        </div>

        {/* Map Area */}
        <div className="flex-1 relative">
          <MapView
            onSiteSelect={setSelectedSite}
            selectedSite={selectedSite || undefined}
            initialCenter={initialCenter || undefined}
          />

          {/* Floating Details Card */}
          {selectedSite && !showRestaurants && (
            <div className="absolute bottom-6 right-6 w-96 z-50">
              <SiteDetailsCard
                site={selectedSite}
                onClose={() => setSelectedSite(null)}
                onViewRestaurants={() => setShowRestaurants(true)}
              />
            </div>
          )}

          {/* Restaurants View */}
          {selectedSite && showRestaurants && (
            <div className="absolute bottom-6 right-6 w-96 z-50">
              <RestaurantListView heritageSite={selectedSite} onBack={() => setShowRestaurants(false)} />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

