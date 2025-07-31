/*
  # Initial Schema Setup for Language Learning App

  1. New Tables
    - `profiles`
      - `id` (uuid, primary key, references auth.users)
      - `username` (text)
      - `avatar_url` (text)
      - `xp_points` (integer)
      - `current_streak` (integer)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `levels`
      - `id` (uuid, primary key)
      - `title` (text)
      - `description` (text)
      - `order_number` (integer)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `words`
      - `id` (uuid, primary key)
      - `level_id` (uuid, references levels)
      - `tajik` (text)
      - `english` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `questions`
      - `id` (uuid, primary key)
      - `level_id` (uuid, references levels)
      - `question_text` (text)
      - `correct_answer` (text)
      - `options` (text[])
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `user_progress`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles)
      - `level_id` (uuid, references levels)
      - `completed` (boolean)
      - `score` (integer)
      - `completed_at` (timestamp)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `achievements`
      - `id` (uuid, primary key)
      - `title` (text)
      - `description` (text)
      - `icon_name` (text)
      - `created_at` (timestamp)

    - `user_achievements`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles)
      - `achievement_id` (uuid, references achievements)
      - `earned_at` (timestamp)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Create tables if they don't exist
DO $$ 
BEGIN
  -- Create profiles table if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'profiles') THEN
    CREATE TABLE profiles (
      id uuid PRIMARY KEY REFERENCES auth.users,
      username text UNIQUE NOT NULL,
      avatar_url text,
      xp_points integer DEFAULT 0,
      current_streak integer DEFAULT 0,
      created_at timestamptz DEFAULT now(),
      updated_at timestamptz DEFAULT now()
    );
  END IF;

  -- Create levels table if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'levels') THEN
    CREATE TABLE levels (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      title text NOT NULL,
      description text NOT NULL,
      order_number integer NOT NULL,
      created_at timestamptz DEFAULT now(),
      updated_at timestamptz DEFAULT now()
    );
  END IF;

  -- Create words table if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'words') THEN
    CREATE TABLE words (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      level_id uuid REFERENCES levels ON DELETE CASCADE,
      tajik text NOT NULL,
      english text NOT NULL,
      created_at timestamptz DEFAULT now(),
      updated_at timestamptz DEFAULT now()
    );
  END IF;

  -- Create questions table if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'questions') THEN
    CREATE TABLE questions (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      level_id uuid REFERENCES levels ON DELETE CASCADE,
      question_text text NOT NULL,
      correct_answer text NOT NULL,
      options text[] NOT NULL,
      created_at timestamptz DEFAULT now(),
      updated_at timestamptz DEFAULT now()
    );
  END IF;

  -- Create user_progress table if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'user_progress') THEN
    CREATE TABLE user_progress (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id uuid REFERENCES profiles ON DELETE CASCADE,
      level_id uuid REFERENCES levels ON DELETE CASCADE,
      completed boolean DEFAULT false,
      score integer DEFAULT 0,
      completed_at timestamptz,
      created_at timestamptz DEFAULT now(),
      updated_at timestamptz DEFAULT now(),
      UNIQUE(user_id, level_id)
    );
  END IF;

  -- Create achievements table if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'achievements') THEN
    CREATE TABLE achievements (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      title text NOT NULL,
      description text NOT NULL,
      icon_name text NOT NULL,
      created_at timestamptz DEFAULT now()
    );
  END IF;

  -- Create user_achievements table if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'user_achievements') THEN
    CREATE TABLE user_achievements (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id uuid REFERENCES profiles ON DELETE CASCADE,
      achievement_id uuid REFERENCES achievements ON DELETE CASCADE,
      earned_at timestamptz DEFAULT now(),
      created_at timestamptz DEFAULT now(),
      UNIQUE(user_id, achievement_id)
    );
  END IF;
END $$;

-- Enable Row Level Security
DO $$ 
BEGIN
  -- Enable RLS for each table
  EXECUTE 'ALTER TABLE profiles ENABLE ROW LEVEL SECURITY';
  EXECUTE 'ALTER TABLE levels ENABLE ROW LEVEL SECURITY';
  EXECUTE 'ALTER TABLE words ENABLE ROW LEVEL SECURITY';
  EXECUTE 'ALTER TABLE questions ENABLE ROW LEVEL SECURITY';
  EXECUTE 'ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY';
  EXECUTE 'ALTER TABLE achievements ENABLE ROW LEVEL SECURITY';
  EXECUTE 'ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY';
END $$;

-- Create policies if they don't exist
DO $$ 
BEGIN
  -- Levels policies
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can read all levels') THEN
    CREATE POLICY "Users can read all levels" ON levels
      FOR SELECT TO authenticated
      USING (true);
  END IF;

  -- Words policies
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can read all words') THEN
    CREATE POLICY "Users can read all words" ON words
      FOR SELECT TO authenticated
      USING (true);
  END IF;

  -- Questions policies
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can read all questions') THEN
    CREATE POLICY "Users can read all questions" ON questions
      FOR SELECT TO authenticated
      USING (true);
  END IF;

  -- Achievements policies
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can read all achievements') THEN
    CREATE POLICY "Users can read all achievements" ON achievements
      FOR SELECT TO authenticated
      USING (true);
  END IF;

  -- Profiles policies
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can read own profile') THEN
    CREATE POLICY "Users can read own profile" ON profiles
      FOR SELECT TO authenticated
      USING (auth.uid() = id);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can update own profile') THEN
    CREATE POLICY "Users can update own profile" ON profiles
      FOR UPDATE TO authenticated
      USING (auth.uid() = id)
      WITH CHECK (auth.uid() = id);
  END IF;

  -- User progress policies
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can read own progress') THEN
    CREATE POLICY "Users can read own progress" ON user_progress
      FOR SELECT TO authenticated
      USING (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can update own progress') THEN
    CREATE POLICY "Users can update own progress" ON user_progress
      FOR UPDATE TO authenticated
      USING (auth.uid() = user_id)
      WITH CHECK (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can insert own progress') THEN
    CREATE POLICY "Users can insert own progress" ON user_progress
      FOR INSERT TO authenticated
      WITH CHECK (auth.uid() = user_id);
  END IF;

  -- User achievements policies
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can read own achievements') THEN
    CREATE POLICY "Users can read own achievements" ON user_achievements
      FOR SELECT TO authenticated
      USING (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can insert own achievements') THEN
    CREATE POLICY "Users can insert own achievements" ON user_achievements
      FOR INSERT TO authenticated
      WITH CHECK (auth.uid() = user_id);
  END IF;
END $$;

-- Insert initial data if not exists
DO $$
DECLARE
  basics_id uuid;
  family_id uuid;
BEGIN
  -- Insert levels if they don't exist
  IF NOT EXISTS (SELECT 1 FROM levels WHERE title = 'Basics') THEN
    INSERT INTO levels (title, description, order_number) VALUES
      ('Basics', 'Learn basic greetings and numbers', 1)
    RETURNING id INTO basics_id;

    -- Insert words for Basics level
    INSERT INTO words (level_id, tajik, english) VALUES
      (basics_id, 'Салом', 'Hello'),
      (basics_id, 'Хайр', 'Goodbye'),
      (basics_id, 'Рахмат', 'Thank you'),
      (basics_id, 'Лутфан', 'Please');

    -- Insert questions for Basics level
    INSERT INTO questions (level_id, question_text, correct_answer, options) VALUES
      (basics_id, 'What does "Салом" mean?', 'Hello', ARRAY['Hello', 'Goodbye', 'Thank you', 'Please']),
      (basics_id, 'How do you say "Thank you" in Tajik?', 'Рахмат', ARRAY['Салом', 'Хайр', 'Рахмат', 'Лутфан']);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM levels WHERE title = 'Family') THEN
    INSERT INTO levels (title, description, order_number) VALUES
      ('Family', 'Learn family-related words and phrases', 2)
    RETURNING id INTO family_id;

    -- Insert words for Family level
    INSERT INTO words (level_id, tajik, english) VALUES
      (family_id, 'Падар', 'Father'),
      (family_id, 'Модар', 'Mother'),
      (family_id, 'Бародар', 'Brother'),
      (family_id, 'Хоҳар', 'Sister');

    -- Insert questions for Family level
    INSERT INTO questions (level_id, question_text, correct_answer, options) VALUES
      (family_id, 'What does "Падар" mean?', 'Father', ARRAY['Mother', 'Father', 'Brother', 'Sister']),
      (family_id, 'How do you say "Sister" in Tajik?', 'Хоҳар', ARRAY['Падар', 'Модар', 'Бародар', 'Хоҳар']);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM levels WHERE title = 'Food & Drinks') THEN
    INSERT INTO levels (title, description, order_number) VALUES
      ('Food & Drinks', 'Learn words related to food and beverages', 3);
  END IF;

  -- Insert achievements if they don't exist
  IF NOT EXISTS (SELECT 1 FROM achievements WHERE title = 'First Perfect Score') THEN
    INSERT INTO achievements (title, description, icon_name) VALUES
      ('First Perfect Score', 'Complete a level with 100% accuracy', 'award'),
      ('Quick Learner', 'Complete 3 levels in one day', 'zap'),
      ('Streak Master', 'Maintain a 5-day learning streak', 'flame');
  END IF;
END $$;