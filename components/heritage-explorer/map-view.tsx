"use client"

import { useState, useEffect } from "react"
import type { HeritageSite } from "@/lib/types"
import { MapPin } from "lucide-react"

interface InitialMapCenter {
  lat: number
  lng: number
  zoom: number
}

interface MapViewProps {
  onSiteSelect: (site: HeritageSite) => void
  selectedSite?: HeritageSite
  initialCenter?: InitialMapCenter
}

export function MapView({ onSiteSelect, selectedSite, initialCenter }: MapViewProps) {
  const [sites, setSites] = useState<HeritageSite[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  async function fetchData() {
    setLoading(true)
    try {
      const res = await fetch("/api/heritage-sites?limit=50")
      if (res.ok) {
        const data = await res.json()
        setSites(data.sites || [])
      }
    } catch (error) {
      console.error("Failed to fetch data:", error)
    } finally {
      setLoading(false)
    }
  }

  // Get center coordinates based on: 1) initialCenter, 2) selected site, 3) default Kolkata center
  const centerLat = initialCenter?.lat || selectedSite?.latitude || 22.5726
  const centerLng = initialCenter?.lng || selectedSite?.longitude || 88.3639
  const zoom = initialCenter?.zoom || (selectedSite ? 15 : 12)

  // Create markers query for all sites
  const markersQuery = sites
    .filter(s => s.latitude && s.longitude)
    .map(s => `${s.latitude},${s.longitude}`)
    .join("|")

  if (loading) {
    return (
      <div className="h-full w-full bg-gradient-to-br from-amber-50 to-orange-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
          <p className="text-foreground">Loading map...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="relative w-full h-full">
      {/* OpenStreetMap iframe */}
      <iframe
        title="Heritage Sites Map"
        width="100%"
        height="100%"
        frameBorder="0"
        scrolling="no"
        src={`https://www.openstreetmap.org/export/embed.html?bbox=${centerLng - 0.1}%2C${centerLat - 0.08}%2C${centerLng + 0.1}%2C${centerLat + 0.08}&layer=mapnik&marker=${centerLat}%2C${centerLng}`}
        style={{ border: 0 }}
      />

      {/* Overlay with site markers */}
      <div className="absolute top-4 right-4 bg-white rounded-lg shadow-lg p-3 max-h-80 overflow-y-auto z-10">
        <h3 className="font-bold text-gray-800 mb-2 text-sm">Heritage Sites</h3>
        <div className="space-y-1">
          {sites.slice(0, 10).map((site) => (
            <button
              key={site.id}
              onClick={() => onSiteSelect(site)}
              className={`w-full text-left px-2 py-1 rounded text-xs flex items-center gap-2 transition-colors ${selectedSite?.id === site.id
                ? "bg-orange-100 text-orange-700"
                : "hover:bg-gray-100 text-gray-600"
                }`}
            >
              <MapPin size={12} className="text-orange-500 flex-shrink-0" />
              <span className="truncate">{site.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-lg p-3 z-10">
        <div className="flex items-center gap-2 text-xs text-gray-600">
          <div className="w-3 h-3 bg-orange-500 rounded-full" />
          <span>{sites.length} Heritage Sites</span>
        </div>
      </div>
    </div>
  )
}
