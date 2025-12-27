import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
    console.log('🌱 Starting database seed...')

    // Clear existing data
    await prisma.userQuest.deleteMany()
    await prisma.userBadge.deleteMany()
    await prisma.siteVisit.deleteMany()
    await prisma.tripActivity.deleteMany()
    await prisma.tripPlan.deleteMany()
    await prisma.travelMatch.deleteMany()
    await prisma.restaurantReview.deleteMany()
    await prisma.heritageQuest.deleteMany()
    await prisma.badge.deleteMany()
    await prisma.restaurant.deleteMany()
    await prisma.heritageSite.deleteMany()
    await prisma.user.deleteMany()

    console.log('📦 Creating heritage sites...')

    // Heritage Sites
    const heritageSites = await Promise.all([
        prisma.heritageSite.create({
            data: {
                name: "Victoria Memorial",
                description: "An iconic marble building built in memory of Queen Victoria. A masterpiece of Indo-Saracenic architecture.",
                category: "Monument",
                latitude: 22.5448,
                longitude: 88.3426,
                address: "1 Queens Way, Kolkata 700071",
                entryFee: 250,
                openingHours: "10:00 AM - 6:00 PM",
                bestTimeToVisit: "October to March",
                historicalSignificance: "Constructed between 1872-1921, it's a symbol of the British Raj era",
                imageUrl: "/victoria-memorial-kolkata.jpg",
                rating: 4.8,
                visitCount: 15000,
            },
        }),
        prisma.heritageSite.create({
            data: {
                name: "South Park Street Cemetery",
                description: "Historic cemetery with beautiful marble tombs dating back to 18th-19th centuries.",
                category: "Cemetery",
                latitude: 22.5486,
                longitude: 88.3711,
                address: "Park Street, Kolkata 700016",
                entryFee: 0,
                openingHours: "6:00 AM - 6:00 PM",
                bestTimeToVisit: "Early morning or late afternoon",
                historicalSignificance: "Hidden tomb featuring in Heritage Quests, dates back to 1787",
                imageUrl: "/south-park-street-cemetery-kolkata.jpg",
                rating: 4.5,
                visitCount: 8000,
            },
        }),
        prisma.heritageSite.create({
            data: {
                name: "St. Paul's Cathedral",
                description: "Stunning neo-gothic cathedral with beautiful stained glass windows.",
                category: "Building",
                latitude: 22.5523,
                longitude: 88.3676,
                address: "Cathedral Road, Kolkata 700071",
                entryFee: 0,
                openingHours: "8:00 AM - 6:00 PM",
                bestTimeToVisit: "During morning prayers",
                historicalSignificance: "Oldest cathedral in India, built in the 19th century",
                imageUrl: "/st-pauls-cathedral-kolkata.jpg",
                rating: 4.6,
                visitCount: 6500,
            },
        }),
        prisma.heritageSite.create({
            data: {
                name: "Jorasanko Tagore House",
                description: "Ancestral home of Rabindranath Tagore, now a museum showcasing his life and works.",
                category: "Museum",
                latitude: 22.579,
                longitude: 88.3661,
                address: "Jorasanko Lane, Kolkata 700007",
                entryFee: 150,
                openingHours: "10:30 AM - 5:00 PM",
                bestTimeToVisit: "Tuesday to Sunday",
                historicalSignificance: "Home of Bengal's greatest poet and first non-European Nobel laureate",
                imageUrl: "/jorasanko-tagore-house-kolkata.jpg",
                rating: 4.7,
                visitCount: 5000,
            },
        }),
        prisma.heritageSite.create({
            data: {
                name: "Kalighat Temple",
                description: "Ancient Hindu temple dedicated to Goddess Kali, one of the holiest sites in Bengal.",
                category: "Temple",
                latitude: 22.5145,
                longitude: 88.3515,
                address: "Kalighat, Kolkata 700026",
                entryFee: 0,
                openingHours: "5:00 AM - 12:00 PM, 3:00 PM - 9:00 PM",
                bestTimeToVisit: "Early morning",
                historicalSignificance: "One of the 51 Shakti Peeths, mentioned in ancient texts",
                imageUrl: "/kalighat-temple-kolkata.jpg",
                rating: 4.4,
                visitCount: 12000,
            },
        }),
        prisma.heritageSite.create({
            data: {
                name: "Indian Museum",
                description: "India's oldest museum with an extensive collection of art, history, and natural specimens.",
                category: "Museum",
                latitude: 22.5445,
                longitude: 88.3923,
                address: "27 Chowringhee Road, Kolkata 700071",
                entryFee: 500,
                openingHours: "10:00 AM - 5:00 PM",
                bestTimeToVisit: "Weekday mornings",
                historicalSignificance: "Founded in 1814, houses over 1 million artifacts",
                imageUrl: "/indian-museum-kolkata.jpg",
                rating: 4.5,
                visitCount: 4500,
            },
        }),
    ])

    console.log('🍽️ Creating restaurants...')

    // Restaurants
    const restaurants = await Promise.all([
        prisma.restaurant.create({
            data: {
                name: "Bhim Nag",
                description: "Traditional Bengali cuisine in a heritage setting near Victoria Memorial.",
                cuisineType: ["Bengali", "Indian"],
                latitude: 22.5448,
                longitude: 88.3426,
                address: "Near Victoria Memorial, Kolkata",
                priceRange: "moderate",
                rating: 4.6,
                reviewCount: 234,
                imageUrl: "/bhim-nag-restaurant-kolkata.jpg",
                avgCostPerPerson: 400,
                specialties: ["Hilsa Fish", "Luchi", "Aloo Posto"],
            },
        }),
        prisma.restaurant.create({
            data: {
                name: "Flury's Tea Room",
                description: "Iconic establishment on Park Street serving pastries and tea since 1927.",
                cuisineType: ["Bakery", "Continental", "Tea"],
                latitude: 22.5528,
                longitude: 88.3652,
                address: "18 Park Street, Kolkata 700016",
                priceRange: "moderate",
                rating: 4.7,
                reviewCount: 567,
                imageUrl: "/flurys-tea-room-park-street.jpg",
                avgCostPerPerson: 300,
                specialties: ["Belgian Chocolate Cake", "Tea", "Sandwiches"],
            },
        }),
        prisma.restaurant.create({
            data: {
                name: "Peter Cat",
                description: "Legendary restaurant known for its signature Chelo Kebab and continental cuisine.",
                cuisineType: ["Continental", "Indian", "Multi-cuisine"],
                latitude: 22.553,
                longitude: 88.367,
                address: "Park Street, Kolkata 700016",
                priceRange: "luxury",
                rating: 4.8,
                reviewCount: 789,
                imageUrl: "/peter-cat-park-street-kolkata.jpg",
                avgCostPerPerson: 800,
                specialties: ["Chelo Kebab", "Prawns Koobideh", "Mulligatawny Soup"],
            },
        }),
        prisma.restaurant.create({
            data: {
                name: "Kali Tala",
                description: "Family-run Bengali restaurant with authentic home-cooked flavors.",
                cuisineType: ["Bengali"],
                latitude: 22.5145,
                longitude: 88.3515,
                address: "Near Kalighat, Kolkata 700026",
                priceRange: "budget",
                rating: 4.5,
                reviewCount: 156,
                imageUrl: "/kali-tala-restaurant-bengali-kolkata.jpg",
                avgCostPerPerson: 200,
                specialties: ["Machher Jhol", "Rice", "Mishti Doi"],
            },
        }),
        prisma.restaurant.create({
            data: {
                name: "Aaheli",
                description: "Traditional Bengali restaurant in a restored heritage building.",
                cuisineType: ["Bengali", "Indian"],
                latitude: 22.579,
                longitude: 88.3661,
                address: "Near Jorasanko, Kolkata 700007",
                priceRange: "moderate",
                rating: 4.6,
                reviewCount: 312,
                imageUrl: "/aaheli-restaurant-jorasanko-kolkata.jpg",
                avgCostPerPerson: 450,
                specialties: ["Shorshe Ilish", "Chingri Malai Curry", "Payesh"],
            },
        }),
    ])

    console.log('🏆 Creating badges...')

    // Badges
    const badges = await Promise.all([
        prisma.badge.create({
            data: {
                name: "The Bhadralok",
                description: "Visited 5 heritage sites",
                iconUrl: "👑",
                requirementType: "visits",
                requirementValue: 5,
            },
        }),
        prisma.badge.create({
            data: {
                name: "Heritage Master",
                description: "Visited 10 heritage sites",
                iconUrl: "🏛️",
                requirementType: "visits",
                requirementValue: 10,
            },
        }),
        prisma.badge.create({
            data: {
                name: "Culinary Explorer",
                description: "Tried 5 different restaurants",
                iconUrl: "🍽️",
                requirementType: "restaurants",
                requirementValue: 5,
            },
        }),
        prisma.badge.create({
            data: {
                name: "Social Butterfly",
                description: "Matched with 3 travel companions",
                iconUrl: "🦋",
                requirementType: "matches",
                requirementValue: 3,
            },
        }),
        prisma.badge.create({
            data: {
                name: "Quest Master",
                description: "Completed 5 heritage quests",
                iconUrl: "⚔️",
                requirementType: "quests",
                requirementValue: 5,
            },
        }),
    ])

    console.log('🎯 Creating heritage quests...')

    // Heritage Quests
    await Promise.all([
        prisma.heritageQuest.create({
            data: {
                name: "Hidden Tomb Mystery",
                description: "Find the hidden tomb at South Park Street Cemetery to unlock a 10% discount at Flury's Tea Room.",
                heritageSiteId: heritageSites[1].id,
                rewardPoints: 50,
                rewardDiscount: 10,
                difficultyLevel: "medium",
                clue: "Look for the oldest marble structure with intricate carvings near the eastern wall",
            },
        }),
        prisma.heritageQuest.create({
            data: {
                name: "Victoria's Secrets",
                description: "Explore all sections of Victoria Memorial and complete 5 photo challenges.",
                heritageSiteId: heritageSites[0].id,
                rewardPoints: 75,
                rewardDiscount: 15,
                difficultyLevel: "hard",
                clue: "Start from the main entrance and visit the museum galleries",
            },
        }),
        prisma.heritageQuest.create({
            data: {
                name: "Cathedral Bells",
                description: "Attend a service at St. Paul's Cathedral and learn about its architecture.",
                heritageSiteId: heritageSites[2].id,
                rewardPoints: 40,
                rewardDiscount: 8,
                difficultyLevel: "easy",
                clue: "Visit during morning prayers (8:00 AM)",
            },
        }),
    ])

    console.log('👤 Creating sample users...')

    // Sample Users
    const hashedPassword = await bcrypt.hash("password123", 12)

    const users = await Promise.all([
        prisma.user.create({
            data: {
                email: "priya@kolkata.com",
                password: hashedPassword,
                fullName: "Priya Sharma",
                avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Priya",
                bio: "Love exploring heritage sites and trying authentic Bengali cuisine",
                age: 26,
                gender: "Female",
                interests: ["Heritage", "Photography", "Bengali Cuisine", "Art"],
                travelStyle: "cultural",
                isSoloTraveler: true,
                totalPoints: 125,
            },
        }),
        prisma.user.create({
            data: {
                email: "vikram@kolkata.com",
                password: hashedPassword,
                fullName: "Vikram Patel",
                avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Vikram",
                bio: "Adventure seeker exploring Kolkata's hidden gems",
                age: 28,
                gender: "Male",
                interests: ["Adventure", "History", "Photography", "Food"],
                travelStyle: "adventurous",
                isSoloTraveler: true,
                totalPoints: 380,
            },
        }),
        prisma.user.create({
            data: {
                email: "sneha@kolkata.com",
                password: hashedPassword,
                fullName: "Sneha Gupta",
                avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sneha",
                bio: "Cultural enthusiast seeking meaningful connections",
                age: 24,
                gender: "Female",
                interests: ["Culture", "Museums", "Bengal Literature", "Spirituality"],
                travelStyle: "cultural",
                isSoloTraveler: true,
                totalPoints: 200,
            },
        }),
        prisma.user.create({
            data: {
                email: "arjun@kolkata.com",
                password: hashedPassword,
                fullName: "Arjun Kumar",
                avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Arjun",
                bio: "Travel blogger documenting Kolkata stories",
                age: 29,
                gender: "Male",
                interests: ["Travel", "Blogging", "Heritage", "Street Food"],
                travelStyle: "cultural",
                isSoloTraveler: true,
                totalPoints: 450,
            },
        }),
    ])

    // Give some users badges
    await prisma.userBadge.create({
        data: {
            userId: users[0].id,
            badgeId: badges[0].id,
            progress: 5,
            unlockedAt: new Date("2025-01-10"),
        },
    })

    await prisma.userBadge.create({
        data: {
            userId: users[0].id,
            badgeId: badges[2].id,
            progress: 5,
            unlockedAt: new Date("2025-01-12"),
        },
    })

    // Create some reviews
    await Promise.all([
        prisma.restaurantReview.create({
            data: {
                restaurantId: restaurants[0].id,
                userId: users[3].id,
                rating: 5,
                text: "Authentic Bengali cuisine at its finest. The hilsa fish was perfectly cooked!",
                dishesTried: ["Hilsa Fish", "Luchi"],
            },
        }),
        prisma.restaurantReview.create({
            data: {
                restaurantId: restaurants[1].id,
                userId: users[0].id,
                rating: 5,
                text: "A heritage institution! The Belgian Chocolate Cake is to die for.",
                dishesTried: ["Belgian Chocolate Cake", "Tea"],
            },
        }),
        prisma.restaurantReview.create({
            data: {
                restaurantId: restaurants[2].id,
                userId: users[1].id,
                rating: 5,
                text: "Best Chelo Kebab in Kolkata. Worth every penny for the experience.",
                dishesTried: ["Chelo Kebab"],
            },
        }),
    ])

    console.log('✅ Database seeded successfully!')
    console.log(`   - ${heritageSites.length} heritage sites`)
    console.log(`   - ${restaurants.length} restaurants`)
    console.log(`   - ${badges.length} badges`)
    console.log(`   - 3 heritage quests`)
    console.log(`   - ${users.length} sample users`)
    console.log('')
    console.log('📝 Sample login credentials:')
    console.log('   Email: priya@kolkata.com')
    console.log('   Password: password123')
}

main()
    .catch((e) => {
        console.error('❌ Seed error:', e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
