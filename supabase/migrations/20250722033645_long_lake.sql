/*
  # Add description field to profiles table

  1. Changes
    - Add description column to profiles table
    - Set default value to empty string
    - Update existing profiles with empty descriptions

  2. Security
    - No changes to RLS policies needed as existing policies cover the new column
*/

DO $$ 
BEGIN
  -- Add description column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'description'
  ) THEN
    ALTER TABLE profiles ADD COLUMN description text NOT NULL DEFAULT '';
  END IF;

  -- Update existing profiles with empty descriptions
  UPDATE profiles 
  SET description = '' 
  WHERE description IS NULL;
END $$;