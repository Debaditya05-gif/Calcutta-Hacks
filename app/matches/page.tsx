"use client"

import { useState, useMemo } from "react"
import { mockUsers, mockTravelMatches } from "@/lib/mock-data"
import { MatchCard } from "@/components/matching/match-card"
import { MatchFilters, type MatchFilterState } from "@/components/matching/match-filters"
import { Heart, MapPin } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function MatchesPage() {
  const currentUser = mockUsers[0]
  const [likedMatches, setLikedMatches] = useState<Set<string>>(new Set())
  const [filters, setFilters] = useState<MatchFilterState>({
    ageRange: [18, 50],
    genders: ["Female", "Male", "Other"],
    interests: ["Heritage", "Photography", "Food", "Adventure", "Culture"],
    travelStyles: ["cultural", "adventurous", "luxury"],
    minCompatibility: 0,
  })

  const filteredMatches = useMemo(() => {
    return mockTravelMatches
      .filter((match) => {
        const otherUser = match.user2
        if (!filters.genders.includes(otherUser.gender || "")) return false
        if (otherUser.age! < filters.ageRange[0] || otherUser.age! > filters.ageRange[1]) return false
        if (match.compatibilityScore < filters.minCompatibility) return false
        return true
      })
      .sort((a, b) => b.compatibilityScore - a.compatibilityScore)
  }, [filters])

  const handleLike = (matchId: string) => {
    setLikedMatches((prev) => new Set([...prev, matchId]))
  }

  const handlePass = (matchId: string) => {
    setLikedMatches((prev) => {
      const newSet = new Set(prev)
      newSet.delete(matchId)
      return newSet
    })
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b border-border sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <Link href="/" className="flex items-center gap-2 mb-2 w-fit hover:text-primary transition">
            <span className="text-sm text-muted-foreground">← Back to Home</span>
          </Link>
          <h1 className="text-3xl font-bold text-foreground">Find Your Travel Companion</h1>
          <p className="text-muted-foreground">Match with fellow solo travelers exploring Kolkata</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Filters */}
          <div className="lg:col-span-1">
            <div className="sticky top-32">
              <MatchFilters onFiltersChange={setFilters} />
            </div>
          </div>

          {/* Matches Grid */}
          <div className="lg:col-span-3">
            {filteredMatches.length > 0 ? (
              <div>
                <div className="mb-6 flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">
                    {filteredMatches.length} perfect{filteredMatches.length === 1 ? " match" : " matches"} for you
                  </p>
                  <div className="flex items-center gap-2">
                    <Heart size={16} className="text-accent fill-accent" />
                    <span className="text-sm font-medium">{likedMatches.size} likes</span>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                  {filteredMatches.map((match) => (
                    <div key={match.id} className="flex flex-col items-center gap-4">
                      <MatchCard
                        currentUser={currentUser}
                        matchUser={match.user2}
                        compatibilityScore={match.compatibilityScore}
                        commonInterests={match.commonInterests}
                        onLike={() => handleLike(match.id)}
                        onPass={() => handlePass(match.id)}
                      />
                      <div className="flex gap-3 w-full max-w-sm">
                        <Button
                          onClick={() => handlePass(match.id)}
                          variant="outline"
                          className="flex-1 border-border hover:bg-muted"
                        >
                          Pass
                        </Button>
                        <Button
                          onClick={() => handleLike(match.id)}
                          className={`flex-1 ${
                            likedMatches.has(match.id)
                              ? "bg-accent hover:bg-accent/90"
                              : "bg-primary hover:bg-primary/90"
                          }`}
                        >
                          <Heart size={16} className={likedMatches.has(match.id) ? "fill-current" : ""} />
                          {likedMatches.has(match.id) ? "Liked" : "Like"}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <MapPin size={48} className="mx-auto text-muted-foreground mb-4 opacity-50" />
                <h3 className="text-lg font-semibold text-foreground mb-2">No matches found</h3>
                <p className="text-muted-foreground">Try adjusting your filters or check back later</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
