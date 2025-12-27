"use client"

import { useState } from "react"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { ChevronDown } from "lucide-react"
import { mockDishes } from "@/lib/mock-data"

interface RestaurantFiltersProps {
  onFiltersChange: (filters: RestaurantFilterState) => void
}

export interface RestaurantFilterState {
  priceRange: string[]
  cuisines: string[]
  minRating: number
  selectedDishes: string[]
}

export function RestaurantFilters({ onFiltersChange }: RestaurantFiltersProps) {
  const [filters, setFilters] = useState<RestaurantFilterState>({
    priceRange: ["budget", "moderate", "luxury"],
    cuisines: ["Bengali", "Indian", "Continental", "Bakery"],
    minRating: 0,
    selectedDishes: [],
  })
  const [expandedSections, setExpandedSections] = useState({
    price: true,
    cuisine: true,
    rating: true,
    dishes: false,
  })

  const handlePriceChange = (price: string) => {
    const updated = filters.priceRange.includes(price)
      ? filters.priceRange.filter((p) => p !== price)
      : [...filters.priceRange, price]
    const newFilters = { ...filters, priceRange: updated }
    setFilters(newFilters)
    onFiltersChange(newFilters)
  }

  const handleCuisineChange = (cuisine: string) => {
    const updated = filters.cuisines.includes(cuisine)
      ? filters.cuisines.filter((c) => c !== cuisine)
      : [...filters.cuisines, cuisine]
    const newFilters = { ...filters, cuisines: updated }
    setFilters(newFilters)
    onFiltersChange(newFilters)
  }

  const handleDishChange = (dish: string) => {
    const updated = filters.selectedDishes.includes(dish)
      ? filters.selectedDishes.filter((d) => d !== dish)
      : [...filters.selectedDishes, dish]
    const newFilters = { ...filters, selectedDishes: updated }
    setFilters(newFilters)
    onFiltersChange(newFilters)
  }

  const handleRatingChange = (value: number[]) => {
    const newFilters = { ...filters, minRating: value[0] }
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
      {/* Price Range */}
      <div className="border-b border-border pb-4">
        <button
          onClick={() => toggleSection("price")}
          className="w-full flex items-center justify-between hover:text-primary transition"
        >
          <h3 className="font-semibold text-foreground">Price Range</h3>
          <ChevronDown size={18} className={expandedSections.price ? "rotate-180" : ""} />
        </button>
        {expandedSections.price && (
          <div className="space-y-2 mt-3">
            {["budget", "moderate", "luxury"].map((price) => (
              <label key={price} className="flex items-center gap-2 cursor-pointer">
                <Checkbox
                  checked={filters.priceRange.includes(price)}
                  onCheckedChange={() => handlePriceChange(price)}
                />
                <span className="text-sm capitalize">{price}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Cuisine Type */}
      <div className="border-b border-border pb-4">
        <button
          onClick={() => toggleSection("cuisine")}
          className="w-full flex items-center justify-between hover:text-primary transition"
        >
          <h3 className="font-semibold text-foreground">Cuisine Type</h3>
          <ChevronDown size={18} className={expandedSections.cuisine ? "rotate-180" : ""} />
        </button>
        {expandedSections.cuisine && (
          <div className="space-y-2 mt-3">
            {["Bengali", "Indian", "Continental", "Bakery", "Tea", "Multi-cuisine"].map((cuisine) => (
              <label key={cuisine} className="flex items-center gap-2 cursor-pointer">
                <Checkbox
                  checked={filters.cuisines.includes(cuisine)}
                  onCheckedChange={() => handleCuisineChange(cuisine)}
                />
                <span className="text-sm">{cuisine}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Minimum Rating */}
      <div className="border-b border-border pb-4">
        <button
          onClick={() => toggleSection("rating")}
          className="w-full flex items-center justify-between hover:text-primary transition"
        >
          <h3 className="font-semibold text-foreground">Minimum Rating</h3>
          <ChevronDown size={18} className={expandedSections.rating ? "rotate-180" : ""} />
        </button>
        {expandedSections.rating && (
          <div className="mt-3 space-y-2">
            <Slider value={[filters.minRating]} onValueChange={handleRatingChange} min={0} max={5} step={0.5} />
            <p className="text-sm text-muted-foreground">
              {filters.minRating > 0 ? `${filters.minRating}+ stars` : "Any rating"}
            </p>
          </div>
        )}
      </div>

      {/* Dishes */}
      <div>
        <button
          onClick={() => toggleSection("dishes")}
          className="w-full flex items-center justify-between hover:text-primary transition"
        >
          <h3 className="font-semibold text-foreground">Filter by Dishes</h3>
          <ChevronDown size={18} className={expandedSections.dishes ? "rotate-180" : ""} />
        </button>
        {expandedSections.dishes && (
          <div className="space-y-2 mt-3 max-h-40 overflow-y-auto">
            {mockDishes.map((dish) => (
              <label key={dish} className="flex items-center gap-2 cursor-pointer">
                <Checkbox
                  checked={filters.selectedDishes.includes(dish)}
                  onCheckedChange={() => handleDishChange(dish)}
                />
                <span className="text-sm">{dish}</span>
              </label>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
