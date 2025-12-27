"use client"

import { useState, useEffect } from "react"
import { mockBadges, mockUserBadges, mockHeritageQuests } from "@/lib/mock-data"
import { BadgeCard } from "@/components/gamification/badge-card"
import { QuestCard, QuestStatus } from "@/components/gamification/quest-card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Trophy, Target, Sparkles } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import type { CultureSubmission } from "@/lib/types"

interface QuestState {
  status: QuestStatus
  currentStep: number
}

export default function AchievementsPage() {
  const router = useRouter()
  const [questStates, setQuestStates] = useState<Record<string, QuestState>>({})
  const [basePoints, setBasePoints] = useState(125)
  const [culturePoints, setCulturePoints] = useState(0)

  // Load culture submission points from localStorage
  useEffect(() => {
    const stored = localStorage.getItem("cultureSubmissions")
    if (stored) {
      const submissions: CultureSubmission[] = JSON.parse(stored)
      const approvedPoints = submissions
        .filter((s) => s.status === "approved")
        .reduce((acc, s) => acc + s.rewardPoints, 0)
      setCulturePoints(approvedPoints)
    }
  }, [])

  const totalPoints = basePoints + culturePoints

  const unlockedBadgeIds = new Set(mockUserBadges.map((b) => b.badge.id))
  const completedQuests = new Set(
    Object.entries(questStates)
      .filter(([_, state]) => state.status === "completed")
      .map(([id, _]) => id)
  )

  const handleStartQuest = (questId: string) => {
    setQuestStates((prev) => ({
      ...prev,
      [questId]: { status: "in_progress", currentStep: 0 }
    }))
  }

  const handleCompleteStep = (questId: string) => {
    setQuestStates((prev) => {
      const currentState = prev[questId] || { status: "not_started", currentStep: 0 }
      const totalSteps = 3 // Total quest steps
      const nextStep = currentState.currentStep + 1

      if (nextStep >= totalSteps) {
        // Quest completed - award points
        const quest = mockHeritageQuests.find((q) => q.id === questId)
        if (quest) {
          setBasePoints((prevPoints: number) => prevPoints + quest.rewardPoints)
        }
        return {
          ...prev,
          [questId]: { status: "completed", currentStep: totalSteps }
        }
      }

      return {
        ...prev,
        [questId]: { status: "in_progress", currentStep: nextStep }
      }
    })
  }

  const handleViewLocation = (latitude: number, longitude: number) => {
    router.push(`/explore?lat=${latitude}&lng=${longitude}&zoom=17`)
  }

  const getQuestState = (questId: string): QuestState => {
    return questStates[questId] || { status: "not_started", currentStep: 0 }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b border-border sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <Link href="/" className="flex items-center gap-2 mb-2 w-fit hover:text-primary transition">
            <span className="text-sm text-muted-foreground">← Back to Home</span>
          </Link>
          <h1 className="text-3xl font-bold text-foreground">Achievements & Gamification</h1>
          <p className="text-muted-foreground">Unlock "Bhadralok" badges and complete heritage quests</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats Bar */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          <div className="bg-card rounded-lg border border-border p-6">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles size={20} className="text-accent" />
              <p className="text-xs font-semibold text-muted-foreground">Total Points</p>
            </div>
            <p className="text-3xl font-bold text-foreground">{totalPoints}</p>
          </div>
          <div className="bg-card rounded-lg border border-border p-6">
            <div className="flex items-center gap-2 mb-2">
              <Trophy size={20} className="text-primary" />
              <p className="text-xs font-semibold text-muted-foreground">Badges Unlocked</p>
            </div>
            <p className="text-3xl font-bold text-foreground">
              {unlockedBadgeIds.size}/{mockBadges.length}
            </p>
          </div>
          <div className="bg-card rounded-lg border border-border p-6">
            <div className="flex items-center gap-2 mb-2">
              <Target size={20} className="text-accent" />
              <p className="text-xs font-semibold text-muted-foreground">Quests Completed</p>
            </div>
            <p className="text-3xl font-bold text-foreground">{completedQuests.size}</p>
          </div>
          <div className="bg-gradient-to-br from-primary/20 to-accent/20 rounded-lg border border-primary/30 p-6 flex flex-col justify-center items-center">
            <p className="text-xs font-semibold text-muted-foreground mb-2">Redeem Rewards</p>
            <button
              onClick={() => {
                const aptosTokens = Math.floor(totalPoints / 50) * 2
                alert(`🚀 UPCOMING FEATURE\n\n🎉 Convert Your Points to Aptos Bounty Tokens!\n\nYou have ${totalPoints} points available.\n\n💰 Conversion Rate:\n50 Points → $2 Aptos Bounty Token\n\n✨ You can convert to: $${aptosTokens} APT\n\n🔗 Connect your Aptos wallet to claim!\n\n⏳ Coming Soon...`)
              }}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg font-semibold text-sm hover:bg-primary/90 transition-colors flex items-center gap-2"
            >
              <Sparkles size={16} />
              Convert
            </button>
          </div>
        </div>

        <Tabs defaultValue="badges" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="badges">Badges (Bhadralok System)</TabsTrigger>
            <TabsTrigger value="quests">Heritage Quests</TabsTrigger>
          </TabsList>

          {/* Badges Tab */}
          <TabsContent value="badges">
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-4">Unlock Kolkata's Heritage Badges</h2>
                <p className="text-muted-foreground mb-6">
                  Complete challenges across the city to unlock exclusive "Bhadralok" badges and earn rewards.
                </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {mockBadges.map((badge) => {
                  const userBadge = mockUserBadges.find((b) => b.badge.id === badge.id)
                  return (
                    <BadgeCard
                      key={badge.id}
                      id={badge.id}
                      name={badge.name}
                      description={badge.description}
                      icon={badge.iconUrl || "🏆"}
                      progress={userBadge?.progress || 0}
                      requirement={badge.requirementValue}
                      isUnlocked={!!userBadge}
                      unlockedAt={userBadge?.unlockedAt}
                    />
                  )
                })}
              </div>
            </div>
          </TabsContent>

          {/* Quests Tab */}
          <TabsContent value="quests">
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-4">Heritage Scavenger Hunts</h2>
                <p className="text-muted-foreground mb-6">
                  Complete quests at iconic heritage sites to unlock special discounts and rewards at partnering
                  establishments.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {mockHeritageQuests.map((quest) => {
                  const questState = getQuestState(quest.id)
                  return (
                    <QuestCard
                      key={quest.id}
                      quest={quest}
                      questStatus={questState.status}
                      currentStep={questState.currentStep}
                      onStart={() => handleStartQuest(quest.id)}
                      onCompleteStep={() => handleCompleteStep(quest.id)}
                      onViewLocation={handleViewLocation}
                    />
                  )
                })}
              </div>

              {/* Active Quests Info */}
              <div className="bg-primary/10 border border-primary rounded-lg p-6 mt-8">
                <h3 className="font-bold text-foreground mb-2">How Quests Work</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Find the location mentioned in the quest clue</li>
                  <li>• Follow the instructions to complete the challenge</li>
                  <li>• Earn points and unlock discounts at nearby restaurants and cafes</li>
                  <li>• Share your adventure on social media for bonus points</li>
                </ul>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Leaderboard Preview */}
        <div className="mt-12 bg-card rounded-lg border border-border p-6">
          <h3 className="text-2xl font-bold text-foreground mb-4">Top Explorers This Week</h3>
          <div className="space-y-3">
            {[
              { rank: 1, name: "Priya Sharma", points: 450, badges: 4 },
              { rank: 2, name: "Vikram Patel", points: 380, badges: 3 },
              { rank: 3, name: "You", points: totalPoints, badges: unlockedBadgeIds.size, isYou: true },
            ].map((entry) => (
              <div
                key={entry.rank}
                className={`flex items-center justify-between p-4 rounded-lg border ${entry.isYou ? "bg-primary/10 border-primary" : "bg-muted border-border"
                  }`}
              >
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center font-bold">
                    {entry.rank}
                  </div>
                  <div>
                    <p className="font-semibold">{entry.name}</p>
                    <p className="text-xs text-muted-foreground">{entry.badges} badges</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-lg">{entry.points}</p>
                  <p className="text-xs text-muted-foreground">points</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
