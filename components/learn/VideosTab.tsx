import { View, Text, StyleSheet, ScrollView, Pressable, Platform, Image } from 'react-native';
import { useLanguage } from '@/contexts/LanguageContext';
import { Play } from 'lucide-react-native';
import { useState } from 'react';
import { WebView } from 'react-native-webview';

interface Video {
  id: string;
  title: string;
  titleRu: string;
  description: string;
  descriptionRu: string;
  youtubeId: string;
  category?: string;
  categoryRu?: string;
}

export default function VideosTab() {
  const { language, colors } = useLanguage();
  const [expandedVideo, setExpandedVideo] = useState<string | null>(null);

  // Видео с разными категориями
  const videos: Video[] = [
    {
      id: '1',
      title: 'The Tajik Alphabet Pronunciation (Part 1)',
      titleRu: 'Урок по таджикскому алфавиту',
      description: 'Learn the complete Tajik alphabet with pronunciation',
      descriptionRu: 'Изучите полный таджикский алфавит с произношением',
      youtubeId: 'Hx3HTtEB_BM',
      category: 'Basics',
      categoryRu: 'Основы',
    },
    {
      id: '2',
      title: 'Tajik language. Lesson 2. "ast" and "hast" ',
      titleRu: 'Таджикский язык. Урок 2. "аст и ҳаст"',
      description: '"ast" and "hast"',
      descriptionRu: '"аст и ҳаст"',
      youtubeId: 'SHIj9sCmT1g',
      category: 'Phrases',
      categoryRu: 'Фразы',
    },
    {
      id: '3',
      title: 'Numbers 1-100',
      titleRu: 'Числа 1-100',
      description: 'Learn to count in Tajik from 1 to 100',
      descriptionRu: 'Научитесь считать на таджикском от 1 до 100',
      youtubeId: 'UcrBMUWSPEw',
      category: 'Numbers',
      categoryRu: 'Числа',
    },
  ];

  const toggleVideo = (videoId: string) => {
    setExpandedVideo(expandedVideo === videoId ? null : videoId);
  };

  const getEmbedUrl = (youtubeId: string) => {
    return `https://www.youtube.com/embed/${youtubeId}?rel=0&modestbranding=1`;
  };

  const getThumbnailUrl = (youtubeId: string) => {
    return `https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg`;
  };

  const renderVideoPlayer = (video: Video) => {
    if (Platform.OS === 'web') {
      return (
        <iframe
          style={{
            width: '100%',
            height: '100%',
            border: 'none',
            borderRadius: '12px 12px 0 0',
          }}
          src={getEmbedUrl(video.youtubeId)}
          title={language === 'ru' ? video.titleRu : video.title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      );
    }

    return (
      <WebView
        style={styles.webview}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        source={{ uri: getEmbedUrl(video.youtubeId) }}
        allowsFullscreenVideo={true}
      />
    );
  };

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={Platform.OS !== 'web'}
    >
      <View style={styles.header}>
        <Text style={[styles.headerText, { color: colors.text }]}>
          {language === 'ru' ? 'Обучающие видео' : 'Learning Videos'}
        </Text>
        <Text style={[styles.subheaderText, { color: colors.textSecondary }]}>
          {language === 'ru' 
            ? 'Смотрите видеоуроки для лучшего понимания'
            : 'Watch video lessons for better understanding'
          }
        </Text>
      </View>

      <View style={styles.videosContainer}>
        {videos.map((video) => {
          const isExpanded = expandedVideo === video.id;
          
          return (
            <View
              key={video.id}
              style={[
                styles.videoCard,
                { backgroundColor: colors.card, borderColor: colors.border }
              ]}
            >
              {isExpanded ? (
                <View style={styles.playerContainer}>
                  {renderVideoPlayer(video)}
                </View>
              ) : (
                <Pressable
                  style={styles.thumbnailContainer}
                  onPress={() => toggleVideo(video.id)}
                >
                  <Image
                    source={{ uri: getThumbnailUrl(video.youtubeId) }}
                    style={styles.thumbnailImage}
                    resizeMode="cover"
                  />
                  <View style={styles.playOverlay}>
                    <View style={[styles.playButton, { backgroundColor: colors.primary }]}>
                      <Play size={28} color="#ffffff" fill="#ffffff" />
                    </View>
                  </View>
                  {video.category && (
                    <View style={[styles.categoryBadge, { backgroundColor: colors.primary }]}>
                      <Text style={styles.categoryText}>
                        {language === 'ru' ? video.categoryRu : video.category}
                      </Text>
                    </View>
                  )}
                </Pressable>
              )}
              
              <View style={styles.videoInfo}>
                <View style={styles.titleRow}>
                  <Text 
                    style={[styles.videoTitle, { color: colors.text }]}
                    numberOfLines={2}
                  >
                    {language === 'ru' ? video.titleRu : video.title}
                  </Text>
                  {isExpanded && (
                    <Pressable
                      style={[styles.collapseButton, { backgroundColor: colors.border }]}
                      onPress={() => toggleVideo(video.id)}
                    >
                      <Text style={[styles.collapseText, { color: colors.textSecondary }]}>
                        {language === 'ru' ? '✕' : '✕'}
                      </Text>
                    </Pressable>
                  )}
                </View>
              </View>
            </View>
          );
        })}
      </View>

      {videos.length === 0 && (
        <View style={styles.emptyContainer}>
          <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
            {language === 'ru' ? 'Видео скоро появятся' : 'Videos coming soon'}
          </Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    ...(Platform.OS === 'web' && {
      overflowY: 'scroll',
      scrollbarWidth: 'thin',
    }),
  },
  content: {
    padding: 16,
    paddingTop: 8,
    paddingBottom: 32,
  },
  header: {
    marginBottom: 20,
  },
  headerText: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 8,
  },
  subheaderText: {
    fontSize: 15,
    lineHeight: 22,
  },
  videosContainer: {
    alignItems: 'center',
  },
  videoCard: {
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
    borderWidth: 1,
    width: '100%',
    maxWidth: 500,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
      },
      android: {
        elevation: 2,
      },
      web: {
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
      },
    }),
  },
  playerContainer: {
    width: '100%',
    aspectRatio: 16 / 9,
    backgroundColor: '#000',
  },
  webview: {
    width: '100%',
    height: '100%',
  },
  thumbnailContainer: {
    width: '100%',
    aspectRatio: 16 / 9,
    position: 'relative',
  },
  thumbnailImage: {
    width: '100%',
    height: '100%',
  },
  playOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  playButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    opacity: 0.95,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
      web: {
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
      },
    }),
  },
  categoryBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  categoryText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '600',
  },
  videoInfo: {
    padding: 12,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  videoTitle: {
    fontSize: 15,
    fontWeight: '600',
    flex: 1,
    marginRight: 8,
    lineHeight: 20,
  },
  collapseButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  collapseText: {
    fontSize: 16,
    fontWeight: '600',
  },
  emptyContainer: {
    marginTop: 48,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 15,
    textAlign: 'center',
  },
});