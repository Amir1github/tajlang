import React from 'react';
import { Text, View, Pressable, Image, StyleSheet} from 'react-native';
import { useLanguage } from '@/contexts/LanguageContext'; 
import { validateAnswer } from '@/utils/testHelpers'; 


function ImageQuestion({
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

  // Function to parse question text and replace {image_url} with Image component
  const renderQuestionWithImages = (text: string) => {
    const parts = text.split(/(\{[^}]+\})/);
    
    return parts.map((part, index) => {
      // Check if part is an image reference (wrapped in curly braces)
      if (part.startsWith('{') && part.endsWith('}')) {
        const imageUrl = part.slice(1, -1); // Remove curly braces
        return (
          <Image
            key={index}
            source={{ uri: imageUrl }}
            style={styles.questionImage}
            resizeMode="contain"
          />
        );
      }
      
      // Regular text
      return (
        <Text key={index} style={[styles.questionText, { color: colors.text }]}>
          {part}
        </Text>
      );
    });
  };

  return (
    <>
      <View style={styles.questionContainer}>
        {renderQuestionWithImages(question)}
      </View>
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

export default ImageQuestion;

const styles = StyleSheet.create({
  questionContainer: {
    marginBottom: 16,
  },
  questionText: {
    fontSize: 18,
    fontWeight: '500',
    lineHeight: 24,
    marginBottom: 8,
  },
  questionImage: {
    width: '100%',
    height: 200,
    marginVertical: 12,
    borderRadius: 8,
  },
  hintToggle: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    marginBottom: 8,
    alignSelf: 'flex-start',
  },
  hintToggleText: {
    fontSize: 14,
    fontWeight: '500',
  },
  buttonPressed: {
    opacity: 0.7,
  },
  hintText: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 16,
    fontStyle: 'italic',
  },
  optionsContainer: {
    gap: 12,
  },
  optionButton: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    minHeight: 48,
    justifyContent: 'center',
  },
  optionButtonDisabled: {
    opacity: 0.5,
  },
  optionButtonPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
  optionText: {
    fontSize: 16,
    textAlign: 'center',
  },
});