-- Добавить поддержку пользовательских слов
-- Пользовательские слова будут иметь level_id = NULL

-- Создать индекс для оптимизации запросов пользовательских слов
CREATE INDEX IF NOT EXISTS idx_words_user_created ON words(level_id) WHERE level_id IS NULL;

-- Добавить комментарий к полю level_id для ясности
COMMENT ON COLUMN words.level_id IS 'ID уровня, к которому привязано слово. NULL для пользовательских слов';

-- Создать функцию для получения изученных слов пользователя
CREATE OR REPLACE FUNCTION get_user_studied_words(user_completed_levels UUID[])
RETURNS TABLE (
  id UUID,
  level_id UUID,
  tajik TEXT,
  english TEXT,
  russian TEXT,
  explanation TEXT,
  ru_explanation TEXT,
  examples TEXT[],
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    w.id,
    w.level_id,
    w.tajik,
    w.english,
    w.russian,
    w.explanation,
    w.ru_explanation,
    w.examples,
    w.created_at,
    w.updated_at
  FROM words w
  WHERE w.level_id = ANY(user_completed_levels)
  ORDER BY w.tajik;
END;
$$ LANGUAGE plpgsql;

-- Создать функцию для добавления пользовательского слова
CREATE OR REPLACE FUNCTION add_user_word(
  p_tajik TEXT,
  p_english TEXT,
  p_russian TEXT DEFAULT '',
  p_explanation TEXT DEFAULT '',
  p_ru_explanation TEXT DEFAULT '',
  p_examples TEXT[] DEFAULT '{}'
) RETURNS UUID AS $$
DECLARE
  new_word_id UUID;
BEGIN
  INSERT INTO words (
    level_id,
    tajik,
    english,
    russian,
    explanation,
    ru_explanation,
    examples
  ) VALUES (
    NULL, -- Пользовательские слова не привязаны к уровню
    p_tajik,
    p_english,
    p_russian,
    p_explanation,
    p_ru_explanation,
    p_examples
  ) RETURNING id INTO new_word_id;
  
  RETURN new_word_id;
END;
$$ LANGUAGE plpgsql;
