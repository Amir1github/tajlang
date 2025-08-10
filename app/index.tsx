import { View, Text, StyleSheet, FlatList, Pressable, Image, Platform } from 'react-native';
import { Link, router } from 'expo-router';
import { Lock, CircleCheck, Book, Trophy, User } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { supabase, type Level, type UserProgress } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';
import { useLanguage } from '@/contexts/LanguageContext';

export default function LearnScreen() {
  const { user } = useAuth();
  const { t, language, colors } = useLanguage();
  const [levels, setLevels] = useState<Level[]>([]);
  const [userProgress, setUserProgress] = useState<UserProgress[]>([]);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    if (user) {
      fetchLevels();
      fetchUserProgress();
    }
  }, [user]);
   const getLevelTitle = (item: Level) => {
    const baseTitle = item.title;
    const translatedTitle = language === 'ru' ? item.ru_title : item.en_title;
    
    if (translatedTitle && translatedTitle !== baseTitle) {
      return `${baseTitle} (${translatedTitle})`;
    }
    
    return baseTitle;
  };

  async function fetchLevels() {
    try {
      const { data, error } = await supabase
        .from('levels')
        .select('*, en_title, ru_title, ru_description')
        .order('order_number');

      if (error) throw error;
      setLevels(data || []);
    } catch (error) {
      console.error('Error fetching levels:', error);
    } finally {
      setLoading(false);
    }
  }
const getLevelDescription = (item: Level) => {
  if (language === 'ru' && item.ru_description) {
    return item.ru_description;
  }
  return item.description;
};

  async function fetchUserProgress() {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('user_progress')
        .select('*')
        .eq('user_id', user.id);

      if (error) throw error;
      setUserProgress(data || []);
    } catch (error) {
      console.error('Error fetching user progress:', error);
    }
  }

  const getLevelStatus = (levelId: string, orderNumber: number) => {
    const progress = userProgress.find(p => p.level_id === levelId);
    const previousLevelCompleted = orderNumber === 1 || 
      userProgress.some(p => 
        p.level_id === levels[orderNumber - 2]?.id && p.completed
      );

    return {
      completed: progress?.completed || false,
      unlocked: previousLevelCompleted,
    };
  };

  const renderLevel = ({ item, index }: { item: Level; index: number }) => {
    const status = getLevelStatus(item.id, item.order_number);
    const isLocked = !status.unlocked;

    const cardContent = (
      <View style={[
        styles.levelCard, 
        { backgroundColor: colors.card, borderColor: colors.border },
        status.completed && { borderColor: colors.success, borderWidth: 2 },
        isLocked && { opacity: 0.7, backgroundColor: colors.background }
      ]}>
        <View style={styles.levelImageContainer}>
          {item.image && (
            <Image
              source={{ uri: item.image }}
              style={styles.levelImage}
              resizeMode="cover"
            />
          )}
          <View style={styles.levelNumber}>
            <Text style={styles.levelNumberText}>{index + 1}</Text>
          </View>
        </View>
        <View style={styles.levelContent}>
          <View style={styles.levelHeader}>
            <Text style={[styles.levelTitle, { color: colors.text }]}>{getLevelTitle(item)}</Text>
            {isLocked ? (
              <Lock size={20} color={colors.textTertiary} />
            ) : status.completed ? (
              <CircleCheck size={20} color={colors.success} />
            ) : null}
          </View>
          <Text style={[styles.levelDescription, { color: colors.textSecondary }]}>
  {getLevelDescription(item)}
</Text>

          <Text style={[
            styles.statusText,
            isLocked ? { color: colors.textTertiary } : status.completed ? { color: colors.success } : { color: colors.primary }
          ]}>
            {isLocked 
              ? t('completePreviousLevel')
              : status.completed 
                ? t('completed')
                : `${t('earn')} ${item.points_value || 100} ${t('points')}`
            }
          </Text>
        </View>
      </View>
    );

    return (
      <View style={styles.levelWrapper}>
        {isLocked ? (
          cardContent
        ) : (
          <Link href={`/level/${item.id}`} asChild>
            <Pressable>
              {cardContent}
            </Pressable>
          </Link>
        )}
      </View>
    );
  };

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.headerContainer}>
          <Image 
            source={require('@/assets/images/icon.png')} 
            style={styles.headerIcon} 
            resizeMode="contain"
          />
          <Text style={[styles.header, { color: colors.text }]}>{t('learn')}</Text>
        </View>
        <Text style={[styles.loadingText, { color: colors.textSecondary }]}>{t('loading')}</Text>
        <View style={[styles.navigationBar, { backgroundColor: colors.card, borderTopColor: colors.border }]}>
          <Pressable 
            style={styles.navButton} 
            onPress={() => router.push('/')}
          >
            <Book size={24} color={colors.primary} />
            <Text style={[styles.navButtonText, { color: colors.primary }]}>{t('learn')}</Text>
          </Pressable>
          <Pressable 
            style={styles.navButton} 
            onPress={() => router.push('/leaderboard')}
          >
            <Trophy size={24} color={colors.primary} />
            <Text style={[styles.navButtonText, { color: colors.primary }]}>{t('leaderboard')}</Text>
          </Pressable>
          <Pressable 
            style={styles.navButton} 
            onPress={() => router.push('/profile')}
          >
            <User size={24} color={colors.primary} />
            <Text style={[styles.navButtonText, { color: colors.primary }]}>{t('profile')}</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.headerContainer}>
        <Image 
          source={require('@/assets/images/icon.png')} 
          style={styles.headerIcon} 
          resizeMode="contain"
        />
        <Text style={[styles.header, { color: colors.text }]}>{t('learn')}</Text>
      </View>
      <FlatList
        data={levels}
        renderItem={renderLevel}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.levelsList}
        ListHeaderComponent={
          <Pressable 
            style={[styles.alphabetButton, { backgroundColor: colors.card, borderColor: colors.border }]}
            onPress={() => router.push('/alphabet')}
          >
            <View style={styles.alphabetButtonContent}>
              <Text style={[styles.alphabetButtonText, { color: colors.primary }]}>
                {language === 'ru' ? 'Алфавит' : 'Alphabet'}
              </Text>
              <Text style={[styles.alphabetButtonSubtext, { color: colors.textSecondary }]}>
                {language === 'ru' ? 'Изучите таджикский алфавит' : 'Learn Tajik alphabet'}
              </Text>
            </View>
          </Pressable>
        }
        ListEmptyComponent={<Text style={[styles.emptyText, { color: colors.textSecondary }]}>{t('noLevels')}</Text>}
        showsVerticalScrollIndicator={true}
        style={styles.scrollContainer}
      />
      
      <View style={[styles.navigationBar, { backgroundColor: colors.card, borderTopColor: colors.border }]}>
        <Pressable 
          style={styles.navButton} 
          onPress={() => router.push('/')}
        >
          <Book size={24} color={colors.primary} />
          <Text style={[styles.navButtonText, { color: colors.primary }]}>{t('learn')}</Text>
        </Pressable>
        <Pressable 
          style={styles.navButton} 
          onPress={() => router.push('/leaderboard')}
        >
          <Trophy size={24} color={colors.primary} />
          <Text style={[styles.navButtonText, { color: colors.primary }]}>{t('leaderboard')}</Text>
        </Pressable>
        <Pressable 
          style={styles.navButton} 
          onPress={() => router.push('/profile')}
        >
          <User size={24} color={colors.primary} />
          <Text style={[styles.navButtonText, { color: colors.primary }]}>{t('profile')}</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
    ...(Platform.OS === 'web' && {
      overflowY: 'scroll',
      scrollbarWidth: 'thin',
    }),
  },
  container: {

    flex: 1,
    
    paddingBottom: 80, // Space for navigation bar
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    paddingTop: 8,
  },
  headerIcon: {
    width: 48,
    height: 48,
    marginRight: 12,
  },
  header: {
    fontSize: 28,
    fontWeight: '700',
  },
  
  levelWrapper: {
    marginBottom: 16,
    alignItems: 'center',
    width: '100%', // Добавляем ширину
  },
  levelCard: {
    borderRadius: 16,
    overflow: 'hidden',
    width: '100%',
    maxWidth: 600, // Добавляем максимальную ширину для всех карточек
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
    borderWidth: 1,
  },
  levelImageContainer: {
    position: 'relative',
    width: '100%',
    height: 160,
  },
  levelImage: {
    width: '100%',
    height: '100%',
  },
  levelContent: {
    padding: 16,
  },
  levelHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  levelTitle: {
    fontSize: 18,
    fontWeight: '600',
    flex: 1,
  },
  levelDescription: {
    fontSize: 14,
    marginBottom: 12,
    lineHeight: 20,
  },
  statusText: {
    fontSize: 13,
    fontWeight: '600',
  },
  levelNumber: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: '#4f46e5',
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#ffffff',
  },
  levelNumberText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  loadingText: {
    fontSize: 15,
    textAlign: 'center',
    marginTop: 24,
  },
  emptyText: {
    fontSize: 15,
    textAlign: 'center',
    marginTop: 24,
  },
  navigationBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    borderTopWidth: 1,
    height: 60,
    paddingVertical: 8,
    paddingHorizontal: 16,
    justifyContent: 'space-around',
  },
  navButton: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  navButtonText: {
    fontSize: 12,
    marginTop: 4,
  },
  alphabetButton: {
    width: '40%', // Добавлено
  alignSelf: 'center', // Добавлено
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
      },
      android: {
        elevation: 3,
      },
      web: {
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.08)',
      },
    }),
    borderWidth: 1,
  },
  alphabetButtonContent: {
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  alphabetButtonText: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
  },
  alphabetButtonSubtext: {
    fontSize: 14,
  },

  
});