import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'expo-router';
import { View, Text, TextInput, TouchableOpacity, ScrollView, ActivityIndicator, StyleSheet } from 'react-native';
import { useLanguage } from '@/contexts/LanguageContext';

const Translator = () => {
  const router = useRouter();
  const { t, colors } = useLanguage();
  const [text, setText] = useState('');
  const [translation, setTranslation] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [direction, setDirection] = useState('to-tajik');
  const [sourceLanguage, setSourceLanguage] = useState('en');
  const [targetLanguage, setTargetLanguage] = useState('en'); // Add target language state
  
  const supportedLanguages = [
    { code: 'en', name: 'Английский' },
    { code: 'ru', name: 'Русский' },
    { code: 'fr', name: 'Французский' },
    { code: 'es', name: 'Испанский' },
    { code: 'de', name: 'Немецкий' },
    { code: 'zh', name: 'Китайский' },
    { code: 'ar', name: 'Арабский' },
    { code: 'fa', name: 'Персидский' },
    { code: 'uz', name: 'Узбекский' },
  ];

  const translateText = async () => {
    if (!text.trim()) {
      setError('Пожалуйста, введите текст для перевода');
      return;
    }

    setIsLoading(true);
    setError('');

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
        setError('Не удалось выполнить перевод. Попробуйте снова.');
      }
    } catch (err) {
      console.error('Translation error:', err);
      setError('Произошла ошибка при переводе. Попробуйте позже.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSwapLanguages = () => {
    setDirection(direction === 'to-tajik' ? 'from-tajik' : 'to-tajik');
    setText(translation);
    setTranslation(text);
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 16,
      backgroundColor: colors.background,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 16,
      backgroundColor: colors.card,
      padding: 16,
      borderRadius: 12,
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      color: colors.text,
      textAlign: 'center',
      marginBottom: 16,
    },
    warningText: {
      color: colors.error || '#ef4444',
      marginVertical: 16,
      textAlign: 'center',
      fontSize: 14,
    },
    translatorFlex: {
      flexDirection: 'column',
      gap: 16,
      marginBottom: 16,
    },
    translatorBox: {
      flex: 1,
    },
    labelContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 8,
    },
    label: {
      fontWeight: '500',
      color: colors.text,
      fontSize: 16,
    },
    select: {
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 4,
      paddingHorizontal: 8,
      paddingVertical: 4,
      backgroundColor: colors.card,
      color: colors.text,
      fontSize: 14,
      minWidth: 120,
    },
    textarea: {
      height: 160,
      padding: 12,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 8,
      backgroundColor: colors.card,
      color: colors.text,
      fontSize: 16,
      textAlignVertical: 'top',
    },
    swapContainer: {
      alignItems: 'center',
      justifyContent: 'center',
      alignSelf: 'center',
      marginVertical: 8,
    },
    swapBtn: {
      padding: 8,
      backgroundColor: colors.card,
      borderRadius: 50,
      borderWidth: 1,
      borderColor: colors.border,
      alignItems: 'center',
      justifyContent: 'center',
      width: 40,
      height: 40,
    },
    swapText: {
      fontSize: 18,
      color: colors.text,
    },
    resultContainer: {
      height: 160,
      padding: 12,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 8,
      backgroundColor: colors.card,
      justifyContent: 'center',
    },
    resultText: {
      color: colors.text,
      fontSize: 16,
    },
    placeholderText: {
      color: colors.textTertiary,
      fontSize: 16,
    },
    loadingContainer: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    errorText: {
      color: colors.error || '#ef4444',
      marginBottom: 16,
      textAlign: 'center',
      fontSize: 14,
    },
    translateBtn: {
      backgroundColor: colors.primary,
      paddingVertical: 12,
      paddingHorizontal: 24,
      borderRadius: 8,
      alignItems: 'center',
      alignSelf: 'center',
      marginBottom: 16,
    },
    translateBtnDisabled: {
      backgroundColor: colors.textTertiary,
    },
    translateBtnText: {
      color: '#ffffff',
      fontSize: 16,
      fontWeight: '500',
    },
    info: {
      marginTop: 24,
      alignItems: 'center',
    },
    infoText: {
      fontSize: 14,
      color: colors.textTertiary,
      textAlign: 'center',
      marginBottom: 4,
    },
    homeBtn: {
      backgroundColor: colors.primary,
      paddingVertical: 8,
      paddingHorizontal: 16,
      borderRadius: 6,
    },
    homeBtnText: {
      color: '#ffffff',
      fontSize: 16,
    },
  });

  // Custom Picker Component for React Native
  const LanguagePicker = ({ value, onValueChange, languages }) => {
    const [showPicker, setShowPicker] = useState(false);
    
    const selectedLanguage = languages.find(lang => lang.code === value);
    
    return (
      <View>
        <TouchableOpacity 
          style={styles.select} 
          onPress={() => setShowPicker(!showPicker)}
        >
          <Text style={{ color: colors.text, fontSize: 14 }}>
            {selectedLanguage?.name || 'Выберите язык'}
          </Text>
        </TouchableOpacity>
        
        {showPicker && (
          <View style={{
            position: 'absolute',
            top: 32,
            right: 0,
            backgroundColor: colors.card,
            borderWidth: 1,
            borderColor: colors.border,
            borderRadius: 4,
            zIndex: 1000,
            minWidth: 150,
            maxHeight: 200,
          }}>
            <ScrollView>
              {languages.map((lang) => (
                <TouchableOpacity
                  key={lang.code}
                  style={{
                    paddingVertical: 8,
                    paddingHorizontal: 12,
                    borderBottomWidth: 1,
                    borderBottomColor: colors.border,
                  }}
                  onPress={() => {
                    onValueChange(lang.code);
                    setShowPicker(false);
                  }}
                >
                  <Text style={{ color: colors.text, fontSize: 14 }}>
                    {lang.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}
      </View>
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.homeBtn}
          onPress={() => router.push('/')}
        >
          <Text style={styles.homeBtnText}>Домой</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Переводчик на таджикский язык</Text>
        <View style={{ width: 80 }} />
      </View>
      
      <Text style={styles.warningText}>
        Внимание: Мы не отвечаем за качество перевода этого сервиса. Для лучших результатов формируйте запросы полными предложениями.
      </Text>
      
      <View style={styles.translatorFlex}>
        <View style={styles.translatorBox}>
          <View style={styles.labelContainer}>
            <Text style={styles.label}>
              {direction === 'to-tajik' ? 'Исходный текст' : 'Таджикский текст'}
            </Text>
            {direction === 'to-tajik' && (
              <LanguagePicker
                value={sourceLanguage}
                onValueChange={setSourceLanguage}
                languages={supportedLanguages}
              />
            )}
          </View>
          <TextInput
            value={text}
            onChangeText={setText}
            style={styles.textarea}
            placeholder={
              direction === 'to-tajik' 
                ? 'Введите текст для перевода на таджикский (рекомендуется использовать полные предложения)...' 
                : 'Введите таджикский текст для перевода (рекомендуется использовать полные предложения)...'
            }
            placeholderTextColor={colors.textTertiary}
            multiline
          />
        </View>
        
        <View style={styles.swapContainer}>
          <TouchableOpacity
            onPress={handleSwapLanguages}
            style={styles.swapBtn}
          >
            <Text style={styles.swapText}>↔</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.translatorBox}>
          <View style={styles.labelContainer}>
            <Text style={styles.label}>
              {direction === 'to-tajik' 
                ? 'Перевод на таджикский' 
                : `Перевод на ${supportedLanguages.find(l => l.code === targetLanguage)?.name || 'выбранный язык'}`
              }
            </Text>
            {direction === 'from-tajik' && (
              <LanguagePicker
                value={targetLanguage}
                onValueChange={setTargetLanguage}
                languages={supportedLanguages}
              />
            )}
          </View>
          <View style={styles.resultContainer}>
            {isLoading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={colors.primary} />
              </View>
            ) : (
              <Text style={translation ? styles.resultText : styles.placeholderText}>
                {translation || 'Здесь появится перевод'}
              </Text>
            )}
          </View>
        </View>
      </View>
      
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
      
      <TouchableOpacity
        onPress={translateText}
        disabled={isLoading || !text.trim()}
        style={[
          styles.translateBtn,
          (isLoading || !text.trim()) && styles.translateBtnDisabled
        ]}
      >
        <Text style={styles.translateBtnText}>
          {isLoading ? 'Перевожу...' : 'Перевести'}
        </Text>
      </TouchableOpacity>
      
      <View style={styles.info}>
        <Text style={styles.infoText}>Используется бесплатный API MyMemory Translation</Text>
        <Text style={styles.infoText}>Ограничение: ~1000 символов за запрос</Text>
        <Text style={[styles.infoText, { color: colors.error || '#ef4444' }]}>
          Для получения более точного перевода используйте полные предложения
        </Text>
      </View>
    </ScrollView>
  );
};

export default Translator;