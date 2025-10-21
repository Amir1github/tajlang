import React, { useRef } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  ActivityIndicator,
  Animated,
  StyleSheet,
  Platform 
} from 'react-native';
import LanguagePicker from './LanguagePicker';

const TranslatorBox = ({
  text,
  setText,
  translation,
  isLoading,
  direction,
  sourceLanguage,
  setSourceLanguage,
  targetLanguage,
  setTargetLanguage,
  supportedLanguages,
  onSwapLanguages,
  colors,
  t,
  resultAnim
}) => {
  const swapAnim = useRef(new Animated.Value(0)).current;

  const handleSwapLanguages = () => {
    Animated.sequence([
      Animated.timing(swapAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(swapAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      })
    ]).start();

    onSwapLanguages();
  };

  const styles = StyleSheet.create({
    translatorContainer: {
      backgroundColor: colors.card,
      borderRadius: 16,
      padding: 16,
      marginBottom: 16,
      ...Platform.select({
        ios: {
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.08,
          shadowRadius: 6,
        },
        android: {
          elevation: 4,
        },
        web: {
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
        },
      }),
    },
    translatorBox: {
      marginBottom: 12,
    },
    labelContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 8,
      minHeight: 32,
      overflow: 'visible',
      zIndex: 10,
    },
    label: {
      fontWeight: '700',
      color: colors.text,
      fontSize: 15,
      flex: 1,
    },
    languageIndicator: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.primary,
      paddingHorizontal: 10,
      paddingVertical: 5,
      borderRadius: 16,
    },
    languageText: {
      color: '#ffffff',
      fontSize: 10,
      fontWeight: '600',
      marginLeft: 3,
    },
    textarea: {
      height: 100,
      padding: 12,
      borderWidth: 1.5,
      borderColor: colors.border,
      borderRadius: 12,
      backgroundColor: colors.background,
      color: colors.text,
      fontSize: 14,
      textAlignVertical: 'top',
      fontWeight: '500',
      ...Platform.select({
        ios: {
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.05,
          shadowRadius: 2,
        },
        android: {
          elevation: 1,
        },
      }),
    },
    swapContainer: {
      alignItems: 'center',
      justifyContent: 'center',
      marginVertical: 10,
      zIndex: 1,
    },
    swapBtn: {
      width: 44,
      height: 44,
      backgroundColor: colors.primary,
      borderRadius: 22,
      alignItems: 'center',
      justifyContent: 'center',
      ...Platform.select({
        ios: {
          shadowColor: colors.primary,
          shadowOffset: { width: 0, height: 3 },
          shadowOpacity: 0.3,
          shadowRadius: 6,
        },
        android: {
          elevation: 6,
        },
      }),
    },
    swapText: {
      fontSize: 18,
      color: '#ffffff',
      fontWeight: 'bold',
    },
    resultContainer: {
      height: 100,
      padding: 12,
      borderWidth: 1.5,
      borderColor: colors.border,
      borderRadius: 12,
      backgroundColor: colors.background,
      justifyContent: 'center',
      ...Platform.select({
        ios: {
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.05,
          shadowRadius: 2,
        },
        android: {
          elevation: 1,
        },
      }),
    },
    resultText: {
      color: colors.text,
      fontSize: 14,
      lineHeight: 20,
      fontWeight: '500',
    },
    placeholderText: {
      color: colors.textTertiary,
      fontSize: 14,
      fontStyle: 'italic',
      textAlign: 'center',
    },
    loadingContainer: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    loadingText: {
      color: colors.textSecondary,
      fontSize: 12,
      marginTop: 8,
      fontWeight: '500',
    },
  });

  return (
    <View style={styles.translatorContainer}>
      {/* Input Section */}
      <View style={[styles.translatorBox, { zIndex: 20, overflow: 'visible' }]}>
        <View style={styles.labelContainer}>
          <Text style={styles.label}>
            {direction === 'to-tajik' ? t('inputLabel') : '📝 Таджикский текст'}
          </Text>
          {direction === 'to-tajik' && (
            <LanguagePicker
              value={sourceLanguage}
              onValueChange={setSourceLanguage}
              languages={supportedLanguages}
              colors={colors}
            />
          )}
          {direction === 'from-tajik' && (
            <View style={styles.languageIndicator}>
              <Text style={{ fontSize: 12 }}>🇹🇯</Text>
              <Text style={styles.languageText}>Таджикский</Text>
            </View>
          )}
        </View>
        <TextInput
          value={text}
          onChangeText={setText}
          style={styles.textarea}
          placeholder={
            direction === 'to-tajik' 
              ? t('inputPlaceholder')
              : 'Введите таджикский текст для перевода...'
          }
          placeholderTextColor={colors.textTertiary}
          multiline
        />
      </View>
      
      {/* Swap Button */}
      <View style={styles.swapContainer}>
        <Animated.View
          style={{
            transform: [
              {
                rotate: swapAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['0deg', '180deg'],
                }),
              },
            ],
          }}
        >
          <TouchableOpacity
            onPress={handleSwapLanguages}
            style={styles.swapBtn}
            activeOpacity={0.8}
          >
            <Text style={styles.swapText}>⇅</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
      
      {/* Output Section */}
      <View style={[styles.translatorBox, { zIndex: 10, overflow: 'visible' }]}>
        <View style={styles.labelContainer}>
          <Text style={styles.label}>
            {direction === 'to-tajik' 
              ? '🇹🇯 ' + t('outputLabel')
              : `✨ Перевод`
            }
          </Text>
          {direction === 'from-tajik' && (
            <LanguagePicker
              value={targetLanguage}
              onValueChange={setTargetLanguage}
              languages={supportedLanguages}
              colors={colors}
            />
          )}
          {direction === 'to-tajik' && (
            <View style={styles.languageIndicator}>
              <Text style={{ fontSize: 12 }}>🇹🇯</Text>
              <Text style={styles.languageText}>Таджикский</Text>
            </View>
          )}
        </View>
        <View style={styles.resultContainer}>
          {isLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={colors.primary} />
              <Text style={styles.loadingText}>Переводим...</Text>
            </View>
          ) : (
            <Animated.View
              style={{
                opacity: resultAnim,
                transform: [
                  {
                    scale: resultAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.9, 1],
                    }),
                  },
                ],
              }}
            >
              <Text style={translation ? styles.resultText : styles.placeholderText}>
                {translation || 'Translation will appear here'}
              </Text>
            </Animated.View>
          )}
        </View>
      </View>
    </View>
  );
};

export default TranslatorBox;