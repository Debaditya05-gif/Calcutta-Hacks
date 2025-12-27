"use client"

import { useState } from "react"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { ChevronDown } from "lucide-react"

interface MatchFiltersProps {
  onFiltersChange: (filters: MatchFilterState) => void
}

export interface MatchFilterState {
  ageRange: [number, number]
  genders: string[]
  interests: string[]
  travelStyles: string[]
  minCompatibility: number
}

export function MatchFilters({ onFiltersChange }: MatchFiltersProps) {
  const [filters, setFilters] = useState<MatchFilterState>({
    ageRange: [18, 50],
    genders: ["Female", "Male", "Other"],
    interests: ["Heritage", "Photography", "Food", "Adventure", "Culture"],
    travelStyles: ["cultural", "adventurous", "luxury"],
    minCompatibility: 0,
  })
  const [expandedSections, setExpandedSections] = useState({
    age: true,
    gender: true,
    interests: false,
    style: true,
  })

  const handleAgeChange = (value: [number, number]) => {
    const newFilters = { ...filters, ageRange: value }
    setFilters(newFilters)
    onFiltersChange(newFilters)
  }

  const handleGenderChange = (gender: string) => {
    const updated = filters.genders.includes(gender)
      ? filters.genders.filter((g) => g !== gender)
      : [...filters.genders, gender]
    const newFilters = { ...filters, genders: updated }
    setFilters(newFilters)
    onFiltersChange(newFilters)
  }

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }))
  }

  return (
    <div className="w-full bg-card rounded-lg border border-border p-4 space-y-4">
      {/* Age Range */}
      <div className="border-b border-border pb-4">
        <button
          onClick={() => toggleSection("age")}
          className="w-full flex items-center justify-between hover:text-primary transition"
        >
          <h3 className="font-semibold text-foreground">Age Range</h3>
          <ChevronDown size={18} className={expandedSections.age ? "rotate-180" : ""} />
        </button>
        {expandedSections.age && (
          <div className="mt-3 space-y-3">
            <Slider
              value={filters.ageRange}
              onValueChange={(value) => handleAgeChange(value as [number, number])}
              min={18}
              max={80}
              step={1}
            />
            <p className="text-sm text-muted-foreground">
              {filters.ageRange[0]} - {filters.ageRange[1]} years
            </p>
          </div>
        )}
      </div>

      {/* Gender */}
      <div className="border-b border-border pb-4">
        <button
          onClick={() => toggleSection("gender")}
          className="w-full flex items-center justify-between hover:text-primary transition"
        >
          <h3 className="font-semibold text-foreground">Gender</h3>
          <ChevronDown size={18} className={expandedSections.gender ? "rotate-180" : ""} />
        </button>
        {expandedSections.gender && (
          <div className="space-y-2 mt-3">
            {["Female", "Male", "Other"].map((gender) => (
              <label key={gender} className="flex items-center gap-2 cursor-pointer">
                <Checkbox
                  checked={filters.genders.includes(gender)}
                  onCheckedChange={() => handleGenderChange(gender)}
                />
                <span className="text-sm">{gender}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Travel Style */}
      <div className="border-b border-border pb-4">
        <button
          onClick={() => toggleSection("style")}
          className="w-full flex items-center justify-between hover:text-primary transition"
        >
          <h3 className="font-semibold text-foreground">Travel Style</h3>
          <ChevronDown size={18} className={expandedSections.style ? "rotate-180" : ""} />
        </button>
        {expandedSections.style && (
          <div className="space-y-2 mt-3">
            {["Cultural", "Adventurous", "Luxury"].map((style) => (
              <label key={style} className="flex items-center gap-2 cursor-pointer">
                <Checkbox
                  checked={filters.travelStyles.includes(style.toLowerCase())}
                  onCheckedChange={() => {
                    const updated = filters.travelStyles.includes(style.toLowerCase())
                      ? filters.travelStyles.filter((s) => s !== style.toLowerCase())
                      : [...filters.travelStyles, style.toLowerCase()]
                    const newFilters = { ...filters, travelStyles: updated }
                    setFilters(newFilters)
                    onFiltersChange(newFilters)
                  }}
                />
                <span className="text-sm">{style}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Min Compatibility */}
      <div>
        <label className="flex items-center gap-2 cursor-pointer">
          <Checkbox
            checked={filters.minCompatibility > 0}
            onCheckedChange={(checked) => {
              const newFilters = { ...filters, minCompatibility: checked ? 75 : 0 }
              setFilters(newFilters)
              onFiltersChange(newFilters)
            }}
          />
          <span className="text-sm">75%+ Compatibility Only</span>
        </label>
      </div>
    </div>
  )
}
