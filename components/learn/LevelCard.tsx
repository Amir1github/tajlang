import { View, Text, StyleSheet, Pressable, Image, Platform } from 'react-native';
import { Link } from 'expo-router';
import { Lock, CircleCheck } from 'lucide-react-native';
import { useLanguage } from '@/contexts/LanguageContext';
import type { Level } from '@/lib/supabase';

interface LevelCardProps {
  level: Level;
  index: number;
  status: {
    completed: boolean;
    unlocked: boolean;
  };
}

export default function LevelCard({ level, index, status }: LevelCardProps) {
  const { t, language, colors } = useLanguage();
  const isLocked = !status.unlocked;

  const getLevelTitle = () => {
    const baseTitle = level.title;
    const translatedTitle = language === 'ru' ? level.ru_title : level.en_title;
    
    if (translatedTitle && translatedTitle !== baseTitle) {
      return `${baseTitle} (${translatedTitle})`;
    }
    
    return baseTitle;
  };

  const getLevelDescription = () => {
    if (language === 'ru' && level.ru_description) {
      return level.ru_description;
    }
    return level.description;
  };

  const cardContent = (
    <View style={[
      styles.levelCard, 
      { backgroundColor: colors.card, borderColor: colors.border },
      status.completed && { borderColor: colors.success, borderWidth: 2 },
      isLocked && { opacity: 0.7, backgroundColor: colors.background }
    ]}>
      <View style={styles.levelImageContainer}>
        {level.image && (
          <Image
            source={{ uri: level.image }}
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
          <Text style={[styles.levelTitle, { color: colors.text }]}>
            {getLevelTitle()}
          </Text>
          {isLocked ? (
            <Lock size={20} color={colors.textTertiary} />
          ) : status.completed ? (
            <CircleCheck size={20} color={colors.success} />
          ) : null}
        </View>
        <Text style={[styles.levelDescription, { color: colors.textSecondary }]}>
          {getLevelDescription()}
        </Text>

        <Text style={[
          styles.statusText,
          isLocked 
            ? { color: colors.textTertiary } 
            : status.completed 
              ? { color: colors.success } 
              : { color: colors.primary }
        ]}>
          {isLocked 
            ? t('completePreviousLevel')
            : status.completed 
              ? t('completed')
              : `${t('earn')} ${level.points_value || 100} ${t('points')}`
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
        <Link href={`/level/${level.id}`} asChild>
          <Pressable>
            {cardContent}
          </Pressable>
        </Link>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  levelWrapper: {
    marginBottom: 16,
    alignItems: 'center',
    width: '100%',
  },
  levelCard: {
    borderRadius: 16,
    overflow: 'hidden',
    width: '100%',
    maxWidth: 600,
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
});