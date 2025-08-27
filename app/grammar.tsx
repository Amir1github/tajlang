import React, { useState } from "react";
import { 
  ScrollView, 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  Modal,
  Dimensions,
  StatusBar
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from 'expo-linear-gradient';
import { Link, router } from 'expo-router';
const { width } = Dimensions.get('window');

export default function Grammar() {
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);

  const lessons = [
    { title: "Adjectives", screen: "AdjectivesScreen", icon: "📝", color: ["#667eea", "#764ba2"] },
    { title: "Nouns", screen: "NounsScreen", icon: "📖", color: ["#f093fb", "#f5576c"] },
    { title: "Plural", screen: "PluralScreen", icon: "🔤", color: ["#4facfe", "#00f2fe"] },
    { title: "Gender", screen: "GenderScreen", icon: "⚖️", color: ["#43e97b", "#38f9d7"] },
    { title: "Numbers", screen: "NumbersScreen", icon: "🔢", color: ["#fa709a", "#fee140"] },
    { title: "Phrases", screen: "PhrasesScreen", icon: "💬", color: ["#a8edea", "#fed6e3"] },
    { title: "Grammar", screen: "GrammarScreen", icon: "📘", color: ["#ff9a9e", "#fecfef"] },
    { title: "Vocabulary", screen: "VocabularyScreen", icon: "🔤", color: ["#ffecd2", "#fcb69f"] },
    { title: "Verbs", screen: "VerbsScreen", icon: "⚡", color: ["#a8edea", "#fed6e3"] },
    { title: "Exam", screen: "ExamScreen", icon: "📊", color: ["#d299c2", "#fef9d3"] },
    { title: "Audio", screen: "AudioScreen", icon: "🎵", color: ["#89f7fe", "#66a6ff"] },
    { title: "Translation", screen: "TranslationScreen", icon: "🌐", color: ["#fdbb2d", "#22c1c3"] },
    { title: "500 Popular Words", screen: "Voc500Screen", icon: "📚", color: ["#e3ffe7", "#d9e7ff"] },
    { title: "Alphabet", screen: "AlphabetScreen", icon: "🔤", color: ["#ffeaa7", "#fab1a0"] },
  ];

  const mainNav = [
    { title: "Homepage", screen: "HomepageScreen", icon: "🏠", color: ["#667eea", "#764ba2"] },
    { title: "Vocabulary", screen: "VocabularyScreen", icon: "🔤", color: ["#f093fb", "#f5576c"] },
    { title: "Numbers", screen: "NumbersScreen", icon: "🔢", color: ["#4facfe", "#00f2fe"] },
    { title: "Phrases", screen: "PhrasesScreen", icon: "💬", color: ["#43e97b", "#38f9d7"] },
    { title: "Grammar", screen: "GrammarScreen", icon: "📘", color: ["#fa709a", "#fee140"] },
    { title: "More", screen: "MoreScreen", icon: "⋯", color: ["#a8edea", "#fed6e3"] },
  ];

  const handleLessonPress = () => {
    setModalVisible(true);
  };

  const renderLessonButton = (item, index) => (
    <TouchableOpacity
      key={index}
      style={[styles.lessonButton, { width: (width - 48) / 2 }]}
      onPress={handleLessonPress}
      activeOpacity={0.8}
    >
      <LinearGradient
        colors={item.color}
        style={styles.gradientButton}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <Text style={styles.lessonIcon}>{item.icon}</Text>
        <Text style={styles.lessonButtonText}>{item.title}</Text>
      </LinearGradient>
    </TouchableOpacity>
  );

  const renderNavButton = (item, index) => (
    <TouchableOpacity
      key={index}
      style={styles.navButton}
      onPress={handleLessonPress}
      activeOpacity={0.8}
    >
      <LinearGradient
        colors={item.color}
        style={styles.navGradientButton}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <Text style={styles.navIcon}>{item.icon}</Text>
        <Text style={styles.navButtonText}>{item.title}</Text>
      </LinearGradient>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#667eea" />
      
      {/* Header with Home Button */}
      <LinearGradient
        colors={['#667eea', '#764ba2']}
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <TouchableOpacity 
          style={styles.homeButton}
          onPress={() => router.push('/')}
          activeOpacity={0.8}
        >
          <Text style={styles.homeButtonText}>🏠 Home</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Learn Tajik</Text>
        <View style={styles.headerSpacer} />
      </LinearGradient>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Welcome Section */}
        <View style={styles.welcomeSection}>
          <Text style={styles.welcomeTitle}>Welcome to Tajik Lessons! 🎯</Text>
          <Text style={styles.welcomeText}>
            I'm here to help you <Text style={styles.bold}>learn Tajik</Text> step by step. 
            All lessons contain audio and are offered for free. We'll learn the{" "}
            <Text style={styles.bold}>alphabet</Text> together, review{" "}
            <Text style={styles.bold}>grammar</Text> rules, practice{" "}
            <Text style={styles.bold}>phrases</Text>, and memorize important{" "}
            <Text style={styles.bold}>vocabulary</Text>.
          </Text>
          <Text style={styles.subWelcomeText}>
            Choose a lesson below or start with me step by step! 🚀
          </Text>
        </View>

        {/* Quick Navigation */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Navigation</Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.navScrollContainer}
          >
            {mainNav.map((item, index) => renderNavButton(item, index))}
          </ScrollView>
        </View>

        {/* Lessons Grid */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>All Lessons</Text>
          <View style={styles.lessonsGrid}>
            {lessons.map((item, index) => renderLessonButton(item, index))}
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Ready to start your Tajik learning journey? Let's begin! 🌟
          </Text> 
        </View>
      </ScrollView>

      {/* Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalIcon}>🚧</Text>
            <Text style={styles.modalTitle}>В разработке</Text>
            <Text style={styles.modalText}>
              Эта часть приложения находится в разработке. Пожалуйста, попробуйте позже!
            </Text>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => setModalVisible(false)}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={['#667eea', '#764ba2']}
                style={styles.modalButtonGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Text style={styles.modalButtonText}>Понятно</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
    paddingHorizontal: 16,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  homeButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  homeButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    textAlign: 'center',
  },
  headerSpacer: {
    width: 70, // Same width as home button to center title
  },
  scrollView: {
    flex: 1,
  },
  welcomeSection: {
    backgroundColor: "#fff",
    margin: 16,
    padding: 20,
    borderRadius: 20,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  welcomeTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#1f2937",
    marginBottom: 12,
    textAlign: 'center',
  },
  welcomeText: {
    fontSize: 16,
    color: "#4b5563",
    lineHeight: 24,
    marginBottom: 12,
    textAlign: 'center',
  },
  subWelcomeText: {
    fontSize: 14,
    color: "#6b7280",
    textAlign: 'center',
    fontStyle: 'italic',
  },
  bold: {
    fontWeight: "bold",
    color: "#111827",
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1f2937",
    marginHorizontal: 16,
    marginBottom: 16,
  },
  navScrollContainer: {
    paddingHorizontal: 16,
  },
  navButton: {
    marginRight: 12,
  },
  navGradientButton: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 25,
    alignItems: 'center',
    minWidth: 100,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  navIcon: {
    fontSize: 20,
    marginBottom: 4,
  },
  navButtonText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
    textAlign: 'center',
  },
  lessonsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  lessonButton: {
    marginBottom: 16,
  },
  gradientButton: {
    padding: 20,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 120,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  lessonIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  lessonButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
    textAlign: 'center',
  },
  footer: {
    backgroundColor: "#fff",
    margin: 16,
    padding: 20,
    borderRadius: 20,
    alignItems: 'center',
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  footerText: {
    fontSize: 16,
    color: "#4b5563",
    textAlign: 'center',
    fontWeight: "500",
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 30,
    alignItems: 'center',
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    width: width * 0.85,
    maxWidth: 320,
  },
  modalIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 12,
    textAlign: 'center',
  },
  modalText: {
    fontSize: 16,
    color: '#4b5563',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
  },
  modalButton: {
    width: '100%',
  },
  modalButtonGradient: {
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 25,
    alignItems: 'center',
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});