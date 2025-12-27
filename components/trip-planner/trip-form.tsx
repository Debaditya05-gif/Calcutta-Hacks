"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Calendar, DollarSign } from "lucide-react"

interface TripFormProps {
  onCreateTrip: (trip: TripData) => void
}

export interface TripData {
  name: string
  startDate: string
  endDate: string
  budget: string
  description: string
}

export function TripForm({ onCreateTrip }: TripFormProps) {
  const [formData, setFormData] = useState<TripData>({
    name: "",
    startDate: "",
    endDate: "",
    budget: "",
    description: "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }))
    }
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) newErrors.name = "Trip name is required"
    if (!formData.startDate) newErrors.startDate = "Start date is required"
    if (!formData.endDate) newErrors.endDate = "End date is required"
    if (formData.startDate && formData.endDate && new Date(formData.startDate) > new Date(formData.endDate)) {
      newErrors.endDate = "End date must be after start date"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm()) {
      onCreateTrip(formData)
      setFormData({
        name: "",
        startDate: "",
        endDate: "",
        budget: "",
        description: "",
      })
    }
  }

  const calculateDays = (): number | null => {
    if (formData.startDate && formData.endDate) {
      const start = new Date(formData.startDate)
      const end = new Date(formData.endDate)
      return Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1
    }
    return null
  }

  const days = calculateDays()

  return (
    <div className="bg-card rounded-lg border border-border p-6 space-y-4">
      <h2 className="text-2xl font-bold text-foreground">Plan Your Trip</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Trip Name */}
        <div>
          <label className="block text-sm font-semibold mb-2 text-foreground">Trip Name</label>
          <Input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="e.g., Kolkata Heritage Tour"
            className={errors.name ? "border-red-500" : ""}
          />
          {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
        </div>

        {/* Dates */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold mb-2 text-foreground">Start Date</label>
            <div className="relative">
              <Calendar size={16} className="absolute left-2 top-3 text-muted-foreground pointer-events-none" />
              <Input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                className={`pl-8 ${errors.startDate ? "border-red-500" : ""}`}
              />
            </div>
            {errors.startDate && <p className="text-xs text-red-500 mt-1">{errors.startDate}</p>}
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2 text-foreground">End Date</label>
            <div className="relative">
              <Calendar size={16} className="absolute left-2 top-3 text-muted-foreground pointer-events-none" />
              <Input
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                className={`pl-8 ${errors.endDate ? "border-red-500" : ""}`}
              />
            </div>
            {errors.endDate && <p className="text-xs text-red-500 mt-1">{errors.endDate}</p>}
          </div>
        </div>

        {/* Days Info */}
        {days && (
          <div className="p-3 bg-primary/10 text-primary rounded-lg text-sm font-medium">
            {days} day{days > 1 ? "s" : ""} trip
          </div>
        )}

        {/* Budget */}
        <div>
          <label className="block text-sm font-semibold mb-2 text-foreground">Budget (Optional)</label>
          <div className="relative">
            <DollarSign size={16} className="absolute left-2 top-3 text-muted-foreground" />
            <Input
              type="number"
              name="budget"
              value={formData.budget}
              onChange={handleChange}
              placeholder="e.g., 5000"
              className="pl-8"
            />
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-semibold mb-2 text-foreground">Description (Optional)</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Add notes about your trip..."
            rows={3}
            className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <Button type="submit" className="w-full bg-primary hover:bg-primary/90">
          Create Trip Plan
        </Button>
      </form>
    </div>
  )
}
