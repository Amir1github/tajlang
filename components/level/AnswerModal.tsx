import { Modal, View, Text, StyleSheet, Pressable, Animated } from 'react-native';
import { useLanguage } from '@/contexts/LanguageContext';
import type { AnswerModalProps } from '@/types/level';

type ExtendedAnswerModalProps = AnswerModalProps & {
  slideAnim: Animated.Value;
};

export default function AnswerModal({
  visible,
  correctAnswer,
  userAnswer,
  slideAnim,
  onClose,
}: ExtendedAnswerModalProps) {
  const { t, colors } = useLanguage();

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="none"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <Animated.View 
          style={[
            styles.modalContainer,
            { backgroundColor: colors.card },
            {
              transform: [{
                translateY: slideAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [300, 0]
                })
              }]
            }
          ]}
        >
          <Text style={[styles.modalTitle, { color: colors.text }]}>
            {t('correctAnswer')}
          </Text>
          
          {userAnswer && (
            <Text style={[styles.userAnswerText, { color: colors.text }]}>
              {t('yourAnswer')}: 
              <Text style={[styles.incorrectAnswer, { color: colors.error }]}>
                {userAnswer}
              </Text>
            </Text>
          )}
          
          <Text style={[styles.modalAnswer, { color: colors.success }]}>
            {correctAnswer}
          </Text>
          
          <Pressable
            style={({ pressed }) => [
              styles.modalButton,
              { backgroundColor: colors.primary },
              pressed && styles.buttonPressed
            ]}
            onPress={onClose}
          >
            <Text style={[styles.modalButtonText, { color: '#ffffff' }]}>
              {t('ok')}
            </Text>
          </Pressable>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 24,
    paddingBottom: 40,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  userAnswerText: {
    fontSize: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  incorrectAnswer: {
    fontWeight: 'bold',
  },
  modalAnswer: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 24,
    fontWeight: '600',
  },
  modalButton: {
    padding: 16,
    borderRadius: 12,
    width: '100%',
    alignItems: 'center',
  },
  modalButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  buttonPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
});