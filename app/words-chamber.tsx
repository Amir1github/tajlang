import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  Animated,
  StyleSheet,
  Platform,
  useWindowDimensions,
  TouchableOpacity,
  ActivityIndicator,
  Pressable,
} from 'react-native';
import { Heart, TrendingUp, BookOpen, Plus } from 'lucide-react-native';
import { useLanguage } from '@/contexts/LanguageContext';
import StudiedWordsList from '@/components/profile_components/StudiedWordsList';
import WordCard from '@/components/WordCard';
import { supabase } from '@/lib/supabase';

interface Word {
  id: string;
  level_id: string | null;
  tajik: string;
  english: string;
  russian: string;
  explanation: string;
  ru_explanation: string;
  examples: string[];
  publisher: string | null;
  is_public: boolean;
}

const WordsChamber = () => {
  const { t, colors } = useLanguage();
  const { width } = useWindowDimensions();
  const isDesktop = width > 768;
  const isTablet = width > 480 && width <= 768;

  const [activeTab, setActiveTab] = useState<'myWords' | 'discover'>('myWords');
  
  // Discover tab states
  const [discoverWords, setDiscoverWords] = useState<Word[]>([]);
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [likedWords, setLikedWords] = useState<Set<string>>(new Set());
  const [likesCount, setLikesCount] = useState<Map<string, number>>(new Map());

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

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
      }),
    ]).start();
  }, []);

  // Fetch user and discover words
  useEffect(() => {
    fetchUser();
  }, []);

  useEffect(() => {
    if (activeTab === 'discover' && userId) {
      fetchDiscoverWords();
      fetchUserLikes();
    }
  }, [activeTab, userId]);

  const fetchUser = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserId(user.id);
      }
    } catch (error) {
      console.error('Error fetching user:', error);
    }
  };

  const fetchDiscoverWords = async () => {
    setLoading(true);
    try {
      console.log('Fetching discover words...');
      
      // Fetch only public words, excluding user's own words
      let query = supabase
        .from('words')
        .select('*')
        .eq('is_public', true)
        .order('created_at', { ascending: false })
        .limit(50);

      // If user is logged in, exclude their own words
      if (userId) {
        query = query.neq('publisher', userId);
      }

      const { data, error } = await query;

      console.log('Discover words query result:', { data, error, count: data?.length });

      if (error) {
        console.error('Error in fetchDiscoverWords:', error);
        throw error;
      }
      
      // Fetch likes count for each word
      if (data && data.length > 0) {
        const wordIds = data.map(w => w.id);
        const { data: likesData, error: likesError } = await supabase
          .from('liked_words')
          .select('word_id')
          .in('word_id', wordIds);

        console.log('Likes data:', { likesData, likesError });

        if (!likesError && likesData) {
          const countsMap = new Map<string, number>();
          likesData.forEach(like => {
            countsMap.set(like.word_id, (countsMap.get(like.word_id) || 0) + 1);
          });
          setLikesCount(countsMap);
        }
      }

      setDiscoverWords(data || []);
    } catch (error) {
      console.error('Error fetching discover words:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserLikes = async () => {
    if (!userId) return;

    try {
      const { data, error } = await supabase
        .from('liked_words')
        .select('word_id')
        .eq('user_id', userId);

      if (error) throw error;

      const likedSet = new Set(data?.map(like => like.word_id) || []);
      setLikedWords(likedSet);
    } catch (error) {
      console.error('Error fetching user likes:', error);
    }
  };

  const handleLike = async (wordId: string) => {
    if (!userId) return;

    try {
      const isLiked = likedWords.has(wordId);

      if (isLiked) {
        // Unlike - удаляем запись из liked_words
        const { error } = await supabase
          .from('liked_words')
          .delete()
          .eq('word_id', wordId)
          .eq('user_id', userId);

        if (error) throw error;

        setLikedWords(prev => {
          const newSet = new Set(prev);
          newSet.delete(wordId);
          return newSet;
        });

        setLikesCount(prev => {
          const newMap = new Map(prev);
          const currentCount = newMap.get(wordId) || 0;
          newMap.set(wordId, Math.max(0, currentCount - 1));
          return newMap;
        });
      } else {
        // Like - добавляем запись в liked_words
        const { error } = await supabase
          .from('liked_words')
          .insert({
            word_id: wordId,
            user_id: userId
          });

        if (error) throw error;

        setLikedWords(prev => {
          const newSet = new Set(prev);
          newSet.add(wordId);
          return newSet;
        });

        setLikesCount(prev => {
          const newMap = new Map(prev);
          const currentCount = newMap.get(wordId) || 0;
          newMap.set(wordId, currentCount + 1);
          return newMap;
        });
      }
    } catch (error) {
      console.error('Error updating likes:', error);
    }
  };

  const handleAddToMyWords = async (word: Word) => {
    if (!userId) return;

    try {
      const { error } = await supabase
        .from('words')
        .insert({
          level_id: null,
          tajik: word.tajik,
          english: word.english,
          russian: word.russian,
          explanation: word.explanation,
          ru_explanation: word.ru_explanation,
          examples: word.examples,
          publisher: userId,
          is_public: false // Копия по умолчанию приватная
        });

      if (error) throw error;

      // Show success feedback
      alert(t('wordAddedSuccessfully') || 'Word added to your collection!');
    } catch (error) {
      console.error('Error adding word:', error);
      alert(t('failedToAddWord') || 'Failed to add word');
    }
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
    header: {
      marginBottom: isDesktop ? 24 : 16,
    },
    title: {
      fontSize: isDesktop ? 32 : isTablet ? 28 : 24,
      fontWeight: 'bold',
      color: colors.text,
      marginBottom: 8,
    },
    subtitle: {
      fontSize: isDesktop ? 16 : 14,
      color: colors.textSecondary,
      lineHeight: 22,
    },
    tabContainer: {
      flexDirection: 'row',
      backgroundColor: colors.card,
      borderRadius: 12,
      padding: 4,
      gap: 4,
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
    tab: {
      flex: 1,
      paddingVertical: isDesktop ? 14 : 12,
      paddingHorizontal: isDesktop ? 20 : 16,
      borderRadius: 8,
      alignItems: 'center',
      justifyContent: 'center',
    },
    activeTab: {
      backgroundColor: colors.primary,
    },
    inactiveTab: {
      backgroundColor: 'transparent',
    },
    tabText: {
      fontSize: isDesktop ? 16 : 14,
      fontWeight: '600',
    },
    activeTabText: {
      color: '#FFFFFF',
    },
    inactiveTabText: {
      color: colors.textSecondary,
    },
    contentCard: {
      backgroundColor: colors.card,
      borderRadius: isDesktop ? 16 : 12,
      padding: isDesktop ? 24 : isTablet ? 20 : 16,
      minHeight: 400,
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
    discoverContainer: {
      flex: 1,
    },
    discoverHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 16,
    },
    discoverIcon: {
      marginRight: 12,
    },
    discoverTitle: {
      fontSize: 20,
      fontWeight: '700',
      color: colors.text,
    },
    loadingContainer: {
      paddingVertical: 40,
      alignItems: 'center',
      gap: 12,
    },
    loadingText: {
      fontSize: 16,
      color: colors.textSecondary,
    },
    emptyContainer: {
      paddingVertical: 40,
      alignItems: 'center',
    },
    emptyText: {
      fontSize: 16,
      color: colors.textSecondary,
      textAlign: 'center',
    },
    wordsListContent: {
      gap: 12,
      paddingBottom: 20,
    },
    wordItemContainer: {
      position: 'relative',
      marginBottom: 12,
    },
    wordActions: {
      flexDirection: 'row',
      position: 'absolute',
      top: 12,
      right: 12,
      gap: 8,
      zIndex: 10,
    },
    actionButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      alignItems: 'center',
      justifyContent: 'center',
      ...Platform.select({
        ios: {
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
        },
        android: {
          elevation: 4,
        },
        web: {
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
        },
      }),
    },
    likeButton: {
      backgroundColor: '#fff',
    },
    likeButtonActive: {
      backgroundColor: '#fee2e2',
    },
    addButton: {
      backgroundColor: colors.primary,
    },
    likesCount: {
      position: 'absolute',
      bottom: -4,
      right: -4,
      backgroundColor: colors.primary,
      borderRadius: 10,
      paddingHorizontal: 6,
      paddingVertical: 2,
      minWidth: 20,
      alignItems: 'center',
    },
    likesCountText: {
      fontSize: 10,
      fontWeight: '700',
      color: '#fff',
    },
  });

  const renderDiscoverContent = () => {
    if (loading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>{t('loading') || 'Loading...'}</Text>
        </View>
      );
    }

    if (discoverWords.length === 0) {
      return (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>
            {t('noWordsToDiscover') || 'No words to discover yet'}
          </Text>
        </View>
      );
    }

    return (
      <ScrollView
        style={styles.discoverContainer}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.wordsListContent}
      >
        {discoverWords.map((word) => {
          const isLiked = likedWords.has(word.id);
          const wordLikesCount = likesCount.get(word.id) || 0;
          
          return (
            <View key={word.id} style={styles.wordItemContainer}>
              <WordCard
                tajik={word.tajik}
                english={word.english}
                russian={word.russian}
                explanation={word.explanation}
                ru_explanation={word.ru_explanation}
                examples={word.examples}
              />
              <View style={styles.wordActions}>
                <Pressable
                  style={[
                    styles.actionButton,
                    styles.likeButton,
                    isLiked && styles.likeButtonActive,
                  ]}
                  onPress={() => handleLike(word.id)}
                >
                  <Heart
                    size={20}
                    color={isLiked ? '#ef4444' : '#64748b'}
                    fill={isLiked ? '#ef4444' : 'transparent'}
                  />
                  {wordLikesCount > 0 && (
                    <View style={styles.likesCount}>
                      <Text style={styles.likesCountText}>{wordLikesCount}</Text>
                    </View>
                  )}
                </Pressable>
                <Pressable
                  style={[styles.actionButton, styles.addButton]}
                  onPress={() => handleAddToMyWords(word)}
                >
                  <Plus size={20} color="#fff" />
                </Pressable>
              </View>
            </View>
          );
        })}
      </ScrollView>
    );
  };

  const renderContent = () => {
    if (activeTab === 'myWords') {
      return <StudiedWordsList />;
    }

    return (
      <View style={styles.discoverContainer}>
        <View style={styles.discoverHeader}>
          <TrendingUp size={24} color={colors.primary} style={styles.discoverIcon} />
          <Text style={styles.discoverTitle}>{t('discover') || 'Discover'}</Text>
        </View>
        {renderDiscoverContent()}
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
        },
      ]}
    >
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>
              {t('wordsChamber') || 'Words Chamber'}
            </Text>
            <Text style={styles.subtitle}>
              {t('wordsChamberDesc') || 'Manage and discover new words'}
            </Text>
          </View>

          {/* Tabs */}
          <View style={styles.tabContainer}>
            <TouchableOpacity
              style={[
                styles.tab,
                activeTab === 'myWords' ? styles.activeTab : styles.inactiveTab,
              ]}
              onPress={() => setActiveTab('myWords')}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === 'myWords'
                    ? styles.activeTabText
                    : styles.inactiveTabText,
                ]}
              >
                {t('myWords') || 'My Words'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.tab,
                activeTab === 'discover' ? styles.activeTab : styles.inactiveTab,
              ]}
              onPress={() => setActiveTab('discover')}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === 'discover'
                    ? styles.activeTabText
                    : styles.inactiveTabText,
                ]}
              >
                {t('discover') || 'Discover'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Content */}
          <View style={styles.contentCard}>{renderContent()}</View>
        </View>
      </ScrollView>
    </Animated.View>
  );
};

export default WordsChamber;