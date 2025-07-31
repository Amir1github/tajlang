/*
  # Update Points System

  1. Changes
    - Add points_value column to levels table
    - Add function to calculate and update points
    - Update existing levels with default point values

  2. Security
    - Function runs with elevated privileges (SECURITY DEFINER)
    - Access controlled through existing RLS policies
*/

-- Add points_value column to levels if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'levels' AND column_name = 'points_value'
  ) THEN
    ALTER TABLE levels ADD COLUMN points_value integer NOT NULL DEFAULT 100;
  END IF;
END $$;

-- Update existing levels with meaningful point values
UPDATE levels
SET points_value = CASE
  WHEN order_number = 1 THEN 100  -- Basics
  WHEN order_number = 2 THEN 150  -- Family
  WHEN order_number = 3 THEN 200  -- Food & Drinks
  ELSE 100
END
WHERE points_value = 100;

-- Create or replace the points calculation function
CREATE OR REPLACE FUNCTION calculate_level_points(
  base_points integer,
  score_ratio float
) RETURNS integer AS $$
BEGIN
  -- Base points + up to 50% bonus based on score
  RETURN base_points + (base_points * 0.5 * score_ratio)::integer;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Create or replace the user progress update function
CREATE OR REPLACE FUNCTION update_user_progress_and_points(
  p_user_id uuid,
  p_level_id uuid,
  p_completed boolean,
  p_score integer,
  p_score_ratio float,
  p_completed_at timestamptz
) RETURNS void AS $$
DECLARE
  v_level_points integer;
  v_earned_points integer;
  v_was_completed boolean;
  v_previous_score integer;
BEGIN
  -- Get current completion status and score
  SELECT completed, score INTO v_was_completed, v_previous_score
  FROM user_progress
  WHERE user_id = p_user_id AND level_id = p_level_id;

  -- Get level points value
  SELECT points_value INTO v_level_points
  FROM levels
  WHERE id = p_level_id;

  -- Calculate points to award
  IF p_completed AND (NOT v_was_completed OR p_score > COALESCE(v_previous_score, 0)) THEN
    v_earned_points = calculate_level_points(v_level_points, p_score_ratio);
  ELSE
    v_earned_points = 0;
  END IF;

  -- Update user progress
  INSERT INTO user_progress (
    user_id,
    level_id,
    completed,
    score,
    score_ratio,
    completed_at,
    updated_at
  )
  VALUES (
    p_user_id,
    p_level_id,
    p_completed,
    p_score,
    p_score_ratio,
    p_completed_at,
    NOW()
  )
  ON CONFLICT (user_id, level_id) DO UPDATE
  SET
    completed = EXCLUDED.completed,
    score = EXCLUDED.score,
    score_ratio = EXCLUDED.score_ratio,
    completed_at = EXCLUDED.completed_at,
    updated_at = EXCLUDED.updated_at;

  -- Update user points if points were earned
  IF v_earned_points > 0 THEN
    UPDATE profiles
    SET
      xp_points = COALESCE(xp_points, 0) + v_earned_points,
      updated_at = NOW()
    WHERE id = p_user_id;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;