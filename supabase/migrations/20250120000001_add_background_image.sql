-- Add background_image column to profiles table
ALTER TABLE profiles 
ADD COLUMN background_image TEXT;

-- Add comment to describe the column
COMMENT ON COLUMN profiles.background_image IS 'URL of the user background image for profile customization';
