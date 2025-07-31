/*
  # Add explanations and examples for family words

  1. Changes
    - Add explanations and examples for family-related words
    - Update existing word data with more context
*/

DO $$ 
BEGIN
  -- Update family-related words with explanations and examples
  UPDATE words 
  SET 
    explanation = 'The formal word for father. Used both in direct address and when referring to one''s father.',
    examples = ARRAY[
      'Падари ман духтур аст. - My father is a doctor.',
      'Падарҷон, ба хона биёед! - Dear father, come home!'
    ]
  WHERE tajik = 'Падар';

  UPDATE words 
  SET 
    explanation = 'The word for mother. Often used with the endearing suffix -ҷон to show affection.',
    examples = ARRAY[
      'Модари ман омӯзгор аст. - My mother is a teacher.',
      'Модарҷон, ман шуморо дӯст медорам! - Dear mother, I love you!'
    ]
  WHERE tajik = 'Модар';

  UPDATE words 
  SET 
    explanation = 'The word for brother. Can be used for both older and younger brothers, though specific terms exist for each.',
    examples = ARRAY[
      'Бародари ман дар донишгоҳ мехонад. - My brother studies at university.',
      'Ман як бародар дорам. - I have one brother.'
    ]
  WHERE tajik = 'Бародар';

  UPDATE words 
  SET 
    explanation = 'The word for sister. Like brother, can be used for both older and younger sisters.',
    examples = ARRAY[
      'Хоҳари ман дар мактаб мехонад. - My sister studies at school.',
      'Ман ду хоҳар дорам. - I have two sisters.'
    ]
  WHERE tajik = 'Хоҳар';
END $$;