"use client"

import { useEffect, useState } from "react"
import type { HeritageSite } from "@/lib/types"
import { Search, Star, Loader2 } from "lucide-react"
import { Input } from "@/components/ui/input"

interface ExplorerSidebarProps {
  onSiteSelect: (site: HeritageSite) => void
  selectedSite?: HeritageSite
}

export function ExplorerSidebar({ onSiteSelect, selectedSite }: ExplorerSidebarProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [sites, setSites] = useState<HeritageSite[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchSites()
  }, [])

  async function fetchSites() {
    setLoading(true)
    try {
      const res = await fetch("/api/heritage-sites?limit=50")
      if (res.ok) {
        const data = await res.json()
        setSites(data.sites || [])
      }
    } catch (error) {
      console.error("Failed to fetch sites:", error)
    } finally {
      setLoading(false)
    }
  }

  const filteredSites = sites.filter(
    (site) =>
      site.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      site.category.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="w-full h-full flex flex-col bg-background border-r border-border">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <h1 className="text-2xl font-bold text-foreground mb-3">Heritage Explorer</h1>
        <div className="relative">
          <Search size={18} className="absolute left-2 top-3 text-muted-foreground" />
          <Input
            placeholder="Search heritage sites..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
      </div>

      {/* Sites List */}
      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="animate-spin text-primary" />
          </div>
        ) : filteredSites.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            No sites found
          </div>
        ) : (
          filteredSites.map((site) => (
            <button
              key={site.id}
              onClick={() => onSiteSelect(site)}
              className={`w-full text-left p-3 border-b border-border transition-colors ${selectedSite?.id === site.id ? "bg-primary/10 border-l-4 border-l-primary" : "hover:bg-muted"
                }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground">{site.name}</h3>
                  <p className="text-xs text-muted-foreground">{site.category}</p>
                  <div className="flex items-center gap-1 mt-1">
                    <Star size={12} className="fill-yellow-400 text-yellow-400" />
                    <span className="text-xs font-medium">{site.rating || 0}</span>
                    <span className="text-xs text-muted-foreground">{site.visitCount || 0} visits</span>
                  </div>
                </div>
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  )
}
