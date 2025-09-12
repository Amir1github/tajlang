/**
 * Перемешивает массив используя алгоритм Fisher-Yates
 */
export function shuffleArray<T>(array: T[]): T[] {
  // Проверяем, что array действительно является массивом
  if (!Array.isArray(array)) {
    console.warn('shuffleArray: input is not an array, returning empty array');
    return [];
  }
  
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/**
 * Проверяет правильность ответа с учетом альтернативных вариантов
 */
export function validateAnswer(
  userAnswer: string,
  correctAnswer: string,
  alternativeAnswers?: string[]
): boolean {
  // Логирование для отладки
  console.log('validateAnswer called with:', {
    userAnswer,
    correctAnswer,
    alternativeAnswers,
    alternativeAnswersType: typeof alternativeAnswers,
    isArray: Array.isArray(alternativeAnswers)
  });

  // Проверяем входные параметры
  if (typeof userAnswer !== 'string' || typeof correctAnswer !== 'string') {
    console.warn('validateAnswer: userAnswer or correctAnswer is not a string', {
      userAnswerType: typeof userAnswer,
      correctAnswerType: typeof correctAnswer
    });
    return false;
  }

  const normalizedUserAnswer = userAnswer.trim().toLowerCase();
  const normalizedCorrectAnswer = correctAnswer.trim().toLowerCase();
  
  // Проверяем основной ответ
  if (normalizedUserAnswer === normalizedCorrectAnswer) {
    console.log('validateAnswer: Correct answer matched');
    return true;
  }
  
  // КРИТИЧЕСКИ ВАЖНО: Проверяем альтернативные ответы
  // Сначала проверяем, что alternativeAnswers существует и является массивом
  if (alternativeAnswers != null && Array.isArray(alternativeAnswers) && alternativeAnswers.length > 0) {
    console.log('validateAnswer: Checking alternative answers');
    try {
      const result = alternativeAnswers.some(
        alt => typeof alt === 'string' && alt.trim().toLowerCase() === normalizedUserAnswer
      );
      console.log('validateAnswer: Alternative check result:', result);
      return result;
    } catch (error) {
      console.error('Error in alternative answers check:', error, alternativeAnswers);
      return false;
    }
  } else {
    console.log('validateAnswer: No valid alternative answers to check');
  }
  
  console.log('validateAnswer: No match found');
  return false;
}

/**
 * Вычисляет процент правильных ответов
 */
export function calculateScorePercentage(score: number, totalQuestions: number): number {
  return totalQuestions > 0 ? (score / totalQuestions) * 100 : 0;
}

/**
 * Определяет, прошел ли пользователь тест (100% правильных ответов)
 */
export function hasPassedTest(score: number, totalQuestions: number): boolean {
  return score === totalQuestions;
}