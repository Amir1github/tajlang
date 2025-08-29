import React, { useRef } from "react";
import { 
  ScrollView, 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  Dimensions,
  StatusBar,
  Animated
} from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
const { width } = Dimensions.get('window');

export default function Grammar() {
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

  const lessons = [
    { title: "Adjectives", path: "/grammar_components/adjectives", icon: "📝" },
    { title: "Nouns", path: "/grammar_components/nouns", icon: "📖" },
    { title: "Plural", path: "/grammar_components/plural", icon: "🔤" },
    { title: "Gender", path: "/grammar_components/gender", icon: "⚖️" },
    { title: "Numbers", path: "/grammar_components/numbers", icon: "🔢" },
    { title: "Phrases", path: "/grammar_components/phrases", icon: "💬" },
    { title: "Grammar Rules", path: "/grammar_components/grammar", icon: "📘" },
    { title: "Vocabulary", path: "/grammar_components/vocabulary", icon: "🔤" },
    { title: "Verbs", path: "/grammar_components/verbs", icon: "⚡" },
    { title: "Exam", path: "/grammar_components/exam", icon: "📊" },
    { title: "Audio", path: "/grammar_components/audio", icon: "🎵" },
    { title: "Translation", path: "/grammar_components/translation", icon: "🌐" },
    { title: "500 Popular Words", path: "/grammar_components/popular-words", icon: "📚" },
    { title: "Alphabet", path: "/grammar_components/alphabet", icon: "🔤" },
  ];

 

  const handleLessonPress = (path: string) => {
    router.push(path as any);
  };

  const handleNavPress = (path: string) => {
    router.push(path as any);
  };

  const AnimatedTouchable = ({ children, onPress, delay = 0, style }) => {
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

  const renderLessonButton = (item, index) => (
    <AnimatedTouchable
      key={index}
      style={[styles.lessonButton, { width: (width - 48) / 2 }]}
      onPress={() => handleLessonPress(item.path)}
      delay={index * 100}
    >
      <View style={styles.lessonCard}>
        <Text style={styles.lessonIcon}>{item.icon}</Text>
        <Text style={styles.lessonButtonText}>{item.title}</Text>
        <View style={styles.lessonAccent} />
      </View>
    </AnimatedTouchable>
  );

  const renderNavButton = (item, index) => (
    <AnimatedTouchable
      key={index}
      style={styles.navButton}
      onPress={() => handleNavPress(item.path)}
      delay={index * 50}
    >
      <View style={styles.navCard}>
        <Text style={styles.navIcon}>{item.icon}</Text>
        <Text style={styles.navButtonText}>{item.title}</Text>
      </View>
    </AnimatedTouchable>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.homeButton}
          onPress={() => router.push('/')}
          activeOpacity={0.7}
        >
          <Text style={styles.homeButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Grammar Lessons</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Welcome Section */}
        <Animated.View style={[
          styles.welcomeSection,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }]
          }
        ]}>
          <Text style={styles.welcomeTitle}>Master Tajik Grammar</Text>
          <Text style={styles.welcomeText}>
            Build a solid foundation with structured lessons covering all essential grammar topics.
          </Text>
          <View style={styles.progressIndicator}>
            <View style={styles.progressBar} />
            <Text style={styles.progressText}>14 Topics Available</Text>
          </View>
        </Animated.View>

       

        {/* Lessons Grid */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>All Topics</Text>
          <View style={styles.lessonsGrid}>
            {lessons.map((item, index) => renderLessonButton(item, index))}
          </View>
        </View>

        {/* Study Tips */}
        <Animated.View style={[
          styles.tipsSection,
          {
            opacity: fadeAnim,
          }
        ]}>
          <Text style={styles.tipsTitle}>💡 Study Tips</Text>
          <Text style={styles.tipsText}>
            Start with basics like nouns and adjectives, then progress to more complex topics like verbs and sentence structure.
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
    backgroundColor: "#f8fafc",
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: StatusBar.currentHeight || 44,
    paddingBottom: 16,
    paddingHorizontal: 20,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  homeButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#f1f5f9',
  },
  homeButtonText: {
    color: "#475569",
    fontSize: 16,
    fontWeight: "500",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1e293b",
    letterSpacing: -0.5,
  },
  headerSpacer: {
    width: 60,
  },
  scrollView: {
    flex: 1,
  },
  welcomeSection: {
    backgroundColor: "#ffffff",
    margin: 20,
    padding: 24,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  welcomeTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: "#0f172a",
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  welcomeText: {
    fontSize: 16,
    color: "#64748b",
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
    backgroundColor: '#3b82f6',
    borderRadius: 2,
    marginRight: 12,
  },
  progressText: {
    fontSize: 14,
    color: '#64748b',
    fontWeight: '500',
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1e293b",
    marginHorizontal: 20,
    marginBottom: 16,
    letterSpacing: -0.3,
  },
  navScrollContainer: {
    paddingHorizontal: 20,
  },
  navButton: {
    marginRight: 12,
  },
  navCard: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    minWidth: 100,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  navIcon: {
    fontSize: 20,
    marginBottom: 8,
  },
  navButtonText: {
    color: "#475569",
    fontSize: 12,
    fontWeight: "600",
    textAlign: 'center',
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
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 120,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    position: 'relative',
    overflow: 'hidden',
  },
  lessonAccent: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: '#3b82f6',
  },
  lessonIcon: {
    fontSize: 28,
    marginBottom: 12,
  },
  lessonButtonText: {
    color: "#374151",
    fontSize: 14,
    fontWeight: "600",
    textAlign: 'center',
    lineHeight: 18,
  },
  tipsSection: {
    backgroundColor: "#fff7ed",
    margin: 20,
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#fed7aa',
  },
  tipsTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#9a3412",
    marginBottom: 8,
  },
  tipsText: {
    fontSize: 14,
    color: "#c2410c",
    lineHeight: 20,
  },
  bottomSpacer: {
    height: 20,
  },
});