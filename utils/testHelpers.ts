/**
 * Перемешивает массив используя алгоритм Fisher-Yates
 */
export function shuffleArray<T>(array: T[]): T[] {
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
  const normalizedUserAnswer = userAnswer.trim().toLowerCase();
  const normalizedCorrectAnswer = correctAnswer.trim().toLowerCase();
  
  // Проверяем основной ответ
  if (normalizedUserAnswer === normalizedCorrectAnswer) {
    return true;
  }
  
  // Проверяем альтернативные ответы
  if (alternativeAnswers) {
    return alternativeAnswers.some(
      alt => alt.trim().toLowerCase() === normalizedUserAnswer
    );
  }
  
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