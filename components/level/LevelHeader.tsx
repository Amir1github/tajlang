import { View, StyleSheet, Pressable, Modal, Text, Animated } from 'react-native';
import { Stack } from 'expo-router';
import { CircleCheck, CircleX, Home } from 'lucide-react-native';
import { useLanguage } from '@/contexts/LanguageContext';
import type { LevelHeaderProps } from '@/types/level';
import { useEffect, useState, useRef } from 'react';

export default function LevelHeader({
  title,
  hasAttempted,
  hasPassed,
  isLevelCompleted,
  showTest,
  showResults,
  onHomePress,
}: LevelHeaderProps) {
  const { t, colors } = useLanguage();
  const [showExitModal, setShowExitModal] = useState(false);
  const slideAnim = useRef(new Animated.Value(0)).current;
  const overlayAnim = useRef(new Animated.Value(0)).current;

  const handleHomePress = () => {
    if (showTest && !showResults) {
      // Показываем кастомную модалку
      setShowExitModal(true);
      // Анимация появления
      Animated.parallel([
        Animated.timing(overlayAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.spring(slideAnim, {
          toValue: 1,
          tension: 100,
          friction: 8,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      onHomePress();
    }
  };

  const handleModalClose = () => {
    // Анимация скрытия
    Animated.parallel([
      Animated.timing(overlayAnim, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setShowExitModal(false);
    });
  };

  const handleConfirmExit = () => {
    handleModalClose();
    setTimeout(() => {
      onHomePress();
    }, 200);
  };

  const getStatusIcon = () => {
    if (!hasAttempted && !isLevelCompleted) return null;
    
    const isPassed = hasPassed || isLevelCompleted;
    return isPassed ? (
      <CircleCheck size={24} color={colors.success} style={styles.statusIcon} />
    ) : (
      <CircleX size={24} color={colors.error} style={styles.statusIcon} />
    );
  };

  // Используем useEffect для обновления заголовка при изменении пропсов
  useEffect(() => {
    // Принудительно обновляем заголовок
  }, [title, hasAttempted, hasPassed, isLevelCompleted, showTest, showResults]);

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          headerBackVisible: false, // Убираем кнопку назад
          headerLeft: () => (
            <Pressable onPress={handleHomePress} style={styles.homeButton}>
              <Home size={24} color={colors.textSecondary} />
            </Pressable>
          ),
          headerRight: () => (
            <View style={styles.headerRight}>
              {getStatusIcon()}
            </View>
          ),
          title: title,
          headerTitleAlign: 'center',
          headerStyle: {
            backgroundColor: colors.background,
          },
          headerTintColor: colors.text,
        }}
      />

      {/* Кастомная модалка подтверждения выхода */}
      <Modal
        visible={showExitModal}
        transparent
        animationType="none"
        onRequestClose={handleModalClose}
      >
        <Animated.View 
          style={[
            styles.modalOverlay,
            {
              opacity: overlayAnim,
            }
          ]}
        >
          <Pressable 
            style={styles.modalOverlayPressable} 
            onPress={handleModalClose}
          >
            <Animated.View 
              style={[
                styles.modalContainer,
                { backgroundColor: colors.card },
                {
                  transform: [
                    {
                      scale: slideAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0.8, 1],
                      }),
                    },
                    {
                      translateY: slideAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [50, 0],
                      }),
                    },
                  ],
                },
              ]}
            >
              <View style={styles.modalHeader}>
                <Text style={[styles.modalTitle, { color: colors.text }]}>
                  {t('exitTestTitle')}
                </Text>
              </View>
              
              <View style={styles.modalBody}>
                <Text style={[styles.modalMessage, { color: colors.textSecondary }]}>
                  {t('exitTestMessage')}
                </Text>
              </View>
              
              <View style={styles.modalActions}>
                <Pressable
                  style={[
                    styles.modalButton,
                    styles.cancelButton,
                    { backgroundColor: colors.background }
                  ]}
                  onPress={handleModalClose}
                >
                  <Text style={[styles.cancelButtonText, { color: colors.text }]}>
                    {t('cancel')}
                  </Text>
                </Pressable>
                
                <Pressable
                  style={[
                    styles.modalButton,
                    styles.confirmButton,
                    { backgroundColor: colors.error }
                  ]}
                  onPress={handleConfirmExit}
                >
                  <Text style={styles.confirmButtonText}>
                    {t('exit')}
                  </Text>
                </Pressable>
              </View>
            </Animated.View>
          </Pressable>
        </Animated.View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  homeButton: {
    padding: 12,
    marginLeft: 4,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  statusIcon: {
    marginRight: 4,
  },
  
  // Стили модалки
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalOverlayPressable: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  modalContainer: {
    marginHorizontal: 32,
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    minWidth: 280,
  },
  modalHeader: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 8,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'center',
  },
  modalBody: {
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  modalMessage: {
    fontSize: 16,
    lineHeight: 22,
    textAlign: 'center',
  },
  modalActions: {
    flexDirection: 'row',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(0, 0, 0, 0.1)',
  },
  modalButton: {
    flex: 1,
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButton: {
    borderRightWidth: StyleSheet.hairlineWidth,
    borderRightColor: 'rgba(0, 0, 0, 0.1)',
  },
  confirmButton: {
    // Стили для кнопки подтверждения
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '500',
  },
  confirmButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});