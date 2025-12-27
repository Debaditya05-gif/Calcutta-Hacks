🏛️ Kolkata Explorer

A Smart Tourism & Heritage Discovery Platform for Kolkata

Kolkata Explorer is a full-stack Next.js application that helps users explore Kolkata’s rich heritage, food culture, and travel experiences. It combines AI-powered trip planning, social travel matching, and a powerful admin dashboard to deliver a modern tourism platform.

🌟 Key Highlights

🗺️ Interactive heritage map with real-time data

🍽️ Restaurant discovery with reviews & ratings

🤝 Travel partner matching system

📅 AI-powered itinerary planning

🎙️ Voice assistant powered by Gemini + OpenRouter

🏆 Gamification with badges, quests & leaderboards

🔐 Secure admin panel with full CMS capabilities

✨ Features
🗺️ Heritage Explorer

Interactive OpenStreetMap integration

Explore iconic heritage sites of Kolkata

Detailed site information (history, timings, entry fees, etc.)

Track visits and earn rewards

🍽️ Restaurant Guide

Discover local & heritage restaurants

Filter by cuisine, price, and ratings

Add and read user reviews

👥 Travel Matching

Find like-minded travelers

Interest-based compatibility scoring

Like / pass system with mutual matches

📅 AI Trip Planner

Create personalized itineraries

AI-generated trip suggestions (Gemini API)

Add attractions, restaurants & budgets

🎙️ Voice Assistant

Real-time voice interaction

Ask about places, trips, or recommendations

Powered by OpenRouter (Gemini 2.0 Flash)

Uses Web Speech API

🏆 Gamification

Unlock “Bhadralok” themed badges

Complete heritage quests

Earn points and climb the leaderboard

🔐 Admin Dashboard

Accessible at /admin

Admin Capabilities:

Manage users

Add / edit heritage sites

Manage restaurants & reviews

Create badges and quests

Auto-geocoding via OpenStreetMap

View analytics & platform statistics

🚀 Quick Start
✅ Prerequisites

Node.js 18+

MySQL (XAMPP or standalone)

📦 Installation
git clone <your-repo-url>
cd kolkata-explorer-app
npm install

🔧 Environment Setup
cp env.example .env


Update .env:

DATABASE_URL="mysql://root:@localhost:3306/kolkata_explorer"
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"
GEMINI_API_KEY="your-gemini-api-key"
ADMIN_PASSWORD="your-admin-password"
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY="your-google-maps-key"
OPENROUTER_API_KEY="your-openrouter-api-key"

🗄️ Database Setup
npm run db:generate
npm run db:push
npm run db:seed

▶️ Start the App
npm run dev


Open 👉 http://localhost:3000

🔑 Demo Credentials
User Login
Email: priya@kolkata.com
Password: password123

Admin Panel
URL: http://localhost:3000/admin
Password: kolkata2024

🗂️ Project Structure
├── app/
│   ├── api/                 # Backend APIs
│   │   ├── auth/
│   │   ├── heritage-sites/
│   │   ├── restaurants/
│   │   ├── matches/
│   │   ├── trips/
│   │   ├── badges/
│   │   ├── quests/
│   │   ├── leaderboard/
│   │   ├── geocode/
│   │   └── admin/
│   ├── admin/               # Admin dashboard
│   ├── explore/             # Heritage map
│   ├── restaurants/         # Food guide
│   ├── matches/             # Travel matching
│   ├── planner/             # Trip planner
│   ├── achievements/        # Badges & quests
│   ├── login/
│   └── register/
├── components/
├── lib/
├── prisma/
│   ├── schema.prisma
│   └── seed.ts
└── types/

🔌 API Overview
🔐 Authentication
Method	Endpoint	Description
POST	/api/auth/register	Register user
POST	/api/auth/[...nextauth]	Login
GET	/api/auth/me	Current user
🏛️ Heritage Sites
Method	Endpoint	Description
GET	/api/heritage-sites	Get all sites
GET	/api/heritage-sites/[id]	Site details
POST	/api/heritage-sites/[id]/visit	Mark visit
🍽️ Restaurants
Method	Endpoint	Description
GET	/api/restaurants	List restaurants
GET	/api/restaurants/[id]	Restaurant details
POST	/api/restaurants/[id]/reviews	Add review
🤝 Travel Matching
Method	Endpoint	Description
GET	/api/matches	Find matches
POST	/api/matches/[id]/like	Like user
POST	/api/matches/[id]/pass	Pass user
GET	/api/matches/mutual	Mutual matches
🧭 Trips
Method	Endpoint	Description
GET	/api/trips	List trips
POST	/api/trips	Create trip
GET	/api/trips/[id]	Get trip
PUT	/api/trips/[id]	Update trip
DELETE	/api/trips/[id]	Delete trip
POST	/api/trips/suggest	AI trip planner
🏆 Gamification
Method	Endpoint	Description
GET	/api/badges	List badges
GET	/api/quests	List quests
POST	/api/quests/[id]/complete	Complete quest
GET	/api/leaderboard	Leaderboard
🛠️ Admin APIs
Method	Endpoint	Description
POST	/api/admin/auth	Admin login
GET	/api/admin/stats	Dashboard stats
CRUD	/api/admin/sites	Heritage sites
CRUD	/api/admin/restaurants	Restaurants
CRUD	/api/admin/badges	Badges
CRUD	/api/admin/quests	Quests
🌍 Geocoding
Method	Endpoint	Description
GET	/api/geocode?place=name	Get coordinates
🎙️ Voice Assistant
Method	Endpoint	Description
POST	/api/chat	AI voice assistant
🧰 Scripts
npm run dev          # Start dev server
npm run build        # Production build
npm run start        # Start production server
npm run db:generate  # Prisma client
npm run db:push      # Sync DB schema
npm run db:seed      # Seed database
npm run db:studio    # Prisma Studio

🧱 Tech Stack
Category	Technology
Framework	Next.js 16 (App Router)
Language	TypeScript
Database	MySQL + Prisma
Auth	NextAuth.js
UI	Tailwind CSS, shadcn/ui, Radix UI
Maps	OpenStreetMap + Nominatim
AI	Gemini API + OpenRouter
Voice	Web Speech API
🔐 Environment Variables
Variable	Required
DATABASE_URL	✅
NEXTAUTH_SECRET	✅
NEXTAUTH_URL	✅
ADMIN_PASSWORD	✅
GEMINI_API_KEY	Optional
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY	Optional
OPENROUTER_API_KEY	✅
📜 License

MIT License
Free to use for learning, projects, and experimentation.

❤️ Built With Passion for Kolkata

A modern digital gateway to explore the culture, history, and stories of Kolkata 🇮🇳

