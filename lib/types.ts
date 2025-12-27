export interface User {
  id: string
  email: string
  fullName: string
  avatarUrl?: string
  bio?: string
  age?: number
  gender?: string
  interests: string[]
  travelStyle?: "adventurous" | "cultural" | "luxury"
  isSoloTraveler: boolean
  createdAt: Date
  updatedAt: Date
}

export interface HeritageSite {
  id: string
  name: string
  description: string
  category: string
  latitude: number
  longitude: number
  address: string
  entryFee?: number
  openingHours?: string
  bestTimeToVisit?: string
  historicalSignificance?: string
  imageUrl?: string
  rating: number
  visitCount: number
}

export interface Restaurant {
  id: string
  name: string
  description: string
  cuisineType: string[]
  latitude: number
  longitude: number
  address: string
  priceRange: "budget" | "moderate" | "luxury"
  rating: number
  reviewCount: number
  imageUrl?: string
  avgCostPerPerson?: number
  specialties: string[]
}

export interface TravelMatch {
  id: string
  userId1: string
  userId2: string
  compatibilityScore: number
  status: "pending" | "accepted" | "declined" | "matched"
  createdAt: Date
}

export interface TripPlan {
  id: string
  userId: string
  name: string
  startDate: Date
  endDate: Date
  budget?: number
  description?: string
}

export interface Badge {
  id: string
  name: string
  description: string
  iconUrl?: string
  requirementType: string
  requirementValue: number
}

export interface HeritageQuest {
  id: string
  name: string
  description: string
  heritageSiteId: string
  rewardPoints: number
  rewardDiscount: number
  difficultyLevel: "easy" | "medium" | "hard"
  clue: string
}

export interface RestaurantReview {
  id: string
  restaurantId: string
  userId: string
  userName: string
  rating: number
  text: string
  dishesTried: string[]
  createdAt: Date
}

export interface UserBadge {
  badge: Badge
  unlockedAt?: Date
  progress: number
}

export type Dish = string

export interface CultureSubmission {
  id: string
  userId: string
  userName: string
  title: string
  description: string
  imageUrl: string
  status: "pending" | "approved" | "rejected"
  rewardPoints: number
  createdAt: Date
  reviewedAt?: Date
  adminNote?: string
}
