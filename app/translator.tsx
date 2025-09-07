import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useRouter } from 'expo-router';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  ScrollView, 
  ActivityIndicator, 
  StyleSheet,
  Animated,
  Dimensions
} from 'react-native';
import { useLanguage } from '@/contexts/LanguageContext';

const { width, height } = Dimensions.get('window');

const Translator = () => {
  const router = useRouter();
  const { t, colors, language } = useLanguage();
  const [text, setText] = useState('');
  const [translation, setTranslation] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [direction, setDirection] = useState('to-tajik');
  const [sourceLanguage, setSourceLanguage] = useState('en');
  const [targetLanguage, setTargetLanguage] = useState('en');
  
  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const swapAnim = useRef(new Animated.Value(0)).current;
  const resultAnim = useRef(new Animated.Value(0)).current;
  const errorAnim = useRef(new Animated.Value(0)).current;
  
  const supportedLanguages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'ru', name: 'Русский', flag: '🇷🇺' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
    { code: 'zh', name: '中國人', flag: '🇨🇳' },
    { code: 'ar', name: 'عربي', flag: '🇸🇦' },
    { code: 'fa', name: 'فارسی', flag: '🇮🇷' },
    { code: 'uz', name: 'Oʻzbek', flag: '🇺🇿' },
  ];

  // Initial animations
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      })
    ]).start();
  }, []);

  // Error animation
  useEffect(() => {
    if (error) {
      Animated.sequence([
        Animated.timing(errorAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.delay(3000),
        Animated.timing(errorAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        })
      ]).start(() => {
        if (error) setError('');
      });
    }
  }, [error]);

  // Result animation
  useEffect(() => {
    if (translation && !isLoading) {
      Animated.spring(resultAnim, {
        toValue: 1,
        tension: 100,
        friction: 8,
        useNativeDriver: true,
      }).start();
    } else {
      resultAnim.setValue(0);
    }
  }, [translation, isLoading]);

  const translateText = async () => {
    if (!text.trim()) {
      setError(t('errorEmpty'));
      return;
    }

    setIsLoading(true);
    setError('');
    resultAnim.setValue(0);

    try {
      let params;
      if (direction === 'to-tajik') {
        params = {
          q: text,
          langpair: `${sourceLanguage}|tg`,
        };
      } else {
        params = {
          q: text,
          langpair: `tg|${targetLanguage}`,
        };
      }

      const response = await axios.get(
        'https://api.mymemory.translated.net/get',
        { params }
      );

      if (response.data.responseData) {
        setTranslation(response.data.responseData.translatedText);
      } else {
        setError(t('errorApi'));
      }
    } catch (err) {
      console.error('Translation error:', err);
      setError(t('errorApi'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleSwapLanguages = () => {
    // Animate swap
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

    setDirection(direction === 'to-tajik' ? 'from-tajik' : 'to-tajik');
    setText(translation);
    setTranslation(text);
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    content: {
      padding: 20,
    },
    header: {
      backgroundColor: colors.card,
      borderRadius: 20,
      padding: 24,
      marginBottom: 24,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 6,
    },
    headerTop: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 16,
    },
    title: {
      fontSize: 28,
      fontWeight: '800',
      color: colors.text,
      textAlign: 'center',
    },
    subtitle: {
      fontSize: 16,
      color: colors.textSecondary,
      textAlign: 'center',
      marginTop: 8,
      fontWeight: '500',
    },
    warningCard: {
      backgroundColor: 'rgba(255, 193, 7, 0.1)',
      borderRadius: 16,
      padding: 16,
      marginBottom: 24,
      borderWidth: 1,
      borderColor: 'rgba(255, 193, 7, 0.3)',
    },
    warningText: {
      color: '#f59e0b',
      textAlign: 'center',
      fontSize: 14,
      fontWeight: '500',
      lineHeight: 20,
    },
    translatorContainer: {
      backgroundColor: colors.card,
      borderRadius: 20,
      padding: 20,
      marginBottom: 24,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 6,
    },
    translatorBox: {
      marginBottom: 20,
    },
    labelContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 12,
    },
    label: {
      fontWeight: '700',
      color: colors.text,
      fontSize: 18,
    },
    languageIndicator: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.primary,
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 20,
    },
    languageText: {
      color: '#ffffff',
      fontSize: 12,
      fontWeight: '600',
      marginLeft: 4,
    },
    select: {
      borderWidth: 2,
      borderColor: colors.border,
      borderRadius: 12,
      paddingHorizontal: 16,
      paddingVertical: 12,
      backgroundColor: colors.background,
      minWidth: 140,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 4,
      elevation: 2,
    },
    textarea: {
      height: 140,
      padding: 16,
      borderWidth: 2,
      borderColor: colors.border,
      borderRadius: 16,
      backgroundColor: colors.background,
      color: colors.text,
      fontSize: 16,
      textAlignVertical: 'top',
      fontWeight: '500',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 4,
      elevation: 2,
    },
    textareaFocused: {
      borderColor: colors.primary,
      borderWidth: 2,
    },
    swapContainer: {
      alignItems: 'center',
      justifyContent: 'center',
      marginVertical: 16,
    },
    swapBtn: {
      width: 56,
      height: 56,
      backgroundColor: colors.primary,
      borderRadius: 28,
      alignItems: 'center',
      justifyContent: 'center',
      shadowColor: colors.primary,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 8,
    },
    swapText: {
      fontSize: 24,
      color: '#ffffff',
      fontWeight: 'bold',
    },
    resultContainer: {
      height: 140,
      padding: 16,
      borderWidth: 2,
      borderColor: colors.border,
      borderRadius: 16,
      backgroundColor: colors.background,
      justifyContent: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 4,
      elevation: 2,
    },
    resultText: {
      color: colors.text,
      fontSize: 16,
      lineHeight: 24,
      fontWeight: '500',
    },
    placeholderText: {
      color: colors.textTertiary,
      fontSize: 16,
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
      fontSize: 14,
      marginTop: 12,
      fontWeight: '500',
    },
    translateBtn: {
      backgroundColor: colors.primary,
      paddingVertical: 16,
      paddingHorizontal: 32,
      borderRadius: 16,
      alignItems: 'center',
      alignSelf: 'center',
      marginBottom: 24,
      minWidth: 160,
      shadowColor: colors.primary,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 6,
    },
    translateBtnDisabled: {
      backgroundColor: colors.textTertiary,
      shadowOpacity: 0.1,
    },
    translateBtnText: {
      color: '#ffffff',
      fontSize: 18,
      fontWeight: '700',
    },
    infoCard: {
      backgroundColor: colors.card,
      borderRadius: 16,
      padding: 20,
      marginBottom: 20,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 4,
      elevation: 3,
    },
    infoTitle: {
      fontSize: 16,
      fontWeight: '700',
      color: colors.text,
      marginBottom: 12,
      textAlign: 'center',
    },
    infoText: {
      fontSize: 14,
      color: colors.textSecondary,
      textAlign: 'center',
      marginBottom: 8,
      lineHeight: 20,
    },
    infoTip: {
      color: colors.error || '#ef4444',
      fontWeight: '600',
    },
    homeBtn: {
      backgroundColor: colors.primary,
      paddingVertical: 12,
      paddingHorizontal: 20,
      borderRadius: 12,
      shadowColor: colors.primary,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.3,
      shadowRadius: 4,
      elevation: 4,
    },
    homeBtnText: {
      color: '#ffffff',
      fontSize: 16,
      fontWeight: '600',
    },
    errorContainer: {
      backgroundColor: 'rgba(239, 68, 68, 0.1)',
      borderRadius: 12,
      padding: 16,
      marginBottom: 16,
      borderWidth: 1,
      borderColor: 'rgba(239, 68, 68, 0.3)',
    },
    errorText: {
      color: '#ef4444',
      textAlign: 'center',
      fontSize: 14,
      fontWeight: '600',
    },
    pickerModal: {
      position: 'absolute',
      top: 45,
      right: 0,
      backgroundColor: colors.card,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: colors.border,
      zIndex: 1000,
      minWidth: 180,
      maxHeight: 250,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 8,
      elevation: 8,
    },
    pickerItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 12,
      paddingHorizontal: 16,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    pickerItemText: {
      color: colors.text,
      fontSize: 14,
      fontWeight: '500',
      marginLeft: 8,
    },
    selectText: {
      color: colors.text,
      fontSize: 14,
      fontWeight: '600',
    },
  });

  // Custom Language Picker Component
  const LanguagePicker = ({ value, onValueChange, languages }) => {
    const [showPicker, setShowPicker] = useState(false);
    const pickerAnim = useRef(new Animated.Value(0)).current;
    
    const selectedLanguage = languages.find(lang => lang.code === value);
    
    useEffect(() => {
      Animated.timing(pickerAnim, {
        toValue: showPicker ? 1 : 0,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }, [showPicker]);
    
    return (
      <View>
        <TouchableOpacity 
          style={styles.select} 
          onPress={() => setShowPicker(!showPicker)}
          activeOpacity={0.7}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={{ fontSize: 16, marginRight: 8 }}>
              {selectedLanguage?.flag}
            </Text>
            <Text style={styles.selectText}>
              {selectedLanguage?.name || 'Выберите язык'}
            </Text>
          </View>
        </TouchableOpacity>
        
        {showPicker && (
          <Animated.View 
            style={[
              styles.pickerModal,
              {
                opacity: pickerAnim,
                transform: [
                  {
                    scale: pickerAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.95, 1],
                    }),
                  },
                ],
              }
            ]}
          >
            <ScrollView showsVerticalScrollIndicator={false}>
              {languages.map((lang, index) => (
                <TouchableOpacity
                  key={lang.code}
                  style={[
                    styles.pickerItem,
                    index === languages.length - 1 && { borderBottomWidth: 0 }
                  ]}
                  onPress={() => {
                    onValueChange(lang.code);
                    setShowPicker(false);
                  }}
                  activeOpacity={0.7}
                >
                  <Text style={{ fontSize: 16 }}>{lang.flag}</Text>
                  <Text style={styles.pickerItemText}>
                    {lang.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </Animated.View>
        )}
      </View>
    );
  };

  return (
    <Animated.View 
      style={[
        styles.container,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        }
      ]}
    >
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          {/* Header */}
          <View style={styles.header}>
            
            <Text style={styles.title}>{t('translatorTitle')}</Text>
            <Text style={styles.subtitle}>
              🌐 Многоязычный переводчик с поддержкой таджикского языка
            </Text>
          </View>
          
          {/* Warning */}
          <View style={styles.warningCard}>
            <Text style={styles.warningText}>
              ⚠️ {t('warning')}
            </Text>
          </View>
          
          {/* Translator */}
          <View style={styles.translatorContainer}>
            {/* Input Section */}
            <View style={styles.translatorBox}>
              <View style={styles.labelContainer}>
                <Text style={styles.label}>
                  {direction === 'to-tajik' ? t('inputLabel') : '📝 Таджикский текст'}
                </Text>
                {direction === 'to-tajik' && (
                  <LanguagePicker
                    value={sourceLanguage}
                    onValueChange={setSourceLanguage}
                    languages={supportedLanguages}
                  />
                )}
                {direction === 'from-tajik' && (
                  <View style={styles.languageIndicator}>
                    <Text style={{ fontSize: 16 }}>🇹🇯</Text>
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
            <View style={styles.translatorBox}>
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
                  />
                )}
                {direction === 'to-tajik' && (
                  <View style={styles.languageIndicator}>
                    <Text style={{ fontSize: 16 }}>🇹🇯</Text>
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
                      {translation || t('Translation will appear here')}
                    </Text>
                  </Animated.View>
                )}
              </View>
            </View>
          </View>
          
          {/* Error Display */}
          {error && (
            <Animated.View 
              style={[
                styles.errorContainer,
                {
                  opacity: errorAnim,
                  transform: [
                    {
                      translateY: errorAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [-10, 0],
                      }),
                    },
                  ],
                }
              ]}
            >
              <Text style={styles.errorText}>❌ {error}</Text>
            </Animated.View>
          )}
          
          {/* Translate Button */}
          <TouchableOpacity
            onPress={translateText}
            disabled={isLoading || !text.trim()}
            style={[
              styles.translateBtn,
              (isLoading || !text.trim()) && styles.translateBtnDisabled
            ]}
            activeOpacity={0.8}
          >
            <Text style={styles.translateBtnText}>
              {isLoading ? '🔄 ' + t('translating') : '🚀 ' + t('translate')}
            </Text>
          </TouchableOpacity>
          
          {/* Info Card */}
          <View style={styles.infoCard}>
            <Text style={styles.infoTitle}>ℹ️ Информация о сервисе</Text>
            <Text style={styles.infoText}>{t('infoApi')}</Text>
            <Text style={styles.infoText}>{t('infoLimit')}</Text>
            <Text style={[styles.infoText, styles.infoTip]}>
              💡 {t('infoTip')}
            </Text>
          </View>
        </View>
      </ScrollView>
    </Animated.View>
  );
};

export default Translator;