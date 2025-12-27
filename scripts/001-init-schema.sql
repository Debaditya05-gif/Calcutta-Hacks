-- Initial database schema for Kolkata Explorer app

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  avatar_url TEXT,
  bio TEXT,
  age INT,
  gender VARCHAR(50),
  interests TEXT[], -- Array of interests
  travel_style VARCHAR(50), -- e.g., 'adventurous', 'cultural', 'luxury'
  is_solo_traveler BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Heritage Sites table
CREATE TABLE IF NOT EXISTS heritage_sites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(100), -- e.g., 'Monument', 'Cemetery', 'Building'
  latitude FLOAT NOT NULL,
  longitude FLOAT NOT NULL,
  address TEXT,
  entry_fee INT,
  opening_hours VARCHAR(255),
  best_time_to_visit TEXT,
  historical_significance TEXT,
  image_url TEXT,
  rating FLOAT DEFAULT 0,
  visit_count INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Restaurants table
CREATE TABLE IF NOT EXISTS restaurants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  cuisine_type TEXT[], -- Array of cuisines
  latitude FLOAT NOT NULL,
  longitude FLOAT NOT NULL,
  address TEXT,
  price_range VARCHAR(50), -- e.g., 'budget', 'moderate', 'luxury'
  rating FLOAT DEFAULT 0,
  review_count INT DEFAULT 0,
  image_url TEXT,
  avg_cost_per_person INT,
  specialties TEXT[],
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Routes table (Heritage site to Restaurant paths)
CREATE TABLE IF NOT EXISTS routes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  heritage_site_id UUID NOT NULL REFERENCES heritage_sites(id),
  restaurant_id UUID NOT NULL REFERENCES restaurants(id),
  distance_km FLOAT,
  travel_time_minutes INT,
  description TEXT,
  route_coordinates JSONB, -- Stores waypoints
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Travel Matches table
CREATE TABLE IF NOT EXISTS travel_matches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id_1 UUID NOT NULL REFERENCES users(id),
  user_id_2 UUID NOT NULL REFERENCES users(id),
  compatibility_score INT,
  status VARCHAR(50), -- 'pending', 'accepted', 'declined', 'matched'
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Trip Plans table
CREATE TABLE IF NOT EXISTS trip_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id),
  name VARCHAR(255) NOT NULL,
  start_date DATE,
  end_date DATE,
  budget INT,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Trip Itinerary Items table
CREATE TABLE IF NOT EXISTS trip_itinerary_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trip_plan_id UUID NOT NULL REFERENCES trip_plans(id),
  heritage_site_id UUID REFERENCES heritage_sites(id),
  restaurant_id UUID REFERENCES restaurants(id),
  order_index INT,
  date DATE,
  estimated_cost INT,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Gamification Badges table
CREATE TABLE IF NOT EXISTS badges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  icon_url TEXT,
  requirement_type VARCHAR(100), -- e.g., 'visits', 'quests', 'social'
  requirement_value INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User Badges table
CREATE TABLE IF NOT EXISTS user_badges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id),
  badge_id UUID NOT NULL REFERENCES badges(id),
  unlocked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, badge_id)
);

-- Heritage Quests table
CREATE TABLE IF NOT EXISTS heritage_quests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  heritage_site_id UUID NOT NULL REFERENCES heritage_sites(id),
  reward_points INT,
  reward_discount INT, -- Discount percentage at nearby cafe
  difficulty_level VARCHAR(50), -- 'easy', 'medium', 'hard'
  clue TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User Quest Progress table
CREATE TABLE IF NOT EXISTS user_quest_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id),
  quest_id UUID NOT NULL REFERENCES heritage_quests(id),
  status VARCHAR(50), -- 'active', 'completed', 'abandoned'
  started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  completed_at TIMESTAMP,
  UNIQUE(user_id, quest_id)
);

-- Restaurant Reviews table
CREATE TABLE IF NOT EXISTS restaurant_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id UUID NOT NULL REFERENCES restaurants(id),
  user_id UUID NOT NULL REFERENCES users(id),
  rating INT CHECK (rating >= 1 AND rating <= 5),
  review_text TEXT,
  dishes_tried TEXT[],
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better query performance
CREATE INDEX idx_heritage_sites_location ON heritage_sites(latitude, longitude);
CREATE INDEX idx_restaurants_location ON restaurants(latitude, longitude);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_trip_plans_user ON trip_plans(user_id);
CREATE INDEX idx_travel_matches_user ON travel_matches(user_id_1, user_id_2);
