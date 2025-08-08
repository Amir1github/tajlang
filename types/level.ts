export type Word = {
  id: string;
  tajik: string;
  english: string;
  explanation: string;
  ru_explanation: string;
  russian: string;
  examples: string[];
};

export type Question = {
  id: string;
  question_text: string;
  correct_answer: string;
  options: string[];
  type: 'multiple_choice' | 'fill_in_blank';
  hint?: string;
  alternative_answers?: string[];
};

export type LevelData = {
  id: string;
  title: string;
  description: string;
  words: Word[];
  questions: Question[];
};

export type TestState = {
  showInstructions: boolean;
  showTest: boolean;
  showResults: boolean;
  showAnswerModal: boolean;
  currentQuestion: number;
  score: number;
  hasAttempted: boolean;
  hasPassed: boolean;
  answersStatus: boolean[];
  randomizedQuestions: Question[];
  correctAnswer: string;
  userAnswer: string;
};

// Props для компонентов
export type LevelHeaderProps = {
  title: string;
  hasAttempted: boolean;
  hasPassed: boolean;
  isLevelCompleted: boolean;
  showTest: boolean;
  showResults: boolean;
  onHomePress: () => void;
};

export type WordsSectionProps = {
  words: Word[];
  isLevelCompleted: boolean;
  showInstructions: boolean;
  onStartInstructions: () => void;
  onStartTest: () => void;
  id: string; // Добавлено для передачи ID уровня
};

export type TestSectionProps = {
  questions: Question[];
  currentQuestion: number;
  answersStatus: boolean[];
  onAnswer: (isCorrect: boolean, answer?: string) => void;
  onPreviousQuestion: () => void;
  updating: boolean;
};

export type TestResultsProps = {
  score: number;
  totalQuestions: number;
  hasPassed: boolean;
  error: string | null;
  onBackToTest: () => void;
  onReturnHome: () => void;
};

export type AnswerModalProps = {
  visible: boolean;
  correctAnswer: string;
  userAnswer: string;
  onClose: () => void;
};