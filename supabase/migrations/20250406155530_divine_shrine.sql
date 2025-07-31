/*
  # Add examples column to words table

  1. Changes
    - Add `examples` column to `words` table as a text array
    - Update existing word entries with empty example arrays

  2. Security
    - No security changes needed as existing RLS policies cover the new column
*/

DO $$ 
BEGIN
  -- Add examples column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'words' AND column_name = 'examples'
  ) THEN
    ALTER TABLE words ADD COLUMN examples text[] DEFAULT '{}';

    -- Update existing entries with empty example arrays
    UPDATE words SET examples = '{}' WHERE examples IS NULL;

    -- Update example data for existing words
    UPDATE words 
    SET examples = ARRAY[
      'Салом, чӣ хел ҳастед? - Hello, how are you?',
      'Салом, ман хуб ҳастам. - Hello, I am fine.'
    ]
    WHERE tajik = 'Салом';

    UPDATE words 
    SET examples = ARRAY[
      'Хайр, то дидор! - Goodbye, see you later!',
      'Хайр, шаб ба хайр! - Goodbye, good night!'
    ]
    WHERE tajik = 'Хайр';

    UPDATE words 
    SET examples = ARRAY[
      'Рахмат барои кӯмак! - Thank you for help!',
      'Рахмати калон! - Thank you very much!'
    ]
    WHERE tajik = 'Рахмат';

    -- Add explanations for existing words
    UPDATE words 
    SET explanation = 'A common greeting used throughout the day. Can be used both formally and informally.'
    WHERE tajik = 'Салом';

    UPDATE words 
    SET explanation = 'Used when parting ways. Can be combined with other phrases for specific situations.'
    WHERE tajik = 'Хайр';

    UPDATE words 
    SET explanation = 'The standard way to express gratitude. Can be used in both casual and formal situations.'
    WHERE tajik = 'Рахмат';
  END IF;
END $$;