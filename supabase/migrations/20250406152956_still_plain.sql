/*
  # Add XP increment function

  1. New Functions
    - `increment`: Updates and returns a user's XP points
      - Parameters:
        - `amount` (integer): Amount of XP to add
        - `user_id` (uuid): ID of the user to update
      - Returns: The updated XP points value

  2. Security
    - Function is marked as SECURITY DEFINER to run with elevated privileges
    - Access is controlled through RLS policies
*/

CREATE OR REPLACE FUNCTION increment(amount INTEGER, user_id UUID)
RETURNS INTEGER AS $$
  UPDATE profiles 
  SET xp_points = xp_points + amount 
  WHERE id = user_id 
  RETURNING xp_points;
$$ LANGUAGE SQL SECURITY DEFINER;