import React, { useRef } from "react";
import { 
  ScrollView, 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  Dimensions,
  Animated,
  Platform
} from "react-native";
import { router } from 'expo-router';
import { useLanguage } from '@/contexts/LanguageContext';

const { width } = Dimensions.get('window');

interface Lesson {
  title: string;
  titleRu: string;
  path: string;
  icon: string;
}

export default function GrammarTab() {
  const { language, colors } = useLanguage();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  React.useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      })
    ]).start();
  }, []);

  const lessons: Lesson[] = [
    { 
      title: "Adjectives", 
      titleRu: "Прилагательные",
      path: "/grammar_components/adjectives", 
      icon: "📝" 
    },
    { 
      title: "Nouns", 
      titleRu: "Существительные",
      path: "/grammar_components/nouns", 
      icon: "📖" 
    },
    { 
      title: "Plural", 
      titleRu: "Множественное число",
      path: "/grammar_components/plural", 
      icon: "🔤" 
    },
    { 
      title: "Gender", 
      titleRu: "Род",
      path: "/grammar_components/gender", 
      icon: "⚖️" 
    },
    { 
      title: "Numbers", 
      titleRu: "Числа",
      path: "/grammar_components/numbers", 
      icon: "🔢" 
    },
    { 
      title: "Phrases", 
      titleRu: "Фразы",
      path: "/grammar_components/phrases", 
      icon: "💬" 
    },
    { 
      title: "Grammar Rules", 
      titleRu: "Правила грамматики",
      path: "/grammar_components/grammar", 
      icon: "📘" 
    },
    { 
      title: "Vocabulary", 
      titleRu: "Словарный запас",
      path: "/grammar_components/vocabulary", 
      icon: "🔤" 
    },
    { 
      title: "Verbs", 
      titleRu: "Глаголы",
      path: "/grammar_components/verbs", 
      icon: "⚡" 
    }
  ];

  const handleLessonPress = (path: string) => {
    router.push(path as any);
  };

  const AnimatedTouchable = ({ children, onPress, delay = 0, style }: any) => {
    const scaleAnim = useRef(new Animated.Value(1)).current;
    const itemFadeAnim = useRef(new Animated.Value(0)).current;

    React.useEffect(() => {
      Animated.timing(itemFadeAnim, {
        toValue: 1,
        duration: 500,
        delay: delay,
        useNativeDriver: true,
      }).start();
    }, []);

    const handlePressIn = () => {
      Animated.spring(scaleAnim, {
        toValue: 0.95,
        useNativeDriver: true,
      }).start();
    };

    const handlePressOut = () => {
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
      }).start();
    };

    return (
      <Animated.View style={{
        opacity: itemFadeAnim,
        transform: [{ scale: scaleAnim }]
      }}>
        <TouchableOpacity
          style={style}
          onPress={onPress}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          activeOpacity={1}
        >
          {children}
        </TouchableOpacity>
      </Animated.View>
    );
  };

  const renderLessonButton = (item: Lesson, index: number) => (
    <AnimatedTouchable
      key={index}
      style={[styles.lessonButton, { width: (width - 64) / 2 }]}
      onPress={() => handleLessonPress(item.path)}
      delay={index * 100}
    >
      <View style={[
        styles.lessonCard,
        { 
          backgroundColor: colors.card,
          borderColor: colors.border
        }
      ]}>
        <Text style={styles.lessonIcon}>{item.icon}</Text>
        <Text style={[styles.lessonButtonText, { color: colors.text }]}>
          {language === 'ru' ? item.titleRu : item.title}
        </Text>
        <View style={[styles.lessonAccent, { backgroundColor: colors.primary }]} />
      </View>
    </AnimatedTouchable>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView 
        style={styles.scrollView} 
        showsVerticalScrollIndicator={Platform.OS !== 'web'}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Welcome Section */}
        <Animated.View style={[
          styles.welcomeSection,
          {
            backgroundColor: colors.card,
            borderColor: colors.border,
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }]
          }
        ]}>
          <Text style={[styles.welcomeTitle, { color: colors.text }]}>
            {language === 'ru' ? 'Освойте таджикскую грамматику' : 'Master Tajik Grammar'}
          </Text>
          <Text style={[styles.welcomeText, { color: colors.textSecondary }]}>
            {language === 'ru' 
              ? 'Создайте прочную основу с структурированными уроками, охватывающими все важные темы грамматики.'
              : 'Build a solid foundation with structured lessons covering all essential grammar topics.'
            }
          </Text>
          <View style={styles.progressIndicator}>
            <View style={[styles.progressBar, { backgroundColor: colors.primary }]} />
            <Text style={[styles.progressText, { color: colors.textSecondary }]}>
              {language === 'ru' ? '9 тем доступно' : '9 Topics Available'}
            </Text>
          </View>
        </Animated.View>

        {/* Lessons Grid */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            {language === 'ru' ? 'Все темы' : 'All Topics'}
          </Text>
          <View style={styles.lessonsGrid}>
            {lessons.map((item, index) => renderLessonButton(item, index))}
          </View>
        </View>

        {/* Study Tips */}
        <Animated.View style={[
          styles.tipsSection,
          {
            backgroundColor: colors.card,
            borderColor: colors.border,
            opacity: fadeAnim,
          }
        ]}>
          <Text style={[styles.tipsTitle, { color: colors.primary }]}>
            💡 {language === 'ru' ? 'Советы по учебе' : 'Study Tips'}
          </Text>
          <Text style={[styles.tipsText, { color: colors.textSecondary }]}>
            {language === 'ru'
              ? 'Начните с основ, таких как существительные и прилагательные, затем переходите к более сложным темам, таким как глаголы и структура предложений.'
              : 'Start with basics like nouns and adjectives, then progress to more complex topics like verbs and sentence structure.'
            }
          </Text>
        </Animated.View>

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  welcomeSection: {
    margin: 20,
    marginTop: 8,
    padding: 24,
    borderRadius: 16,
    borderWidth: 1,
  },
  welcomeTitle: {
    fontSize: 24,
    fontWeight: "800",
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  welcomeText: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 16,
  },
  progressIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  progressBar: {
    width: 40,
    height: 4,
    borderRadius: 2,
    marginRight: 12,
  },
  progressText: {
    fontSize: 14,
    fontWeight: '500',
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginHorizontal: 20,
    marginBottom: 16,
    letterSpacing: -0.3,
  },
  lessonsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  lessonButton: {
    marginBottom: 16,
  },
  lessonCard: {
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 120,
    borderWidth: 1,
    position: 'relative',
    overflow: 'hidden',
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
  lessonAccent: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 3,
  },
  lessonIcon: {
    fontSize: 28,
    marginBottom: 12,
  },
  lessonButtonText: {
    fontSize: 14,
    fontWeight: "600",
    textAlign: 'center',
    lineHeight: 18,
  },
  tipsSection: {
    margin: 20,
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
  },
  tipsTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 8,
  },
  tipsText: {
    fontSize: 14,
    lineHeight: 20,
  },
  bottomSpacer: {
    height: 20,
  },
});