-- MacrosFit Database Schema
-- Run this in your Supabase SQL Editor

-- Meals table
CREATE TABLE IF NOT EXISTS meals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL,
  name TEXT NOT NULL,
  calories INTEGER DEFAULT 0,
  protein FLOAT DEFAULT 0,
  carbs FLOAT DEFAULT 0,
  fat FLOAT DEFAULT 0,
  date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS meals_user_date ON meals(user_id, date);

-- User goals table
CREATE TABLE IF NOT EXISTS user_goals (
  user_id TEXT PRIMARY KEY,
  calories INTEGER DEFAULT 2000,
  protein FLOAT DEFAULT 150,
  carbs FLOAT DEFAULT 200,
  fat FLOAT DEFAULT 65,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Row Level Security (optional - using service role key so not strictly required)
-- ALTER TABLE meals ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE user_goals ENABLE ROW LEVEL SECURITY;
