import { View, Text, StyleSheet, Pressable, Platform } from 'react-native';
import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import LevelsTab from '@/components/learn/LevelsTab';
import GrammarTab from '@/components/learn/GrammarTab';
import VideosTab from '@/components/learn/VideosTab';
import { Image } from 'react-native';

type TabType = 'levels' | 'grammar' | 'videos';

export default function LearnScreen() {
  const { t, language, colors } = useLanguage();
  const [activeTab, setActiveTab] = useState<TabType>('levels');

  const tabs = [
    { id: 'levels' as TabType, label: language === 'ru' ? 'Уроки' : 'Lessons' },
    { id: 'grammar' as TabType, label: language === 'ru' ? 'Грамматика' : 'Grammar' },
    { id: 'videos' as TabType, label: language === 'ru' ? 'Видео' : 'Videos' },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'levels':
        return <LevelsTab />;
      case 'grammar':
        return <GrammarTab />;
      case 'videos':
        return <VideosTab />;
      default:
        return <LevelsTab />;
    }
  };

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

      <View style={[styles.tabsContainer, { borderBottomColor: colors.border }]}>
        {tabs.map((tab) => (
          <Pressable
            key={tab.id}
            style={[
              styles.tab,
              activeTab === tab.id && [
                styles.activeTab,
                { borderBottomColor: colors.primary }
              ]
            ]}
            onPress={() => setActiveTab(tab.id)}
          >
            <Text
              style={[
                styles.tabText,
                { color: colors.textSecondary },
                activeTab === tab.id && [
                  styles.activeTabText,
                  { color: colors.primary }
                ]
              ]}
            >
              {tab.label}
            </Text>
          </Pressable>
        ))}
      </View>

      {renderContent()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
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
  tabsContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    marginBottom: 16,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 8,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomWidth: 2,
  },
  tabText: {
    fontSize: 15,
    fontWeight: '500',
  },
  activeTabText: {
    fontWeight: '700',
  },
});