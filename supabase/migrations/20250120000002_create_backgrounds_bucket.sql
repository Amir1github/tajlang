-- Create backgrounds bucket for storing user background images
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'backgrounds',
  'backgrounds', 
  true,
  5242880, -- 5MB limit
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
);

-- Create policy for authenticated users to upload their own background images
CREATE POLICY "Users can upload their own background images" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'backgrounds' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Create policy for public read access to background images
CREATE POLICY "Background images are publicly readable" ON storage.objects
FOR SELECT USING (bucket_id = 'backgrounds');

-- Create policy for users to update their own background images
CREATE POLICY "Users can update their own background images" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'backgrounds' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Create policy for users to delete their own background images
CREATE POLICY "Users can delete their own background images" ON storage.objects
FOR DELETE USING (
  bucket_id = 'backgrounds' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);
