# 🏛️ Kolkata Explorer

A full-stack Next.js tourism app for discovering Kolkata's heritage sites, restaurants, and connecting with fellow travelers. Features an AI-powered trip planner and a comprehensive admin panel for content management.

![Next.js](https://img.shields.io/badge/Next.js-16-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Prisma](https://img.shields.io/badge/Prisma-5-2D3748)
![MySQL](https://img.shields.io/badge/MySQL-8-4479A1)

## ✨ Features

### 🗺️ Heritage Explorer
- Interactive OpenStreetMap of Kolkata's iconic heritage sites
- Detailed information about each location
- Track your visits and earn badges
- Real-time data from database

### 🍽️ Restaurant Guide
- Discover local cuisines and heritage restaurants
- Filter by cuisine, price, and rating
- Read and write reviews

### 👥 Travel Matching
- Find like-minded travel companions
- Compatibility scoring based on interests
- Like/pass matching system

### 📅 Trip Planner
- Build custom itineraries
- AI-powered trip suggestions using Gemini API
- Add heritage sites and restaurants
- Budget tracking

### �️ Voice Assistant
- Real-time voice interaction
- Powered by OpenRouter (Gemini 2.0 Flash)
- Ask about sites, restaurants, or trip planning
- Native Web Speech API integration

### � Gamification
- Unlock "Bhadralok" badges
- Complete heritage scavenger hunts
- Earn points and rewards
- Weekly leaderboard

### 🔐 Admin Panel
- Password-protected admin dashboard (`/admin`)
- Manage users, heritage sites, restaurants
- Create and manage badges and quests
- Auto-geocoding for new locations using OpenStreetMap
- Dashboard with key statistics

#### Heritage Sites Management
- **Add/Edit/Delete** heritage sites with full details:
  - Site Name, Category (Monument, Temple, Museum, etc.)
  - Short Description & Full Description
  - Latitude/Longitude (auto-filled via geocoding)
  - Address, Entry Fee, Opening Hours
  - Best Time to Visit
  - Historical Significance
  - Rating (0-5 stars)
  - Image URL

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- MySQL (via XAMPP or standalone)

### Installation

1. **Clone and install dependencies**
```bash
cd kolkata-explorer-app
npm install
```

2. **Configure environment**
```bash
# Copy the example env file
cp env.example .env

# Edit .env with your credentials
DATABASE_URL="mysql://root:@localhost:3306/kolkata_explorer"
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"
GEMINI_API_KEY="your-gemini-api-key"
ADMIN_PASSWORD="your-admin-password"
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY="your-google-maps-key"
OPENROUTER_API_KEY="your-openrouter-api-key"
```

3. **Set up database**
```bash
# Generate Prisma client
npm run db:generate

# Push schema to MySQL
npm run db:push

# Seed with sample data
npm run db:seed
```

4. **Start development server**
```bash
npm run dev
```

5. **Open http://localhost:3000**

### Demo Login
```
Email: priya@kolkata.com
Password: password123
```

### Admin Panel
```
URL: http://localhost:3000/admin
Password: kolkata2024 (or as set in .env)
```

## 📁 Project Structure

```
├── app/
│   ├── api/                 # Backend API routes
│   │   ├── auth/            # Authentication
│   │   ├── heritage-sites/  # Heritage sites CRUD
│   │   ├── restaurants/     # Restaurants & reviews
│   │   ├── matches/         # Travel matching
│   │   ├── trips/           # Trip planner
│   │   ├── badges/          # Badges API
│   │   ├── quests/          # Heritage quests
│   │   ├── leaderboard/     # Leaderboard
│   │   ├── geocode/         # Location geocoding
│   │   └── admin/           # Admin APIs
│   ├── admin/               # Admin panel pages
│   │   ├── dashboard/       # Admin dashboard
│   │   ├── users/           # User management
│   │   ├── sites/           # Heritage sites management
│   │   ├── restaurants/     # Restaurant management
│   │   ├── badges/          # Badge management
│   │   ├── quests/          # Quest management
│   │   └── settings/        # App settings
│   ├── explore/             # Heritage map page
│   ├── restaurants/         # Restaurant guide
│   ├── matches/             # Travel matching
│   ├── planner/             # Trip planner
│   ├── achievements/        # Badges & quests
│   ├── login/               # Login page
│   └── register/            # Registration page
├── components/              # React components
├── lib/                     # Utilities & Prisma client
├── prisma/
│   ├── schema.prisma        # Database schema
│   └── seed.ts              # Database seeder
└── types/                   # TypeScript definitions
```

## 🔌 API Reference

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/[...nextauth]` | Login (NextAuth) |
| GET | `/api/auth/me` | Get current user |

### Heritage Sites
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/heritage-sites` | List all sites |
| GET | `/api/heritage-sites/[id]` | Get site details |
| POST | `/api/heritage-sites/[id]/visit` | Record visit |

### Restaurants
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/restaurants` | List restaurants |
| GET | `/api/restaurants/[id]` | Get details |
| GET | `/api/restaurants/[id]/reviews` | Get reviews |
| POST | `/api/restaurants/[id]/reviews` | Add review |

### Travel Matching
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/matches` | Get potential matches |
| POST | `/api/matches/[id]/like` | Like user |
| POST | `/api/matches/[id]/pass` | Pass user |
| GET | `/api/matches/mutual` | Get mutual matches |

### Trips
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/trips` | List trips |
| POST | `/api/trips` | Create trip |
| GET | `/api/trips/[id]` | Get trip |
| PUT | `/api/trips/[id]` | Update trip |
| DELETE | `/api/trips/[id]` | Delete trip |
| POST | `/api/trips/suggest` | AI trip suggestions |

### Gamification
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/badges` | Get all badges |
| GET | `/api/quests` | Get all quests |
| POST | `/api/quests/[id]/complete` | Complete quest |
| GET | `/api/leaderboard` | Get leaderboard |

### Admin APIs
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/admin/auth` | Admin login |
| GET | `/api/admin/stats` | Dashboard statistics |
| GET/DELETE | `/api/admin/users` | User management |
| GET/POST/PUT/DELETE | `/api/admin/sites` | Site management |
| GET/POST/DELETE | `/api/admin/restaurants` | Restaurant management |
| GET/POST/DELETE | `/api/admin/badges` | Badge management |
| GET/POST/DELETE | `/api/admin/quests` | Quest management |

### Geocoding
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/geocode?place=name` | Get coordinates for place |

### Voice Assistant
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/chat` | AI Voice Chat (OpenRouter) |

## 🛠️ Scripts

```bash
npm run dev          # Start dev server
npm run build        # Build for production
npm run start        # Start production server
npm run db:generate  # Generate Prisma client
npm run db:push      # Push schema to database
npm run db:seed      # Seed database
npm run db:studio    # Open Prisma Studio
```

## 🔧 Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Database**: MySQL + Prisma ORM
- **Auth**: NextAuth.js
- **Styling**: Tailwind CSS
- **UI**: Radix UI + shadcn/ui
- **Maps**: OpenStreetMap (Nominatim for geocoding)
- **AI**: Google Gemini API (trips) + OpenRouter (voice)

## 🔑 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_URL` | MySQL connection string | Yes |
| `NEXTAUTH_SECRET` | Auth encryption key | Yes |
| `NEXTAUTH_URL` | App URL | Yes |
| `ADMIN_PASSWORD` | Admin panel password | Yes |
| `GEMINI_API_KEY` | Google Gemini API key | Optional |
| `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` | Google Maps API key | Optional |
| `OPENROUTER_API_KEY` | OpenRouter API Key for Voice Assistant | Yes |

## 📄 License

MIT License - feel free to use for learning and personal projects.

---

Built with ❤️ for exploring Kolkata's rich heritage
#   C a l c u t t a - H a c k s  
 