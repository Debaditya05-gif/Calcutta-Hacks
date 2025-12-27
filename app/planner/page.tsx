"use client"

import { useState } from "react"
import type { TripData } from "@/components/trip-planner/trip-form"
import { TripForm } from "@/components/trip-planner/trip-form"
import { ItineraryItem } from "@/components/trip-planner/itinerary-item"
import { ActivitySelector } from "@/components/trip-planner/activity-selector"
import { AISuggestion } from "@/components/trip-planner/ai-suggestion"
import type { HeritageSite, Restaurant } from "@/lib/types"
import { Calendar, DollarSign, Download } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { jsPDF } from "jspdf"

interface PlanItem {
  date: string
  site?: HeritageSite
  restaurant?: Restaurant
  estimatedCost?: number
  notes?: string
}

export default function PlannerPage() {
  const [trip, setTrip] = useState<TripData | null>(null)
  const [itinerary, setItinerary] = useState<PlanItem[]>([])
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [totalCost, setTotalCost] = useState(0)

  const handleCreateTrip = (tripData: TripData) => {
    setTrip(tripData)

    // Create empty itinerary for each day
    const start = new Date(tripData.startDate)
    const end = new Date(tripData.endDate)
    const days: PlanItem[] = []

    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      days.push({ date: d.toISOString().split("T")[0] })
    }

    setItinerary(days)
  }

  const handleAddActivity = (
    date: string,
    site?: HeritageSite,
    restaurant?: Restaurant,
    cost?: number,
    notes?: string,
  ) => {
    setItinerary((prev) =>
      prev.map((item) => (item.date === date ? { ...item, site, restaurant, estimatedCost: cost, notes } : item)),
    )
    setSelectedDate(null)

    // Recalculate total cost
    const total = itinerary.reduce((sum, item) => sum + (item.estimatedCost || 0), 0) + (cost || 0)
    setTotalCost(total)
  }

  const handleRemoveActivity = (date: string) => {
    setItinerary((prev) => prev.map((item) => (item.date === date ? { date: item.date } : item)))
  }

  // Handle applying AI-generated itinerary
  interface AIActivity {
    time: string
    type: string
    name: string
    description: string
    estimatedCost: number
    duration: string
  }

  interface AIDay {
    day: number
    theme: string
    activities: AIActivity[]
  }

  interface AIItinerary {
    tripName: string
    days: AIDay[]
    totalEstimatedCost: number
    tips: string[]
  }

  const handleApplyAIItinerary = (aiItinerary: AIItinerary) => {
    if (!trip || !aiItinerary.days) return

    const newItinerary = itinerary.map((item, index) => {
      const aiDay = aiItinerary.days[index]
      if (!aiDay || !aiDay.activities) return item

      // Combine all activities into notes
      const activitiesText = aiDay.activities
        .map(a => `${a.time} - ${a.name}: ${a.description} (${a.duration}, ₹${a.estimatedCost})`)
        .join('\n')

      // Calculate total cost for the day
      const dayCost = aiDay.activities.reduce((sum, a) => sum + (a.estimatedCost || 0), 0)

      return {
        ...item,
        notes: `🎯 ${aiDay.theme}\n\n${activitiesText}`,
        estimatedCost: dayCost,
      }
    })

    setItinerary(newItinerary)

    // Update total cost
    const newTotal = newItinerary.reduce((sum, item) => sum + (item.estimatedCost || 0), 0)
    setTotalCost(newTotal)

    // Show confirmation
    alert(`✅ AI Itinerary Applied!\n\n${aiItinerary.days.length} days of activities have been added to your trip.\n\nTotal Estimated Cost: ₹${aiItinerary.totalEstimatedCost}`)
  }

  // PDF Download Function
  const handleSaveTrip = () => {
    if (!trip) return

    const doc = new jsPDF()
    const pageWidth = doc.internal.pageSize.getWidth()
    const pageHeight = doc.internal.pageSize.getHeight()
    let yPos = 0

    // === HEADER BANNER ===
    doc.setFillColor(180, 83, 9) // Primary orange
    doc.rect(0, 0, pageWidth, 45, 'F')

    // Logo/Title
    doc.setFontSize(28)
    doc.setTextColor(255, 255, 255)
    doc.setFont('helvetica', 'bold')
    doc.text('KOLKATA EXPLORER', pageWidth / 2, 20, { align: 'center' })

    doc.setFontSize(12)
    doc.setFont('helvetica', 'normal')
    doc.text('Your Heritage Trip Itinerary', pageWidth / 2, 32, { align: 'center' })

    yPos = 55

    // === TRIP NAME ===
    doc.setFontSize(22)
    doc.setTextColor(40, 40, 40)
    doc.setFont('helvetica', 'bold')
    doc.text(trip.name, pageWidth / 2, yPos, { align: 'center' })
    yPos += 15

    // === TRIP INFO CARDS ===
    const cardWidth = (pageWidth - 50) / 2
    const cardHeight = 35

    // Left Card - Dates
    doc.setFillColor(254, 243, 199) // Light yellow
    doc.roundedRect(15, yPos, cardWidth, cardHeight, 4, 4, 'F')
    doc.setFillColor(234, 88, 12) // Orange circle
    doc.circle(30, yPos + cardHeight / 2, 8, 'F')
    doc.setTextColor(255, 255, 255)
    doc.setFontSize(12)
    doc.text('📅', 26, yPos + cardHeight / 2 + 4)

    doc.setTextColor(100, 100, 100)
    doc.setFontSize(9)
    doc.setFont('helvetica', 'normal')
    doc.text('TRAVEL DATES', 45, yPos + 12)
    doc.setTextColor(40, 40, 40)
    doc.setFontSize(11)
    doc.setFont('helvetica', 'bold')
    doc.text(`${new Date(trip.startDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })} - ${new Date(trip.endDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}`, 45, yPos + 24)

    // Right Card - Budget
    doc.setFillColor(220, 252, 231) // Light green
    doc.roundedRect(25 + cardWidth, yPos, cardWidth, cardHeight, 4, 4, 'F')
    doc.setFillColor(22, 163, 74) // Green circle
    doc.circle(40 + cardWidth, yPos + cardHeight / 2, 8, 'F')
    doc.setTextColor(255, 255, 255)
    doc.setFontSize(12)
    doc.text('💰', 36 + cardWidth, yPos + cardHeight / 2 + 4)

    doc.setTextColor(100, 100, 100)
    doc.setFontSize(9)
    doc.setFont('helvetica', 'normal')
    doc.text('BUDGET & COST', 55 + cardWidth, yPos + 12)
    doc.setTextColor(40, 40, 40)
    doc.setFontSize(11)
    doc.setFont('helvetica', 'bold')
    doc.text(`Budget: ₹${trip.budget || 'Flexible'}  |  Est: ₹${totalCost}`, 55 + cardWidth, yPos + 24)

    yPos += cardHeight + 15

    // === QUICK STATS BAR ===
    doc.setFillColor(243, 244, 246) // Light gray
    doc.roundedRect(15, yPos, pageWidth - 30, 20, 3, 3, 'F')

    const statsY = yPos + 13
    doc.setFontSize(10)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(100, 100, 100)

    const plannedDays = itinerary.filter(i => i.site || i.restaurant || i.notes).length
    doc.text(`📊 ${itinerary.length} Days`, 25, statsY)
    doc.text(`✅ ${plannedDays} Planned`, 70, statsY)
    doc.text(`🏛️ Heritage Sites`, 115, statsY)
    doc.text(`🍽️ Restaurants`, 160, statsY)

    yPos += 30

    // === ITINERARY SECTION HEADER ===
    doc.setFillColor(180, 83, 9)
    doc.roundedRect(15, yPos, pageWidth - 30, 12, 2, 2, 'F')
    doc.setTextColor(255, 255, 255)
    doc.setFontSize(12)
    doc.setFont('helvetica', 'bold')
    doc.text('DAY-BY-DAY ITINERARY', 20, yPos + 8)
    yPos += 20

    // === DAYS ===
    itinerary.forEach((item, index) => {
      // Check if we need a new page
      if (yPos > pageHeight - 50) {
        doc.addPage()
        yPos = 20
      }

      const date = new Date(item.date)
      const dayName = date.toLocaleDateString('en-US', { weekday: 'long' })
      const dateStr = date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })

      // Day container
      doc.setFillColor(255, 251, 235) // Very light orange
      doc.setDrawColor(253, 186, 116) // Orange border

      // Calculate height based on content
      let contentHeight = 25
      if (item.notes) {
        const lines = doc.splitTextToSize(item.notes.replace(/[🎯]/g, '●'), pageWidth - 50)
        contentHeight += lines.length * 4
      } else if (item.site || item.restaurant) {
        contentHeight += 10
      } else {
        contentHeight += 5
      }

      doc.roundedRect(15, yPos, pageWidth - 30, Math.max(contentHeight, 30), 3, 3, 'FD')

      // Day badge
      doc.setFillColor(234, 88, 12)
      doc.roundedRect(20, yPos + 5, 35, 18, 2, 2, 'F')
      doc.setTextColor(255, 255, 255)
      doc.setFontSize(9)
      doc.setFont('helvetica', 'bold')
      doc.text(`DAY ${index + 1}`, 24, yPos + 16)

      // Date info
      doc.setTextColor(40, 40, 40)
      doc.setFontSize(11)
      doc.setFont('helvetica', 'bold')
      doc.text(dayName, 60, yPos + 13)
      doc.setTextColor(100, 100, 100)
      doc.setFontSize(9)
      doc.setFont('helvetica', 'normal')
      doc.text(dateStr, 60, yPos + 20)

      // Cost badge (if any)
      if (item.estimatedCost) {
        doc.setFillColor(22, 163, 74)
        doc.roundedRect(pageWidth - 55, yPos + 5, 35, 15, 2, 2, 'F')
        doc.setTextColor(255, 255, 255)
        doc.setFontSize(9)
        doc.setFont('helvetica', 'bold')
        doc.text(`₹${item.estimatedCost}`, pageWidth - 50, yPos + 15)
      }

      let currentContentY = yPos + 28

      // Activities content
      if (item.notes) {
        doc.setFontSize(8)
        doc.setTextColor(60, 60, 60)
        doc.setFont('helvetica', 'normal')
        const lines: string[] = doc.splitTextToSize(item.notes.replace(/[🎯]/g, '●'), pageWidth - 50)
        lines.forEach((line: string) => {
          if (currentContentY > pageHeight - 30) {
            doc.addPage()
            currentContentY = 20
          }
          if (line.trim()) {
            doc.text(line, 25, currentContentY)
            currentContentY += 4
          }
        })
      } else if (item.site) {
        doc.setTextColor(40, 40, 40)
        doc.setFontSize(10)
        doc.setFont('helvetica', 'bold')
        doc.text(`Heritage: ${item.site.name}`, 25, currentContentY)
        currentContentY += 5
      } else if (item.restaurant) {
        doc.setTextColor(40, 40, 40)
        doc.setFontSize(10)
        doc.setFont('helvetica', 'bold')
        doc.text(`Restaurant: ${item.restaurant.name}`, 25, currentContentY)
        currentContentY += 5
      } else {
        doc.setTextColor(150, 150, 150)
        doc.setFontSize(9)
        doc.text('No activities planned yet', 25, currentContentY)
        currentContentY += 5
      }

      yPos = currentContentY + 10
    })

    // === FOOTER ===
    // Add new page if needed for footer
    if (yPos > pageHeight - 40) {
      doc.addPage()
      yPos = pageHeight - 40
    } else {
      yPos = pageHeight - 35
    }

    doc.setFillColor(40, 40, 40)
    doc.rect(0, yPos, pageWidth, 40, 'F')

    doc.setTextColor(255, 255, 255)
    doc.setFontSize(10)
    doc.setFont('helvetica', 'bold')
    doc.text('Kolkata Explorer', pageWidth / 2, yPos + 12, { align: 'center' })

    doc.setFontSize(8)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(200, 200, 200)
    doc.text('Discover the City of Joy - Heritage, Culture & Cuisine', pageWidth / 2, yPos + 20, { align: 'center' })
    doc.text(`Generated on ${new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}`, pageWidth / 2, yPos + 28, { align: 'center' })

    // Download
    doc.save(`${trip.name.replace(/\s+/g, '_')}_Itinerary.pdf`)
  }

  const costPerDay = trip
    ? Math.floor(
      Number.parseInt(trip.budget || "0") /
      Math.ceil((new Date(trip.endDate).getTime() - new Date(trip.startDate).getTime()) / (1000 * 60 * 60 * 24)),
    )
    : 0

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b border-border sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <Link href="/" className="flex items-center gap-2 mb-2 w-fit hover:text-primary transition">
            <span className="text-sm text-muted-foreground">← Back to Home</span>
          </Link>
          <h1 className="text-3xl font-bold text-foreground">Trip Planner</h1>
          <p className="text-muted-foreground">Build your perfect Kolkata itinerary</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {!trip ? (
          <div className="max-w-xl mx-auto">
            <TripForm onCreateTrip={handleCreateTrip} />
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Itinerary */}
            <div className="lg:col-span-2 space-y-4">
              {/* Trip Header */}
              <div className="bg-gradient-to-r from-primary/20 to-accent/20 rounded-lg p-6 border border-primary/20">
                <h2 className="text-2xl font-bold text-foreground mb-4">{trip.name}</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <Calendar size={20} className="text-primary" />
                    <div>
                      <p className="text-xs text-muted-foreground">Duration</p>
                      <p className="font-semibold">
                        {new Date(trip.startDate).toLocaleDateString()} - {new Date(trip.endDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  {trip.budget && (
                    <div className="flex items-center gap-2">
                      <DollarSign size={20} className="text-accent" />
                      <div>
                        <p className="text-xs text-muted-foreground">Budget</p>
                        <p className="font-semibold">₹{trip.budget}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Itinerary Timeline */}
              <div className="space-y-3">
                {itinerary.map((item, index) => (
                  <div key={item.date}>
                    <ItineraryItem
                      index={index}
                      date={item.date}
                      site={item.site}
                      restaurant={item.restaurant}
                      estimatedCost={item.estimatedCost}
                      notes={item.notes}
                      onRemove={() => handleRemoveActivity(item.date)}
                      onEdit={() => setSelectedDate(item.date)}
                    />
                    {selectedDate === item.date && (
                      <div className="mt-3">
                        <ActivitySelector
                          date={item.date}
                          onSelectActivity={(site, restaurant, cost, notes) =>
                            handleAddActivity(item.date, site, restaurant, cost, notes)
                          }
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <Button onClick={() => setTrip(null)} variant="outline" className="w-full">
                Create New Trip
              </Button>
            </div>

            {/* Sidebar Summary */}
            <div className="lg:col-span-1">
              <div className="bg-card rounded-lg border border-border p-6 space-y-4 sticky top-32">
                <h3 className="font-bold text-lg text-foreground">Trip Summary</h3>

                <div className="space-y-3 border-t border-border pt-4">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total Days</span>
                    <span className="font-semibold">
                      {Math.ceil(
                        (new Date(trip.endDate).getTime() - new Date(trip.startDate).getTime()) / (1000 * 60 * 60 * 24),
                      ) + 1}
                    </span>
                  </div>
                  {trip.budget && (
                    <>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Total Budget</span>
                        <span className="font-semibold">₹{trip.budget}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Per Day</span>
                        <span className="font-semibold text-primary">₹{costPerDay}</span>
                      </div>
                    </>
                  )}
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Planned Activities</span>
                    <span className="font-semibold">
                      {itinerary.filter((i) => i.site || i.restaurant).length}/{itinerary.length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Estimated Cost</span>
                    <span className="font-semibold text-accent">₹{totalCost}</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-border space-y-2">
                  <Button onClick={handleSaveTrip} className="w-full bg-primary hover:bg-primary/90">
                    <Download className="mr-2 h-4 w-4" />
                    Save Trip as PDF
                  </Button>
                  <Button variant="outline" className="w-full bg-transparent">
                    Share Itinerary
                  </Button>
                </div>
              </div>

              {/* AI Suggestion */}
              <div className="mt-6">
                <AISuggestion
                  duration={Math.ceil(
                    (new Date(trip.endDate).getTime() - new Date(trip.startDate).getTime()) / (1000 * 60 * 60 * 24)
                  ) + 1}
                  budget={trip.budget}
                  onApplyItinerary={handleApplyAIItinerary}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
