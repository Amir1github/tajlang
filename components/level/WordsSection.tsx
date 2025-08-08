import { View, Text, StyleSheet, Pressable, ScrollView, ActivityIndicator } from 'react-native';
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
    } else if (isLevelCompleted) {
      setViewMode('completed');
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

  if (viewMode === 'instructions') {
    return <LevelInstructions onStart={onStartInstructions} />;
  }

  if (viewMode === 'completed') {
    return <CompletedLevelCard />;
  }

  if (viewMode === 'reading') {
    return (
      <ReadingSection
        content={readingContent}
        isLoading={isLoadingContent}
        error={contentError}
        onBack={handleBackToWords}
        onStartTest={onStartTest}
      />
    );
  }

  // Основной режим просмотра слов
  return (
    <View style={styles.container}>
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

      {/* Кнопка перехода к чтению */}
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
        <Pressable
          style={styles.backButton}
          onPress={onBack}
          hitSlop={20}
        >
          <Ionicons name="arrow-back" size={24} color={colors.textSecondary} />
        </Pressable>
        <Text style={[styles.readingTitle, { color: colors.text }]}>
          {t('reading')}
        </Text>
        <View style={{ width: 24 }} />
      </View>

      {/* HTML контент */}
      <WebView
        source={{ html: generateHTML(content, colors) }}
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

function CompletedLevelCard() {
  const { t, colors } = useLanguage();

  return (
    <View style={[
      styles.completedContainer,
      {
        backgroundColor: colors.card,
        shadowColor: colors.shadow
      }
    ]}>
      <Text style={[styles.completedText, { color: colors.success }]}>
        {t('levelAlreadyCompleted')}
      </Text>
      <Pressable
        style={[styles.returnButton, { backgroundColor: colors.primary }]}
        onPress={() => router.back()}
      >
        <Text style={[styles.returnButtonText, { color: '#ffffff' }]}>
          {t('goBack')}
        </Text>
      </Pressable>
    </View>
  );
}

// Функция для генерации HTML с правильными стилями
function generateHTML(content: string, colors: any): string {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;
            line-height: 1.6;
            color: ${colors.text};
            background-color: ${colors.background};
            padding: 20px;
            margin: 0;
            font-size: 16px;
          }
          h1, h2, h3, h4, h5, h6 {
            color: ${colors.text};
            margin-top: 24px;
            margin-bottom: 16px;
          }
          p {
            margin-bottom: 16px;
            text-align: justify;
          }
          strong, b {
            color: ${colors.primary};
            font-weight: 600;
          }
          em, i {
            font-style: italic;
          }
          ul, ol {
            margin-bottom: 16px;
            padding-left: 20px;
          }
          li {
            margin-bottom: 8px;
          }
          blockquote {
            border-left: 4px solid ${colors.primary};
            background-color: ${colors.card};
            margin: 16px 0;
            padding: 16px;
            border-radius: 8px;
          }
          code {
            background-color: ${colors.card};
            padding: 2px 4px;
            border-radius: 4px;
            font-family: 'Courier New', monospace;
          }
          pre {
            background-color: ${colors.card};
            padding: 16px;
            border-radius: 8px;
            overflow-x: auto;
          }
          img {
            max-width: 100%;
            height: auto;
            border-radius: 8px;
            margin: 16px 0;
          }
          a {
            color: ${colors.primary};
            text-decoration: none;
          }
          a:hover {
            text-decoration: underline;
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
  completedContainer: {
    padding: 24,
    margin: 16,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  completedText: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 24,
  },
  returnButton: {
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    minWidth: 120,
  },
  returnButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});