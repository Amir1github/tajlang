/*
  # Add function to update user progress and points atomically

  1. New Functions
    - `update_user_progress_and_points`: Updates user progress and points in a single transaction
      - Parameters:
        - `p_user_id` (uuid): User ID
        - `p_level_id` (uuid): Level ID
        - `p_completed` (boolean): Completion status
        - `p_score` (integer): Current score
        - `p_highest_score` (integer): Highest score achieved
        - `p_completed_at` (timestamptz): Completion timestamp
        - `p_points` (integer): Points earned
*/

CREATE OR REPLACE FUNCTION update_user_progress_and_points(
  p_user_id uuid,
  p_level_id uuid,
  p_completed boolean,
  p_score integer,
  p_highest_score integer,
  p_completed_at timestamptz,
  p_points integer
) RETURNS void AS $$
BEGIN
  -- Update user progress
  INSERT INTO user_progress (
    user_id,
    level_id,
    completed,
    score,
    highest_score,
    completed_at,
    updated_at
  )
  VALUES (
    p_user_id,
    p_level_id,
    p_completed,
    p_score,
    p_highest_score,
    p_completed_at,
    NOW()
  )
  ON CONFLICT (user_id, level_id) DO UPDATE
  SET
    completed = EXCLUDED.completed,
    score = EXCLUDED.score,
    highest_score = EXCLUDED.highest_score,
    completed_at = EXCLUDED.completed_at,
    updated_at = EXCLUDED.updated_at;

  -- Update user points if points were earned
  IF p_points > 0 THEN
    UPDATE profiles
    SET
      xp_points = xp_points + p_points,
      updated_at = NOW()
    WHERE id = p_user_id;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;