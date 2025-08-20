import React from 'react';
import { View, Text, StyleSheet, Pressable, Image } from 'react-native';
import { useLanguage } from '@/contexts/LanguageContext';
import FillInBlankQuestion from '@/components/FillInBlankQuestion';
import type { TestSectionProps } from '@/types/level';
import { validateAnswer } from '@/utils/testHelpers';

export default function TestSection({
  questions,
  currentQuestion,
  answersStatus,
  onAnswer,
  onPreviousQuestion,
  updating,
}: TestSectionProps) {
  const { t, colors } = useLanguage();

  if (!questions || questions.length === 0) {
    return null;
  }

  const currentQ = questions[currentQuestion];
  if (!currentQ) {
    return null;
  }

  return (
    <View style={[
      styles.questionContainer, 
      { 
        backgroundColor: colors.card, 
        shadowColor: colors.shadow 
      }
    ]}>
      {/* Progress Bar */}
      <ProgressBar
        questions={questions}
        currentQuestion={currentQuestion}
        answersStatus={answersStatus}
      />
      
      {/* Question Progress */}
      <Text style={[styles.questionProgress, { color: colors.textSecondary }]}>
        {t('question')} {currentQuestion + 1} / {questions.length}
      </Text>
      
      {/* Question Content */}
      {currentQ.type === 'fill_in_blank' ? (
        <FillInBlankQuestion
          question={currentQ.question_text}
          correctAnswer={currentQ.correct_answer}
          alternativeAnswers={currentQ.alternative_answers}
          hint={currentQ.hint}
          onAnswer={(isCorrect, answer) => onAnswer(isCorrect, answer)}
          disabled={updating}
        />
      ) : (
        <MultipleChoiceQuestion
          question={currentQ.question_text}
          options={currentQ.options}
          correctAnswer={currentQ.correct_answer}
          alternativeAnswers={currentQ.alternative_answers}
          hint={currentQ.hint}
          onAnswer={onAnswer}
          disabled={updating}
        />
      )}
      
      {/* Previous Question Button */}
      {currentQuestion > 0 && (
        <PreviousQuestionButton onPress={onPreviousQuestion} />
      )}
    </View>
  );
}

function ProgressBar({ 
  questions, 
  currentQuestion, 
  answersStatus 
}: {
  questions: any[];
  currentQuestion: number;
  answersStatus: boolean[];
}) {
  const { colors } = useLanguage();

  return (
    <View style={styles.progressBarContainer}>
      {questions.map((_, index) => (
        <View 
          key={index}
          style={[
            styles.progressSegment,
            { backgroundColor: colors.secondary },
            index === currentQuestion && { backgroundColor: colors.primary },
            index < currentQuestion && answersStatus[index] && { backgroundColor: colors.success },
            index < currentQuestion && !answersStatus[index] && { backgroundColor: colors.error },
          ]}
        />
      ))}
    </View>
  );
}

function MultipleChoiceQuestion({
  question,
  options,
  correctAnswer,
  alternativeAnswers,
  hint,
  onAnswer,
  disabled,
}: {
  question: string;
  options: string[];
  correctAnswer: string;
  alternativeAnswers?: string[];
  hint?: string;
  onAnswer: (isCorrect: boolean, answer: string) => void;
  disabled: boolean;
}) {
  const { t, colors } = useLanguage();
  const [showHint, setShowHint] = React.useState(false);

  return (
    <>
      <Text style={[styles.questionText, { color: colors.text }]}>
        {question}
      </Text>
      {!!hint && (
        <Pressable
          style={({ pressed }) => [
            styles.hintToggle,
            { backgroundColor: colors.secondary },
            pressed && styles.buttonPressed,
          ]}
          onPress={() => setShowHint(!showHint)}
          disabled={disabled}
        >
          <Text style={[styles.hintToggleText, { color: colors.text }]}>
            {showHint ? t('hideHint') : t('showHint')}
          </Text>
        </Pressable>
      )}
      {showHint && !!hint && (
        <Text style={[styles.hintText, { color: colors.textSecondary }]}>
          {hint}
        </Text>
      )}
      <View style={styles.optionsContainer}>
        {options.map((option, index) => (
          <Pressable
            key={index}
            style={({ pressed }) => [
              styles.optionButton,
              { backgroundColor: colors.secondary },
              disabled && styles.optionButtonDisabled,
              pressed && styles.optionButtonPressed
            ]}
            onPress={() => {
              const isCorrect = validateAnswer(
                option,
                correctAnswer,
                alternativeAnswers
              );
              onAnswer(isCorrect, option);
            }}
            disabled={disabled}
          >
            <Text style={[styles.optionText, { color: colors.text }]}>
              {option}
            </Text>
          </Pressable>
        ))}
      </View>
    </>
  );
}

function PreviousQuestionButton({ onPress }: { onPress: () => void }) {
  const { t, colors } = useLanguage();

  return (
    <Pressable
      style={({ pressed }) => [
        styles.previousQuestionButton,
        { backgroundColor: colors.secondary },
        pressed && styles.buttonPressed
      ]}
      onPress={onPress}
    >
      <Image 
        source={require('@/assets/images/arrow-back.png')} 
        style={styles.headerIcon} 
        resizeMode="contain"
      />
      <Text style={[styles.previousQuestionButtonText, { color: colors.text }]}>
        {t('previousQuestion')}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  questionContainer: {
    padding: 24,
    margin: 16,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  progressBarContainer: {
    flexDirection: 'row',
    height: 8,
    borderRadius: 4,
    marginBottom: 20,
    overflow: 'hidden',
  },
  progressSegment: {
    flex: 1,
    marginHorizontal: 1,
  },
  questionProgress: {
    fontSize: 16,
    marginBottom: 16,
    textAlign: 'center',
  },
  questionText: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 24,
    textAlign: 'center',
    lineHeight: 28,
  },
  optionsContainer: {
    gap: 12,
    marginBottom: 20,
  },
  hintToggle: {
    alignSelf: 'center',
    marginBottom: 8,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 6,
  },
  hintToggleText: {
    fontSize: 14,
    fontWeight: '600',
  },
  hintText: {
    textAlign: 'center',
    marginBottom: 12,
    fontStyle: 'italic',
  },
  optionButton: {
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  optionButtonDisabled: {
    opacity: 0.7,
  },
  optionButtonPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
  optionText: {
    fontSize: 16,
    textAlign: 'center',
  },
  previousQuestionButton: {
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  previousQuestionButtonText: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  headerIcon: {
    width: 20,
    height: 20,
  },
  buttonPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
});