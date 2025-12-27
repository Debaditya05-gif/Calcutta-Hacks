"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Sparkles, Loader2, Calendar, MapPin, UtensilsCrossed } from "lucide-react"

interface Activity {
    time: string
    type: string
    name: string
    description: string
    estimatedCost: number
    duration: string
}

interface Day {
    day: number
    theme: string
    activities: Activity[]
}

interface Itinerary {
    tripName: string
    days: Day[]
    totalEstimatedCost: number
    tips: string[]
}

interface AISuggestionProps {
    duration: number
    budget?: string
    onClose?: () => void
    onApplyItinerary?: (itinerary: Itinerary) => void
}

export function AISuggestion({ duration, budget, onClose, onApplyItinerary }: AISuggestionProps) {
    const [loading, setLoading] = useState(false)
    const [itinerary, setItinerary] = useState<Itinerary | null>(null)
    const [error, setError] = useState("")

    const generateSuggestion = async () => {
        setLoading(true)
        setError("")

        try {
            const response = await fetch("/api/trips/suggest", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    duration,
                    budget: budget || "moderate",
                    interests: ["heritage", "culture", "food"],
                    travelStyle: "cultural",
                }),
            })

            const data = await response.json()

            if (!response.ok) {
                setError(data.error || "Failed to generate suggestion")
                return
            }

            setItinerary(data.itinerary)
        } catch {
            setError("Failed to connect to AI service")
        } finally {
            setLoading(false)
        }
    }

    if (!itinerary) {
        return (
            <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-xl p-6 border border-purple-200">
                <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-purple-500 rounded-lg">
                        <Sparkles className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <h3 className="font-bold text-foreground">AI Trip Suggestion</h3>
                        <p className="text-sm text-muted-foreground">
                            Let Gemini AI create a personalized {duration}-day itinerary for you
                        </p>
                    </div>
                </div>

                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded-lg mb-4 text-sm">
                        {error}
                    </div>
                )}

                <Button
                    onClick={generateSuggestion}
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                >
                    {loading ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Generating with AI...
                        </>
                    ) : (
                        <>
                            <Sparkles className="mr-2 h-4 w-4" />
                            Generate AI Itinerary
                        </>
                    )}
                </Button>
            </div>
        )
    }

    return (
        <div className="bg-card rounded-xl border border-border overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-4 text-white">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Sparkles className="w-5 h-5" />
                        <span className="font-semibold">AI Generated</span>
                    </div>
                    {onClose && (
                        <Button variant="ghost" size="sm" onClick={onClose} className="text-white hover:bg-white/20">
                            ✕
                        </Button>
                    )}
                </div>
                <h3 className="text-xl font-bold mt-2">{itinerary.tripName}</h3>
                <p className="text-white/80 text-sm">
                    Estimated Total: ₹{itinerary.totalEstimatedCost?.toLocaleString()}
                </p>
            </div>

            {/* Days */}
            <div className="p-4 space-y-4 max-h-[500px] overflow-y-auto">
                {itinerary.days?.map((day) => (
                    <div key={day.day} className="border border-border rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-3">
                            <Calendar className="w-4 h-4 text-primary" />
                            <span className="font-semibold">Day {day.day}</span>
                            <span className="text-muted-foreground">- {day.theme}</span>
                        </div>

                        <div className="space-y-2">
                            {day.activities?.map((activity, idx) => (
                                <div key={idx} className="flex items-start gap-3 p-2 bg-muted/50 rounded-lg">
                                    <div className="text-xs text-muted-foreground w-16 flex-shrink-0">
                                        {activity.time}
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2">
                                            {activity.type === "site" ? (
                                                <MapPin className="w-4 h-4 text-primary" />
                                            ) : activity.type === "restaurant" ? (
                                                <UtensilsCrossed className="w-4 h-4 text-accent" />
                                            ) : (
                                                <Sparkles className="w-4 h-4 text-purple-500" />
                                            )}
                                            <span className="font-medium text-sm">{activity.name}</span>
                                        </div>
                                        <p className="text-xs text-muted-foreground mt-1">{activity.description}</p>
                                        <div className="flex gap-3 mt-1 text-xs text-muted-foreground">
                                            <span>₹{activity.estimatedCost}</span>
                                            <span>{activity.duration}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}

                {/* Tips */}
                {itinerary.tips && itinerary.tips.length > 0 && (
                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                        <h4 className="font-semibold text-amber-800 mb-2">💡 Travel Tips</h4>
                        <ul className="text-sm text-amber-700 space-y-1">
                            {itinerary.tips.map((tip, idx) => (
                                <li key={idx}>• {tip}</li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>

            {/* Buttons */}
            <div className="p-4 border-t border-border space-y-2">
                {onApplyItinerary && (
                    <Button
                        onClick={() => onApplyItinerary(itinerary)}
                        className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
                    >
                        ✓ Apply to My Trip
                    </Button>
                )}
                <Button
                    onClick={generateSuggestion}
                    disabled={loading}
                    variant="outline"
                    className="w-full"
                >
                    {loading ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Regenerating...
                        </>
                    ) : (
                        <>
                            <Sparkles className="mr-2 h-4 w-4" />
                            Regenerate Itinerary
                        </>
                    )}
                </Button>
            </div>
        </div>
    )
}
