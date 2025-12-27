"use client"

import type { User } from "@/lib/types"
import { Zap } from "lucide-react"
import { useState } from "react"

interface MatchCardProps {
  currentUser: User
  matchUser: User
  compatibilityScore: number
  commonInterests: string[]
  onLike: () => void
  onPass: () => void
}

export function MatchCard({
  currentUser,
  matchUser,
  compatibilityScore,
  commonInterests,
  onLike,
  onPass,
}: MatchCardProps) {
  const [isFlipping, setIsFlipping] = useState(false)

  return (
    <div
      className="relative w-full max-w-sm h-96 bg-card rounded-2xl border-2 border-border overflow-hidden shadow-lg transition-transform duration-300 hover:scale-105"
      onMouseEnter={() => setIsFlipping(true)}
      onMouseLeave={() => setIsFlipping(false)}
    >
      {/* Front Side - User Info */}
      <div className={`absolute inset-0 transition-opacity duration-300 ${isFlipping ? "opacity-0" : "opacity-100"}`}>
        {/* Avatar Background */}
        <div className="relative h-full bg-gradient-to-b from-primary/30 to-accent/30">
          <img
            src={matchUser.avatarUrl || "/placeholder.svg"}
            alt={matchUser.fullName}
            className="w-full h-72 object-cover"
          />

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />

          {/* Info Section */}
          <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
            <h2 className="text-2xl font-bold">{matchUser.fullName}</h2>
            <p className="text-sm opacity-90">
              {matchUser.age} • {matchUser.gender}
            </p>
            <p className="text-xs opacity-75 mt-1 line-clamp-2">{matchUser.bio}</p>

            {/* Compatibility Badge */}
            <div className="mt-3 inline-flex items-center gap-2 bg-primary px-3 py-1 rounded-full">
              <Zap size={14} />
              <span className="font-semibold">{compatibilityScore}% Match</span>
            </div>
          </div>
        </div>
      </div>

      {/* Back Side - Interests & Details */}
      <div
        className={`absolute inset-0 p-6 bg-gradient-to-br from-primary/10 to-accent/10 transition-opacity duration-300 ${
          isFlipping ? "opacity-100" : "opacity-0"
        }`}
      >
        <div className="h-full flex flex-col justify-between">
          <div>
            <h3 className="font-semibold text-foreground mb-3">Travel Style</h3>
            <p className="text-sm text-muted-foreground capitalize mb-4">{matchUser.travelStyle}</p>

            <h3 className="font-semibold text-foreground mb-3">Interests</h3>
            <div className="flex flex-wrap gap-2 mb-6">
              {matchUser.interests.map((interest) => (
                <span key={interest} className="px-2 py-1 bg-primary/20 text-primary text-xs rounded-full">
                  {interest}
                </span>
              ))}
            </div>

            <h3 className="font-semibold text-foreground mb-3">Common Interests</h3>
            <div className="flex flex-wrap gap-2">
              {commonInterests.map((interest) => (
                <span key={interest} className="px-2 py-1 bg-accent/30 text-accent text-xs rounded-full font-medium">
                  {interest}
                </span>
              ))}
            </div>
          </div>

          <p className="text-xs text-muted-foreground text-center">Hover to flip</p>
        </div>
      </div>
    </div>
  )
}
