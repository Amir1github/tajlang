/*
  # Add explanation column to words table

  1. Changes
    - Add `explanation` column to `words` table
    - Update existing word entries with empty explanations

  2. Security
    - No security changes needed as existing RLS policies cover the new column
*/

DO $$ 
BEGIN
  -- Add explanation column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'words' AND column_name = 'explanation'
  ) THEN
    ALTER TABLE words ADD COLUMN explanation text DEFAULT '';

    -- Update existing entries with empty explanations
    UPDATE words SET explanation = '' WHERE explanation IS NULL;
  END IF;
END $$;