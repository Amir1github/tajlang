import { ScrollView, StyleSheet } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { useAuth } from '@/hooks/useAuth';
import { useLanguage } from '@/contexts/LanguageContext';
import { useLevelData } from '@/hooks/level/useLevelData';
import { useTestLogic } from '@/hooks/level/useTestLogic';

// Components
import LevelHeader from './LevelHeader';
import WordsSection from './WordsSection';
import TestSection from './TestSection';
import TestResults from './TestResults';
import AnswerModal from './AnswerModal';
import { LoadingState, ErrorState } from './LoadingErrorStates';

export default function LevelScreen() {
  const { id } = useLocalSearchParams();
  const { user } = useAuth();
  const { colors } = useLanguage();

  // Загрузка данных уровня
  const { 
    levelData, 
    loading, 
    error, 
    isLevelCompleted,
    refetchData 
  } = useLevelData(id as string, user?.id);

  // Логика теста
  const {
    // UI состояния
    showInstructions,
    showTest,
    showResults,
    showAnswerModal,
    
    // Прогресс теста
    currentQuestion,
    score,
    hasAttempted,
    hasPassed,
    answersStatus,
    randomizedQuestions,
    
    // Модальное окно
    correctAnswer,
    userAnswer,
    slideAnim,
    
    // Системные состояния
    updating,
    error: testError,
    
    // Действия
    handleAnswer,
    handleFillInBlankAnswer,
    handleModalClose,
    handlePreviousQuestion,
    startTest,
    backToTest,
    setShowInstructions,
  } = useTestLogic(levelData?.questions || [], id as string, user?.id);

  // Обработчики
  const handleHomePress = () => {
    router.replace('/');
  };

  const handleReturnHome = () => {
    router.replace('/');
  };

  const handleStartInstructions = () => {
    setShowInstructions(false);
  };

  // Состояния загрузки и ошибок
  if (loading) {
    return <LoadingState />;
  }

  if (error || !levelData) {
    return (
      <>
        <LevelHeader
          title="Error"
          hasAttempted={false}
          hasPassed={false}
          isLevelCompleted={false}
          showTest={false}
          showResults={false}
          onHomePress={handleHomePress}
        />
        <ErrorState 
          error={error || 'Level not found'} 
          onRetry={refetchData}
        />
      </>
    );
  }

  return (
    <>
      <LevelHeader
        title={levelData.title}
        hasAttempted={hasAttempted}
        hasPassed={hasPassed}
        isLevelCompleted={isLevelCompleted}
        showTest={showTest}
        showResults={showResults}
        onHomePress={handleHomePress}
      />
      
      <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
        {showResults ? (
          <TestResults
            score={score}
            totalQuestions={randomizedQuestions.length}
            hasPassed={hasPassed}
            error={testError}
            onBackToTest={backToTest}
            onReturnHome={handleReturnHome}
          />
        ) : showTest ? (
          <TestSection
            questions={randomizedQuestions}
            currentQuestion={currentQuestion}
            answersStatus={answersStatus}
            onAnswer={handleAnswer}
            onPreviousQuestion={handlePreviousQuestion}
            updating={updating}
          />
        ) : (
          <WordsSection
            words={levelData.words}
            isLevelCompleted={isLevelCompleted}
            showInstructions={showInstructions}
            onStartInstructions={handleStartInstructions}
            onStartTest={startTest}
            id = {levelData.id}
          />
        )}

        {/* Модальное окно с правильным ответом */}
        <AnswerModal
          visible={showAnswerModal}
          correctAnswer={correctAnswer}
          userAnswer={userAnswer}
          slideAnim={slideAnim}
          onClose={handleModalClose}
        />
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});