"use client"

import type { HeritageQuest } from "@/lib/types"
import { Trophy, Zap, MapPin, CheckCircle, Clock, Target } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { mockHeritageSites } from "@/lib/mock-data"

export type QuestStatus = "not_started" | "in_progress" | "completed"

interface QuestCardProps {
  quest: HeritageQuest
  questStatus: QuestStatus
  currentStep: number
  onStart: () => void
  onCompleteStep: () => void
  onViewLocation: (latitude: number, longitude: number) => void
}

export function QuestCard({ quest, questStatus, currentStep, onStart, onCompleteStep, onViewLocation }: QuestCardProps) {
  const [showDetails, setShowDetails] = useState(false)
  const router = useRouter()

  const questSteps = [
    { id: 1, text: "Travel to the location", icon: MapPin },
    { id: 2, text: "Find the clue", icon: Target },
    { id: 3, text: "Complete the challenge", icon: CheckCircle },
  ]

  const heritageSite = mockHeritageSites.find(site => site.id === quest.heritageSiteId)

  const difficultyColors = {
    easy: "text-green-600 bg-green-100",
    medium: "text-yellow-600 bg-yellow-100",
    hard: "text-red-600 bg-red-100",
  }

  const handleViewLocation = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (heritageSite) {
      onViewLocation(heritageSite.latitude, heritageSite.longitude)
    }
  }

  const handleStartQuest = (e: React.MouseEvent) => {
    e.stopPropagation()
    onStart()
  }

  const handleCompleteStep = (e: React.MouseEvent) => {
    e.stopPropagation()
    onCompleteStep()
  }

  const isCompleted = questStatus === "completed"
  const isInProgress = questStatus === "in_progress"

  return (
    <div
      className={`animate-fade-in bg-card rounded-xl border-2 overflow-hidden transition-all duration-300 hover:shadow-lg group cursor-pointer ${isCompleted ? "border-accent bg-accent/5" : isInProgress ? "border-primary bg-primary/5" : "border-border hover:border-primary"
        }`}
      onClick={() => !isCompleted && setShowDetails(!showDetails)}
    >
      <div className="p-6 space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="font-bold text-lg text-foreground">{quest.name}</h3>
            <p className="text-sm text-muted-foreground mt-1">{quest.description}</p>
          </div>
          {isCompleted && <Trophy size={24} className="text-accent fill-accent" />}
        </div>

        {/* Difficulty & Rewards */}
        <div className="flex items-center gap-3">
          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${difficultyColors[quest.difficultyLevel]}`}
          >
            {quest.difficultyLevel}
          </span>
          <div className="flex items-center gap-1 text-sm font-semibold text-primary">
            <Zap size={16} />
            {quest.rewardPoints} points
          </div>
          <div className="flex items-center gap-1 text-sm font-semibold text-accent">{quest.rewardDiscount}% off</div>
        </div>

        {/* Expandable Details */}
        {showDetails && (
          <div className="animate-slide-up p-4 bg-muted rounded-lg border border-border space-y-3">
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase mb-1">Clue</p>
              <p className="text-sm">{quest.clue}</p>
            </div>

            {/* Quest Progress Steps */}
            {isInProgress && (
              <div className="space-y-2 mt-4">
                <p className="text-xs font-semibold text-muted-foreground uppercase">Quest Progress</p>
                <div className="space-y-2">
                  {questSteps.map((step, index) => {
                    const StepIcon = step.icon
                    const isStepCompleted = index < currentStep
                    const isCurrentStep = index === currentStep
                    return (
                      <div
                        key={step.id}
                        className={`flex items-center gap-3 p-2 rounded-lg transition-all ${isStepCompleted
                            ? "bg-accent/20 text-accent"
                            : isCurrentStep
                              ? "bg-primary/20 text-primary"
                              : "bg-muted-foreground/10 text-muted-foreground"
                          }`}
                      >
                        <StepIcon size={16} className={isStepCompleted ? "text-accent" : isCurrentStep ? "text-primary" : ""} />
                        <span className={`text-sm flex-1 ${isStepCompleted ? "line-through" : ""}`}>{step.text}</span>
                        {isStepCompleted && <CheckCircle size={16} className="text-accent" />}
                        {isCurrentStep && <Clock size={16} className="text-primary animate-pulse" />}
                      </div>
                    )
                  })}
                </div>
                <Button
                  onClick={handleCompleteStep}
                  className="w-full mt-2 bg-primary hover:bg-primary/90"
                  size="sm"
                >
                  {currentStep < questSteps.length - 1 ? "Complete Step" : "Finish Quest"}
                </Button>
              </div>
            )}

            <div className="flex gap-2 pt-2">
              {!isCompleted && !isInProgress && (
                <Button onClick={handleStartQuest} className="flex-1 bg-primary hover:bg-primary/90" size="sm">
                  Start Quest
                </Button>
              )}
              <Button
                variant="outline"
                size="sm"
                className={`${!isCompleted && !isInProgress ? "flex-1" : "w-full"} bg-transparent`}
                onClick={handleViewLocation}
              >
                <MapPin size={14} className="mr-1" />
                View Location
              </Button>
            </div>
          </div>
        )}

        {/* Status indicator when collapsed */}
        {!showDetails && !isCompleted && !isInProgress && (
          <p className="text-xs text-muted-foreground">Click to expand details</p>
        )}
        {!showDetails && isInProgress && (
          <div className="flex items-center gap-2 text-xs text-primary">
            <Clock size={14} className="animate-pulse" />
            <span>Quest in progress - {currentStep}/{questSteps.length} steps completed</span>
          </div>
        )}
      </div>
    </div>
  )
}
