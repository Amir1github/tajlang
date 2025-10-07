import { View, Text, StyleSheet, Pressable, ScrollView, ActivityIndicator, Platform } from 'react-native';
import { router } from 'expo-router';
import { useLanguage } from '@/contexts/LanguageContext';
import WordCard from '@/components/WordCard';
import LevelInstructions from '@/components/LevelInstructions';
import { useState, useEffect } from 'react';
import { WebView } from 'react-native-webview';
import { supabase } from '@/lib/supabase';
import type { WordsSectionProps } from '@/types/level';
import { Ionicons } from '@expo/vector-icons';

type ViewMode = 'instructions' | 'words' | 'reading' | 'completed';

export default function WordsSection({
  words,
  isLevelCompleted,
  showInstructions,
  onStartInstructions,
  onStartTest,
  id, // ID уровня для получения контента из reading таблицы
}: WordsSectionProps) {
  const { t, colors } = useLanguage();
  const [viewMode, setViewMode] = useState<ViewMode>('words');
  const [readingContent, setReadingContent] = useState<string>('');
  const [isLoadingContent, setIsLoadingContent] = useState(false);
  const [contentError, setContentError] = useState<string>('');

  // Определяем режим просмотра на основе пропсов
  useEffect(() => {
    if (showInstructions) {
      setViewMode('instructions');
    } else {
      setViewMode('words');
    }
  }, [showInstructions, isLevelCompleted]);

  // Функция для получения HTML-контента из Supabase
  const fetchReadingContent = async () => {
    setIsLoadingContent(true);
    setContentError('');

    try {
      const prefix = 'eq.'; 
      const cleanId = id.startsWith(prefix) ? id.slice(prefix.length) : id;
      console.log('Fetching reading content for ID:', cleanId);
      
      const { data, error } = await supabase
        .from('reading')
        .select('content')
        .eq('id', cleanId)
        .single();

      if (error) {
        console.error('Ошибка получения контента:', error);
        setContentError(t('errorLoadingContent'));
        return;
      }

      if (data?.content) {
        setReadingContent(data.content);
        setViewMode('reading');
      } else {
        setContentError(t('noContentAvailable'));
      }
    } catch (error) {
      console.error('Ошибка загрузки:', error);
      setContentError(t('errorLoadingContent'));
    } finally {
      setIsLoadingContent(false);
    }
  };

  // Функция перехода к чтению после изучения слов
  const handleProceedToReading = () => {
    fetchReadingContent();
  };

  // Функция возврата к словам из режима чтения
  const handleBackToWords = () => {
    setViewMode('words');
    setReadingContent('');
    setContentError('');
  };

  // Функция возврата домой
  const handleGoHome = () => {
    router.push('/');
  };

  return (
    <View style={styles.container}>
      {/* Верхняя полоса с заголовком и кнопкой домой - показывается всегда */}
      <View style={[styles.topBar, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
        <Pressable
          style={styles.homeBackButton}
          onPress={() => router.push('/')}
          hitSlop={20}
        >
          <Ionicons name="arrow-back" size={24} color={colors.textSecondary} />
        </Pressable>
        <Text style={[styles.topBarTitle, { color: colors.text }]}>
          {t('preparation')}
        </Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Контент в зависимости от режима */}
      {viewMode === 'instructions' && (
        <LevelInstructions onStart={onStartInstructions} />
      )}

      {viewMode === 'reading' && (
        <ReadingSection
          content={readingContent}
          isLoading={isLoadingContent}
          error={contentError}
          onBack={handleBackToWords}
          onStartTest={onStartTest}
        />
      )}

      {viewMode === 'words' && (
        <View style={styles.wordsContent}>
          {/* Список слов */}
          <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
            <View style={styles.wordsContainer}>
              {words.map((word) => (
                <WordCard
                  key={word.id}
                  tajik={word.tajik}
                  english={word.english}
                  explanation={word.explanation}
                  ru_explanation={word.ru_explanation}
                  russian={word.russian}
                  examples={word.examples}
                />
              ))}
            </View>
          </ScrollView>

          {/* Нижняя секция с кнопкой или сообщением о завершении */}
          {isLevelCompleted ? (
            <View style={[styles.completedSection, { backgroundColor: colors.card, borderTopColor: colors.border }]}>
              <Text style={[styles.completedMessage, { color: colors.textSecondary }]}>
                {t('levelAlreadyCompleted')}
              </Text>
              <Pressable
                style={[styles.homeButton, { backgroundColor: colors.primary }]}
                onPress={handleGoHome}
              >
                <Ionicons name="home" size={20} color="#ffffff" style={{ marginRight: 8 }} />
                <Text style={[styles.homeButtonText, { color: '#ffffff' }]}>
                  {t('goHome')}
                </Text>
              </Pressable>
            </View>
          ) : (
            <Pressable
              style={[styles.readingButton, { backgroundColor: colors.primary }]}
              onPress={handleProceedToReading}
              disabled={isLoadingContent}
            >
              {isLoadingContent ? (
                <ActivityIndicator color="#ffffff" />
              ) : (
                <Text style={[styles.readingButtonText, { color: '#ffffff' }]}>
                  {t('proceedToReading')}
                </Text>
              )}
            </Pressable>
          )}
        </View>
      )}
    </View>
  );
}

function ReadingSection({ 
  content, 
  isLoading, 
  error, 
  onBack, 
  onStartTest 
}: {
  content: string;
  isLoading: boolean;
  error: string;
  onBack: () => void;
  onStartTest: () => void;
}) {
  const { t, colors } = useLanguage();

  if (isLoading) {
    return (
      <View style={[styles.centerContainer, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={[styles.loadingText, { color: colors.textSecondary }]}>
          {t('loadingContent')}
        </Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.centerContainer, { backgroundColor: colors.background }]}>
        <Ionicons name="alert-circle" size={48} color={colors.error} />
        <Text style={[styles.errorText, { color: colors.error }]}>
          {error}
        </Text>
        <Pressable
          style={[styles.retryButton, { backgroundColor: colors.primary }]}
          onPress={onBack}
        >
          <Text style={[styles.retryButtonText, { color: '#ffffff' }]}>
            {t('goBack')}
          </Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.readingContainer}>
      {/* Header с кнопкой назад */}
      <View style={[styles.readingHeader, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
        
        <Text style={[styles.readingTitle, { color: colors.text }]}>
          {t('reading')}
        </Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Контент чтения - адаптивно для платформы */}
      {Platform.OS === 'web' ? (
        <ScrollView style={styles.webContent}>
          <div 
            dangerouslySetInnerHTML={{ __html: generateHTML(content, colors, t) }}
            style={{ padding: 20 }}
          />
        </ScrollView>
      ) : (
        <WebView
          source={{ html: generateHTML(content, colors, t) }}
          style={styles.webview}
          showsVerticalScrollIndicator={true}
          nestedScrollEnabled={true}
          startInLoadingState={true}
          renderLoading={() => (
            <View style={styles.webviewLoading}>
              <ActivityIndicator size="large" color={colors.primary} />
            </View>
          )}
        />
      )}

      {/* Кнопка перехода к тесту */}
      <Pressable
        style={[styles.startTestButton, { backgroundColor: colors.primary }]}
        onPress={onStartTest}
      >
        <Text style={[styles.startTestButtonText, { color: '#ffffff' }]}>
          {t('startTest')}
        </Text>
      </Pressable>
    </View>
  );
}

function generateHTML(content, colors, t) {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body {
            color: ${colors.text};
            background-color: ${colors.background};
            font-family: sans-serif;
            padding: 16px;
          }

          .word {
            position: relative;
            cursor: pointer;
            color: ${colors.primary};
            border-bottom: 1px dashed ${colors.primary};
          }

          .word:hover::after {
            content: attr(data-translation);
            position: absolute;
            bottom: 120%;
            left: 50%;
            transform: translateX(-50%);
            background-color: ${colors.card};
            color: ${colors.text};
            border: 1px solid ${colors.border};
            padding: 6px 10px;
            border-radius: 8px;
            white-space: nowrap;
            box-shadow: 0 2px 6px rgba(0,0,0,0.15);
            font-size: 14px;
            z-index: 1000;
          }
        </style>
      </head>
      <body>
        ${content}
      </body>
    </html>
  `;
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  wordsContent: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  wordsContainer: {
    padding: 16,
    gap: 16,
  },
  readingButton: {
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    margin: 16,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  readingButtonText: {
    fontSize: 18,
    fontWeight: '600',
  },
  // Новые стили для завершенного уровня
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  homeBackButton: {
    padding: 4,
    borderRadius: 8,
  },
  topBarTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  completedSection: {
    padding: 20,
    borderTopWidth: 1,
    alignItems: 'center',
  },
  completedMessage: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 22,
  },
  homeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  homeButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  readingContainer: {
    flex: 1,
  },
  readingHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  backButton: {
    padding: 4,
    borderRadius: 8,
  },
  readingTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  // Стили для веб-контента
  webContent: {
    flex: 1,
  },
  webview: {
    flex: 1,
  },
  webviewLoading: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
  },
  startTestButton: {
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    margin: 16,
  },
  startTestButtonText: {
    fontSize: 18,
    fontWeight: '600',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    textAlign: 'center',
  },
  errorText: {
    marginTop: 16,
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    minWidth: 120,
  },
  retryButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});