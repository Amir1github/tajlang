import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useRouter } from 'expo-router';
import { 
  View, 
  ScrollView, 
  Animated,
  StyleSheet,
  Platform,
  useWindowDimensions
} from 'react-native';
import { useLanguage } from '@/contexts/LanguageContext';
import Header from '@/components/translator-components/Header';
import WarningCard from '@/components/translator-components/WarningCard';
import TranslatorBox from '@/components/translator-components/TranslatorBox';
import TranslateButton from '@/components/translator-components/TranslateButton';
import ErrorDisplay from '@/components/translator-components/ErrorDisplay';
import InfoCard from '@/components/translator-components/InfoCard';

const Translator = () => {
  const router = useRouter();
  const { t, colors, language } = useLanguage();
  const { width } = useWindowDimensions();
  const isDesktop = width > 768;
  const isTablet = width > 480 && width <= 768;
  
  const [text, setText] = useState('');
  const [translation, setTranslation] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [direction, setDirection] = useState('to-tajik');
  const [sourceLanguage, setSourceLanguage] = useState('en');
  const [targetLanguage, setTargetLanguage] = useState('en');
  
  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const resultAnim = useRef(new Animated.Value(0)).current;
  
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
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 80,
        friction: 10,
        useNativeDriver: true,
      })
    ]).start();
  }, []);

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
    setDirection(direction === 'to-tajik' ? 'from-tajik' : 'to-tajik');
    setText(translation);
    setTranslation(text);
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    scrollContent: {
      flexGrow: 1,
    },
    content: {
      maxWidth: isDesktop ? 900 : '100%',
      alignSelf: 'center',
      width: '100%',
      paddingHorizontal: isDesktop ? 24 : isTablet ? 20 : 16,
      paddingVertical: isDesktop ? 24 : isTablet ? 16 : 12,
      gap: isDesktop ? 20 : isTablet ? 16 : 12,
    },
    card: {
      backgroundColor: colors.card,
      borderRadius: isDesktop ? 16 : 12,
      ...Platform.select({
        ios: {
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.08,
          shadowRadius: 8,
        },
        android: {
          elevation: 3,
        },
        web: {
          boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08)',
        },
      }),
    },
  });

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
      <ScrollView 
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          <Header t={t} colors={colors} />
          
          <WarningCard t={t} />
          
          <TranslatorBox
            text={text}
            setText={setText}
            translation={translation}
            isLoading={isLoading}
            direction={direction}
            sourceLanguage={sourceLanguage}
            setSourceLanguage={setSourceLanguage}
            targetLanguage={targetLanguage}
            setTargetLanguage={setTargetLanguage}
            supportedLanguages={supportedLanguages}
            onSwapLanguages={handleSwapLanguages}
            colors={colors}
            t={t}
            resultAnim={resultAnim}
          />
          
          <ErrorDisplay error={error} colors={colors} />
          
          <TranslateButton
            onPress={translateText}
            isLoading={isLoading}
            text={text}
            colors={colors}
            t={t}
          />
          
          <InfoCard t={t} colors={colors} />
        </View>
      </ScrollView>
    </Animated.View>
  );
};

export default Translator;