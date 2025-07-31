import { useState, useEffect, useRef } from 'react';
import { Animated, Easing } from 'react-native';
import { updateUserProgress } from '@/lib/supabase';
import { shuffleArray, validateAnswer, hasPassedTest } from '@/utils/testHelpers';
import type { Question, TestState } from '@/types/level';

export function useTestLogic(
  questions: Question[],
  levelId: string | undefined,
  userId: string | undefined
) {
  // Основные состояния теста
  const [showInstructions, setShowInstructions] = useState(true);
  const [showTest, setShowTest] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [showAnswerModal, setShowAnswerModal] = useState(false);
  
  // Состояния прогресса
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [hasAttempted, setHasAttempted] = useState(false);
  const [hasPassed, setHasPassed] = useState(false);
  const [answersStatus, setAnswersStatus] = useState<boolean[]>([]);
  const [randomizedQuestions, setRandomizedQuestions] = useState<Question[]>([]);
  
  // Состояния модального окна
  const [correctAnswer, setCorrectAnswer] = useState('');
  const [userAnswer, setUserAnswer] = useState('');
  
  // Системные состояния
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Анимация для модального окна
  const slideAnim = useRef(new Animated.Value(0)).current;

  // Инициализация вопросов
  useEffect(() => {
    if (questions.length > 0) {
      setRandomizedQuestions(shuffleArray(questions));
      setAnswersStatus(new Array(questions.length).fill(false));
    }
  }, [questions]);

  // Анимация модального окна
  useEffect(() => {
    if (showAnswerModal) {
      Animated.timing(slideAnim, {
        toValue: 1,
        duration: 300,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }).start();
    } else {
      slideAnim.setValue(0);
    }
  }, [showAnswerModal]);
  const [answeredQuestions, setAnsweredQuestions] = useState<{ [index: number]: boolean }>({});


  // Обработка ответа на вопрос
  const handleAnswer = async (isCorrect: boolean, answer: string = '') => {
  if (!levelId || !userId || updating || randomizedQuestions.length === 0) return;

  try {
    const newAnswersStatus = [...answersStatus];
    const alreadyAnsweredCorrectly = newAnswersStatus[currentQuestion] === true;

    // Сохраняем ответ
    newAnswersStatus[currentQuestion] = isCorrect;
    setAnswersStatus(newAnswersStatus);
    setUserAnswer(answer);

    // Обновляем счёт только если это первый правильный ответ
    if (isCorrect && !alreadyAnsweredCorrectly) {
      setScore(score + 1);
    }

    if (!isCorrect) {
      setCorrectAnswer(randomizedQuestions[currentQuestion]?.correct_answer || '');
      setShowAnswerModal(true);
    } else if (currentQuestion < randomizedQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      await handleTestCompletion(score + (!alreadyAnsweredCorrectly && isCorrect ? 1 : 0));
    }
  } catch (error) {
    console.error('Error handling answer:', error);
    setError('An error occurred while processing your answer. Please try again.');
  }
};


  // Обработка ответа для fill_in_blank вопросов
  const handleFillInBlankAnswer = (userAnswer: string) => {
    const currentQ = randomizedQuestions[currentQuestion];
    if (!currentQ) return;

    const isCorrect = validateAnswer(
      userAnswer,
      currentQ.correct_answer,
      currentQ.alternative_answers
    );

    handleAnswer(isCorrect, userAnswer);
  };

  // Закрытие модального окна
  const handleModalClose = () => {
    try {
      setShowAnswerModal(false);
      if (currentQuestion < randomizedQuestions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
      } else {
        handleTestCompletion(score).catch(error => {
          console.error('Error completing test:', error);
          setError('An error occurred while completing the test. Please try again.');
        });
      }
    } catch (error) {
      console.error('Error closing modal:', error);
    }
  };

  // Завершение теста
  const handleTestCompletion = async (finalScore: number) => {
    const passed = hasPassedTest(finalScore, randomizedQuestions.length);
    setHasPassed(passed);
    setHasAttempted(true);
    setShowResults(true);

    try {
      setUpdating(true);
      setError(null);
      
      const { error } = await updateUserProgress(
        userId!,
        levelId!,
        finalScore / randomizedQuestions.length,
        passed
      );

      if (error) throw error;
    } catch (error) {
      console.error('Error updating progress:', error);
      setError('Failed to update progress. Please try again.');
    } finally {
      setUpdating(false);
    }
  };

  // Переход к предыдущему вопросу
  const handlePreviousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  // Начало теста
  const startTest = () => {
    setShowInstructions(false);
    setShowTest(true);
  };

  // Возврат к тесту (после результатов)
  const backToTest = () => {
    setShowTest(false);
    setCurrentQuestion(0);
    setScore(0);
    setShowResults(false);
    setError(null);
    setHasAttempted(false);
    setAnswersStatus(new Array(randomizedQuestions.length).fill(false));
  };

  // Сброс всего теста
  const resetTest = () => {
    setShowInstructions(true);
    setShowTest(false);
    setShowResults(false);
    setShowAnswerModal(false);
    setCurrentQuestion(0);
    setScore(0);
    setHasAttempted(false);
    setHasPassed(false);
    setAnswersStatus(new Array(questions.length).fill(false));
    setCorrectAnswer('');
    setUserAnswer('');
    setError(null);
    
    // Перемешиваем вопросы заново
    if (questions.length > 0) {
      setRandomizedQuestions(shuffleArray(questions));
    }
  };

  return {
    // Состояния UI
    showInstructions,
    showTest,
    showResults,
    showAnswerModal,
    
    // Состояния прогресса
    currentQuestion,
    score,
    hasAttempted,
    hasPassed,
    answersStatus,
    randomizedQuestions,
    
    // Состояния модального окна
    correctAnswer,
    userAnswer,
    
    // Системные состояния
    updating,
    error,
    slideAnim,
    
    // Действия
    handleAnswer,
    handleFillInBlankAnswer,
    handleModalClose,
    handlePreviousQuestion,
    startTest,
    backToTest,
    resetTest,
    setShowInstructions,
  };
}