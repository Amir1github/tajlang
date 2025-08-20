import React, { useState, useEffect } from 'react';
import { View, Text, Pressable, StyleSheet, TextInput } from 'react-native';
import { useLanguage } from '@/contexts/LanguageContext';

type FillInBlankQuestionProps = {
  question: string;
  correctAnswer: string;
  alternativeAnswers?: string[];
  hint?: string;
  onAnswer: (isCorrect: boolean, answer?: string) => void;
  disabled?: boolean;
  onNext?: () => void;
  isLastQuestion?: boolean;
};

const TAJIK_KEYBOARD = [
  ['й',  'у', 'к', 'е', 'н', 'г', 'ш', 'щ', 'з', 'х'],
  ['ф', 'ы', 'в', 'а', 'п', 'р', 'о', 'л', 'д', 'ж', 'э'],
  ['я', 'ч', 'с', 'м', 'и', 'т', 'ь', 'б', 'ю', 'ҳ', 'қ', 'ӣ', 'ҷ', 'ғ']
];

export default function FillInBlankQuestion({
  question,
  correctAnswer,
  alternativeAnswers = [],
  hint,
  onAnswer,
  disabled = false,
  onNext,
  isLastQuestion = false,
}: FillInBlankQuestionProps) {
  const { t } = useLanguage();
  const [inputValue, setInputValue] = useState('');
  const [showHint, setShowHint] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showKeyboard, setShowKeyboard] = useState(false);
  const textInputRef = React.useRef<TextInput>(null);

  // Разбиваем вопрос на части по пропуску ___
  const questionParts = question.split('___');
  const hasInputAtStart = question.startsWith('___');
  const hasInputAtEnd = question.endsWith('___');
  const hasInputInMiddle = questionParts.length > 2;

  const checkAnswer = () => {
    if (!inputValue.trim()) return;

    const normalizedAnswer = inputValue.trim().toLowerCase();
    const normalizedCorrect = correctAnswer.toLowerCase();
    const normalizedAlternatives = alternativeAnswers?.map(a => a.toLowerCase()) || [];

    const correct = normalizedAnswer === normalizedCorrect || 
                   normalizedAlternatives.includes(normalizedAnswer);

    setIsCorrect(correct);
    setSubmitted(true);
    setShowKeyboard(false);
    onAnswer(correct, inputValue);

    if (isLastQuestion && correct && onNext) {
      setTimeout(() => onNext(), 1500);
    }
  };

  const handleNext = () => {
    setInputValue('');
    setSubmitted(false);
    setShowHint(false);
    setIsCorrect(false);
    onNext?.();
  };

  const handleTryAgain = () => {
    setInputValue('');
    setSubmitted(false);
    setShowHint(false);
    setIsCorrect(false);
    setShowKeyboard(false);
  };

  const handleKeyPress = (key: string) => {
    if (key === 'BACKSPACE') {
      setInputValue(prev => prev.slice(0, -1));
    } else if (key === 'SPACE') {
      setInputValue(prev => prev + ' ');
    } else {
      setInputValue(prev => prev + key);
    }
  };

  const toggleKeyboard = () => {
    setShowKeyboard(!showKeyboard);
    if (!showKeyboard) {
      textInputRef.current?.blur();
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.questionContainer}>
        {/* Отображение всех частей вопроса с полем ввода */}
        {questionParts.map((part, index) => (
          <React.Fragment key={`part-${index}`}>
            {part ? (
              <Text style={styles.questionPart}>{part}</Text>
            ) : null}
            
            {index < questionParts.length - 1 && (
              <Pressable
                style={[
                  styles.inputContainer,
                  showKeyboard && styles.inputFocused,
                  submitted && isCorrect && styles.inputCorrect,
                  submitted && !isCorrect && styles.inputIncorrect,
                  disabled && styles.inputDisabled
                ]}
                onPress={() => !disabled && !submitted && textInputRef.current?.focus()}
                disabled={disabled || submitted}
              >
                <TextInput
                  ref={textInputRef}
                  style={styles.input}
                  value={inputValue}
                  onChangeText={setInputValue}
                  placeholder=" "
                  editable={!disabled && !submitted}
                  onFocus={() => setShowKeyboard(false)}
                />
              </Pressable>
            )}
          </React.Fragment>
        ))}
      </View>

      {/* Остальной код остается без изменений */}
      {!submitted && !disabled && (
        <Pressable 
          style={styles.toggleKeyboardButton}
          onPress={toggleKeyboard}
        >
          <Text style={styles.toggleKeyboardText}>
            {showKeyboard ? t('hideKeyboard') : t('showKeyboard')}
          </Text>
        </Pressable>
      )}

      {showKeyboard && !submitted && !disabled && (
        <View style={styles.keyboardContainer}>
          {TAJIK_KEYBOARD.map((row, rowIndex) => (
            <View key={`row-${rowIndex}`} style={styles.keyboardRow}>
              {row.map(key => (
                <Pressable
                  key={key}
                  style={styles.keyButton}
                  onPress={() => handleKeyPress(key)}
                >
                  <Text style={styles.keyText}>{key}</Text>
                </Pressable>
              ))}
            </View>
          ))}
          <View style={styles.keyboardRow}>
            <Pressable
              style={[styles.keyButton, styles.spaceButton]}
              onPress={() => handleKeyPress('SPACE')}
            >
              <Text style={styles.keyText}>Пробел</Text>
            </Pressable>
            <Pressable
              style={[styles.keyButton, styles.backspaceButton]}
              onPress={() => handleKeyPress('BACKSPACE')}
            >
              <Text style={styles.keyText}>⌫</Text>
            </Pressable>
          </View>
        </View>
      )}

      {hint && !submitted && (
        <Pressable 
          style={styles.hintButton} 
          onPress={() => setShowHint(!showHint)}
          disabled={disabled}
        >
          <Text style={styles.hintButtonText}>
            {showHint ? t('hideHint') : t('showHint')}
          </Text>
        </Pressable>
      )}

      {showHint && hint && !submitted && (
        <Text style={styles.hintText}>{hint}</Text>
      )}

      {submitted ? (
        <View style={styles.resultContainer}>
          <Text style={[
            styles.resultText,
            isCorrect ? styles.correctText : styles.incorrectText
          ]}>
            {isCorrect ? t('correct') : t('incorrect')}
          </Text>
          {!isCorrect && (
            <Text style={styles.correctAnswerText}>
              {t('correctAnswer')}: {correctAnswer}
            </Text>
          )}
          <View style={styles.buttonContainer}>
            {!isCorrect && (
              <Pressable
                style={[styles.button, styles.tryAgainButton]}
                onPress={handleTryAgain}
                disabled={disabled}
              >
                <Text style={styles.buttonText}>{t('tryAgain')}</Text>
              </Pressable>
            )}
            <Pressable
              style={[styles.button, isCorrect ? styles.nextButtonSuccess : styles.nextButton]}
              onPress={handleNext}
              disabled={disabled}
            >
              <Text style={styles.buttonText}>
                {isLastQuestion ? t('finish') : t('nextQuestion')}
              </Text>
            </Pressable>
          </View>
        </View>
      ) : (
        <Pressable
          style={[styles.button, styles.submitButton, !inputValue.trim() && styles.buttonDisabled]}
          onPress={checkAnswer}
          disabled={!inputValue.trim() || disabled}
        >
          <Text style={styles.buttonText}>{t('submit')}</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  questionContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  questionPart: {
    fontSize: 18,
    color: '#1f2937',
    lineHeight: 24,
    textAlign: 'center',
  },
  inputContainer: {
    minWidth: 100,
    height: 40,
    marginHorizontal: 4,
    paddingHorizontal: 8,
    borderBottomWidth: 2,
    borderBottomColor: '#d1d5db',
    justifyContent: 'center',
  },
  input: {
    fontSize: 18,
    color: '#1f2937',
    minHeight: 24,
    textAlign: 'center',
    padding: 0,
  },
  inputFocused: {
    borderBottomColor: '#6366f1',
    backgroundColor: '#f0f7ff',
  },
  inputCorrect: {
    borderBottomColor: '#22c55e',
    backgroundColor: '#f0fdf4',
  },
  inputIncorrect: {
    borderBottomColor: '#ef4444',
    backgroundColor: '#fef2f2',
  },
  inputDisabled: {
    opacity: 0.7,
  },
  toggleKeyboardButton: {
    alignSelf: 'center',
    marginVertical: 8,
    padding: 8,
    backgroundColor: '#e5e7eb',
    borderRadius: 4,
  },
  toggleKeyboardText: {
    color: '#6366f1',
    fontSize: 14,
  },
  keyboardContainer: {
    marginTop: 8,
    marginBottom: 16,
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
    padding: 8,
  },
  keyboardRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 8,
  },
  keyButton: {
    minWidth: 30,
    height: 40,
    marginHorizontal: 2,
    paddingHorizontal: 6,
    backgroundColor: '#fff',
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 1,
  },
  keyText: {
    fontSize: 16,
    color: '#1f2937',
  },
  backspaceButton: {
    backgroundColor: '#f59e0b',
    minWidth: 50,
  },
  spaceButton: {
    flex: 1,
    maxWidth: 200,
  },
  hintButton: {
    alignSelf: 'center',
    marginBottom: 12,
  },
  hintButtonText: {
    color: '#6366f1',
    fontSize: 14,
  },
  hintText: {
    color: '#6b7280',
    fontSize: 14,
    fontStyle: 'italic',
    textAlign: 'center',
    marginBottom: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 16,
  },
  button: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  submitButton: {
    backgroundColor: '#6366f1',
  },
  tryAgainButton: {
    backgroundColor: '#4b5563',
  },
  nextButton: {
    backgroundColor: '#6366f1',
  },
  nextButtonSuccess: {
    backgroundColor: '#22c55e',
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  resultContainer: {
    alignItems: 'center',
  },
  resultText: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  correctText: {
    color: '#22c55e',
  },
  incorrectText: {
    color: '#ef4444',
  },
  correctAnswerText: {
    color: '#6b7280',
    marginBottom: 8,
  },
});