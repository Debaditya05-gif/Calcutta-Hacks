"use client"

import { BadgeIcon } from "lucide-react"
import { useState } from "react"

interface BadgeCardProps {
  id: string
  name: string
  description: string
  icon: string
  progress: number
  requirement: number
  isUnlocked: boolean
  unlockedAt?: Date
}

export function BadgeCard({
  id,
  name,
  description,
  icon,
  progress,
  requirement,
  isUnlocked,
  unlockedAt,
}: BadgeCardProps) {
  const [isFlipping, setIsFlipping] = useState(false)
  const progressPercent = (progress / requirement) * 100

  return (
    <div
      className={`relative w-full max-w-xs h-56 rounded-2xl border-2 overflow-hidden cursor-pointer transition-all duration-300 hover:scale-105 ${isUnlocked ? "border-accent bg-gradient-to-br from-accent/20 to-primary/20" : "border-border bg-card"
        }`}
      onMouseEnter={() => setIsFlipping(true)}
      onMouseLeave={() => setIsFlipping(false)}
    >
      {/* Front - Badge Display */}
      <div
        className={`absolute inset-0 p-6 flex flex-col items-center justify-center transition-opacity duration-300 ${isFlipping ? "opacity-0" : "opacity-100"}`}
      >
        <div className="text-6xl mb-4">{icon}</div>
        <h3 className="font-bold text-lg text-center text-foreground">{name}</h3>

        {!isUnlocked && (
          <div className="mt-4 w-full">
            <div className="w-full bg-border rounded-full h-2 mb-2 overflow-hidden">
              <div className="bg-primary h-full transition-all duration-500" style={{ width: `${progressPercent}%` }} />
            </div>
            <p className="text-xs text-muted-foreground text-center">
              {progress}/{requirement}
            </p>
          </div>
        )}

        {isUnlocked && <p className="text-xs text-accent font-semibold mt-2">✓ Unlocked</p>}
      </div>

      {/* Back - Details */}
      <div
        className={`absolute inset-0 p-6 flex flex-col justify-center transition-opacity duration-300 ${isFlipping ? "opacity-100" : "opacity-0"
          }`}
      >
        <p className="text-sm text-foreground text-center mb-3">{description}</p>
        {isUnlocked && unlockedAt && (
          <p className="text-xs text-muted-foreground text-center">
            Unlocked on {new Date(unlockedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
          </p>
        )}
        <p className="text-xs text-muted-foreground text-center mt-4">Hover to flip</p>
      </div>

      {/* Locked Overlay */}
      {!isUnlocked && (
        <div className="absolute inset-0 bg-black/40 pointer-events-none flex items-center justify-center">
          <div className="w-12 h-12 bg-black/60 rounded-full flex items-center justify-center">
            <BadgeIcon size={24} className="text-white" />
          </div>
        </div>
      )}
    </div>
  )
}
