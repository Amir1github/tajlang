/*
  # Add explanation and examples columns to words table

  1. Changes
    - Add `explanation` column to store word explanations
    - Add `examples` column to store usage examples
    - Update existing words with explanations and examples

  2. Data Updates
    - Add explanations for basic words
    - Add usage examples in both Tajik and English
*/

DO $$ 
BEGIN
  -- Add explanation column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'words' AND column_name = 'explanation'
  ) THEN
    ALTER TABLE words ADD COLUMN explanation text DEFAULT '';
  END IF;

  -- Add examples column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'words' AND column_name = 'examples'
  ) THEN
    ALTER TABLE words ADD COLUMN examples text[] DEFAULT '{}';
  END IF;

  -- Update existing words with explanations and examples
  UPDATE words 
  SET 
    explanation = 'A formal greeting used throughout the day. Shows respect and politeness.',
    examples = ARRAY[
      'Салом, устод! - Hello, teacher!',
      'Салом алейкум! - Peace be upon you (formal greeting)'
    ]
  WHERE tajik = 'Салом';

  UPDATE words 
  SET 
    explanation = 'A polite way to say goodbye. Can be used in both formal and informal situations.',
    examples = ARRAY[
      'Хайр, то пагоҳ! - Goodbye, see you tomorrow!',
      'Хайр, сафари хуш! - Goodbye, have a good journey!'
    ]
  WHERE tajik = 'Хайр';

  UPDATE words 
  SET 
    explanation = 'An expression of gratitude. Can be emphasized with "калон" (big) for "thank you very much".',
    examples = ARRAY[
      'Рахмат барои таваҷҷӯҳ! - Thank you for your attention!',
      'Рахмати калон! - Thank you very much!'
    ]
  WHERE tajik = 'Рахмат';

  UPDATE words 
  SET 
    explanation = 'A polite word used when making requests or showing respect.',
    examples = ARRAY[
      'Лутфан, ба ман кӯмак кунед. - Please help me.',
      'Лутфан, такрор кунед. - Please repeat.'
    ]
  WHERE tajik = 'Лутфан';

  -- Set default values for any remaining words
  UPDATE words 
  SET 
    explanation = COALESCE(explanation, ''),
    examples = COALESCE(examples, '{}')
  WHERE explanation IS NULL OR examples IS NULL;

END $$;