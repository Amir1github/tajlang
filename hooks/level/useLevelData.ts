import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import type { LevelData } from '@/types/level';
import { useLanguage } from '@/contexts/LanguageContext';

export function useLevelData(levelId: string | undefined, userId: string | undefined) {
  const [levelData, setLevelData] = useState<LevelData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLevelCompleted, setIsLevelCompleted] = useState(false);
  const { language } = useLanguage();

  useEffect(() => {
    if (levelId && userId) {
      fetchLevelData();
      checkLevelCompletion();
    }
  }, [levelId, userId, language]);

  async function fetchLevelData() {
    if (!levelId) return;

    try {
      setLoading(true);
      setError(null);

      const { data: levelData, error: levelError } = await supabase
        .from('levels')
        .select('id, title, description')
        .eq('id', levelId)
        .single();

      if (levelError) throw levelError;
      if (!levelData) throw new Error('Level not found');

      const { data: words, error: wordsError } = await supabase
        .from('words')
        .select('id, tajik, english, explanation, examples, ru_explanation, russian')
        .eq('level_id', levelId);

      if (wordsError) throw wordsError;

      // Выбор таблицы вопросов в зависимости от языка (fallback на questions)
      const questionsTable = language === 'ru' ? 'ru_questions' : 'questions';
      let questions = null as any[] | null;
      let questionsError: any = null;

      const primary = await supabase
        .from(questionsTable)
        .select('id, question_text, correct_answer, options, type, hint, alternative_answers')
        .eq('level_id', levelId);

      if (primary.error) {
        questionsError = primary.error;
      } else {
        questions = primary.data as any[] | null;
      }

      if (questionsError && questionsTable !== 'questions') {
        // Пробуем таблицу по умолчанию, если ru_questions отсутствует
        const fallback = await supabase
          .from('questions')
          .select('id, question_text, correct_answer, options, type, hint, alternative_answers')
          .eq('level_id', levelId);
        if (fallback.error) throw fallback.error;
        questions = fallback.data as any[] | null;
        questionsError = null;
      }
      if (questionsError) throw questionsError;

      const fullLevelData = {
        ...levelData,
        words: words ?? [],
        questions: questions ?? [],
      };

      setLevelData(fullLevelData);
    } catch (error: any) {
      console.error('Error fetching level data:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }

  async function checkLevelCompletion() {
    if (!userId || !levelId) return;

    try {
      const { data, error } = await supabase
        .from('user_progress')
        .select('completed')
        .eq('user_id', userId)
        .eq('level_id', levelId)
        .maybeSingle();

      if (error) throw error;
      setIsLevelCompleted(data?.completed || false);
    } catch (error) {
      console.error('Error checking level completion:', error);
      setIsLevelCompleted(false);
    }
  }

  return {
    levelData,
    loading,
    error,
    isLevelCompleted,
    refetchData: fetchLevelData,
  };
}