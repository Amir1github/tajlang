import { View, Text, StyleSheet, Pressable, ScrollView, Platform } from 'react-native';
import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Image } from 'react-native';
import { 
  Users, 
  Code, 
  Trophy, 
  MessageSquare, 
  Heart, 
  Plus,
  BookOpen,
  Globe,
  Lightbulb,
  Award,
  Star,
  Share2,
  ThumbsUp,
  ChevronRight
} from 'lucide-react-native';

type TabType = 'labs' | 'social';

export default function CommunityScreen() {
  const { t, language, colors } = useLanguage();
  const [activeTab, setActiveTab] = useState<TabType>('labs');

  const tabs = [
    { 
      id: 'labs' as TabType, 
      label: language === 'ru' ? 'TajLang Labs' : 'TajLang Labs',
      icon: Code
    },
    { 
      id: 'social' as TabType, 
      label: language === 'ru' ? 'TajLang Social' : 'TajLang Social',
      icon: Users
    },
  ];

  const labsFeatures = [
    {
      icon: Users,
      title: language === 'ru' ? 'Коллаборации' : 'Collaborations',
      description: language === 'ru' 
        ? 'Учёные, лингвисты, программисты и студенты работают вместе над улучшением таджикского ИИ'
        : 'Scientists, linguists, programmers and students work together to improve Tajik AI'
    },
    {
      icon: Trophy,
      title: language === 'ru' ? 'Hackathon & AI Challenge' : 'Hackathon & AI Challenge',
      description: language === 'ru'
        ? 'Проводим конкурсы и челленджи для развития таджикского языка в ИИ'
        : 'We host competitions and challenges to develop Tajik language in AI'
    },
    {
      icon: Code,
      title: language === 'ru' ? 'Исследования' : 'Research',
      description: language === 'ru'
        ? 'Совместные проекты по машинному обучению и обработке естественного языка'
        : 'Joint projects in machine learning and natural language processing'
    }
  ];

  const socialFeatures = [
    {
      icon: Plus,
      title: language === 'ru' ? 'Добавление слов' : 'Add Words',
      description: language === 'ru'
        ? 'Пользователи добавляют новые слова и примеры использования'
        : 'Users add new words and usage examples'
    },
    {
      icon: ThumbsUp,
      title: language === 'ru' ? 'Голосование' : 'Voting',
      description: language === 'ru'
        ? 'Голосуйте за правильные переводы и лучшие примеры'
        : 'Vote for correct translations and best examples'
    },
    {
      icon: MessageSquare,
      title: language === 'ru' ? 'Сообщество' : 'Community',
      description: language === 'ru'
        ? 'Делитесь мемами, историями и общайтесь на таджикском'
        : 'Share memes, stories and communicate in Tajik'
    }
  ];

  const upcomingEvents = [
    {
      title: language === 'ru' ? 'TajLang AI Challenge 2024' : 'TajLang AI Challenge 2024',
      date: language === 'ru' ? '15-30 марта' : 'March 15-30',
      participants: language === 'ru' ? '150+ участников' : '150+ participants',
      prize: language === 'ru' ? 'Призовой фонд: $10,000' : 'Prize pool: $10,000'
    },
    {
      title: language === 'ru' ? 'Лингвистический Hackathon' : 'Linguistic Hackathon',
      date: language === 'ru' ? '5-7 апреля' : 'April 5-7',
      participants: language === 'ru' ? '80+ участников' : '80+ participants',
      prize: language === 'ru' ? 'Призовой фонд: $5,000' : 'Prize pool: $5,000'
    }
  ];

  const communityStats = [
    {
      icon: Users,
      value: '2,500+',
      label: language === 'ru' ? 'Участников' : 'Members'
    },
    {
      icon: BookOpen,
      value: '15,000+',
      label: language === 'ru' ? 'Слов добавлено' : 'Words Added'
    },
    {
      icon: MessageSquare,
      value: '8,500+',
      label: language === 'ru' ? 'Сообщений' : 'Messages'
    },
    {
      icon: Star,
      value: '4.9',
      label: language === 'ru' ? 'Рейтинг' : 'Rating'
    }
  ];

  const renderLabsContent = () => (
    <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
      {/* Header Section */}
      <View style={[styles.section, { backgroundColor: colors.card }]}>
        <View style={styles.sectionHeader}>
          <Globe size={32} color={colors.primary} />
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            {language === 'ru' ? 'Платформа для коллабораций' : 'Collaboration Platform'}
          </Text>
        </View>
        <Text style={[styles.sectionDescription, { color: colors.textSecondary }]}>
          {language === 'ru' 
            ? 'Учёные, лингвисты, программисты, студенты — совместно улучшают таджикский ИИ'
            : 'Scientists, linguists, programmers, students — together improving Tajik AI'
          }
        </Text>
      </View>

      {/* Features */}
      <View style={styles.section}>
        <Text style={[styles.subsectionTitle, { color: colors.text }]}>
          {language === 'ru' ? 'Возможности' : 'Features'}
        </Text>
        {labsFeatures.map((feature, index) => (
          <View key={index} style={[styles.featureCard, { backgroundColor: colors.card }]}>
            <View style={[styles.featureIcon, { backgroundColor: colors.primary + '20' }]}>
              <feature.icon size={24} color={colors.primary} />
            </View>
            <View style={styles.featureContent}>
              <Text style={[styles.featureTitle, { color: colors.text }]}>{feature.title}</Text>
              <Text style={[styles.featureDescription, { color: colors.textSecondary }]}>
                {feature.description}
              </Text>
            </View>
          </View>
        ))}
      </View>

      {/* Upcoming Events */}
      <View style={styles.section}>
        <Text style={[styles.subsectionTitle, { color: colors.text }]}>
          {language === 'ru' ? 'Предстоящие события' : 'Upcoming Events'}
        </Text>
        {upcomingEvents.map((event, index) => (
          <View key={index} style={[styles.eventCard, { backgroundColor: colors.card }]}>
            <View style={styles.eventHeader}>
              <Text style={[styles.eventTitle, { color: colors.text }]}>{event.title}</Text>
              <Text style={[styles.eventDate, { color: colors.primary }]}>{event.date}</Text>
            </View>
            <View style={styles.eventDetails}>
              <Text style={[styles.eventDetail, { color: colors.textSecondary }]}>
                👥 {event.participants}
              </Text>
              <Text style={[styles.eventDetail, { color: colors.textSecondary }]}>
                💰 {event.prize}
              </Text>
            </View>
            <Pressable style={[styles.joinButton, { backgroundColor: colors.primary }]}>
              <Text style={styles.joinButtonText}>
                {language === 'ru' ? 'Участвовать' : 'Join'}
              </Text>
              <ChevronRight size={16} color="#fff" />
            </Pressable>
          </View>
        ))}
      </View>
    </ScrollView>
  );

  const renderSocialContent = () => (
    <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
      {/* Header Section */}
      <View style={[styles.section, { backgroundColor: colors.card }]}>
        <View style={styles.sectionHeader}>
          <Users size={32} color={colors.primary} />
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            {language === 'ru' ? 'Сообщество TajLang' : 'TajLang Community'}
          </Text>
        </View>
        <Text style={[styles.sectionDescription, { color: colors.textSecondary }]}>
          {language === 'ru' 
            ? 'Место, где пользователи добавляют новые слова, голосуют за переводы и делятся контентом на таджикском'
            : 'A place where users add new words, vote for translations and share content in Tajik'
          }
        </Text>
      </View>

      {/* Community Stats */}
      <View style={styles.section}>
        <Text style={[styles.subsectionTitle, { color: colors.text }]}>
          {language === 'ru' ? 'Статистика сообщества' : 'Community Stats'}
        </Text>
        <View style={styles.statsGrid}>
          {communityStats.map((stat, index) => (
            <View key={index} style={[styles.statCard, { backgroundColor: colors.card }]}>
              <stat.icon size={24} color={colors.primary} />
              <Text style={[styles.statValue, { color: colors.text }]}>{stat.value}</Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>{stat.label}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Features */}
      <View style={styles.section}>
        <Text style={[styles.subsectionTitle, { color: colors.text }]}>
          {language === 'ru' ? 'Возможности' : 'Features'}
        </Text>
        {socialFeatures.map((feature, index) => (
          <View key={index} style={[styles.featureCard, { backgroundColor: colors.card }]}>
            <View style={[styles.featureIcon, { backgroundColor: colors.primary + '20' }]}>
              <feature.icon size={24} color={colors.primary} />
            </View>
            <View style={styles.featureContent}>
              <Text style={[styles.featureTitle, { color: colors.text }]}>{feature.title}</Text>
              <Text style={[styles.featureDescription, { color: colors.textSecondary }]}>
                {feature.description}
              </Text>
            </View>
          </View>
        ))}
      </View>

      {/* Quick Actions */}
      <View style={styles.section}>
        <Text style={[styles.subsectionTitle, { color: colors.text }]}>
          {language === 'ru' ? 'Быстрые действия' : 'Quick Actions'}
        </Text>
        <View style={styles.quickActions}>
          <Pressable style={[styles.actionButton, { backgroundColor: colors.primary }]}>
            <Plus size={20} color="#fff" />
            <Text style={styles.actionButtonText}>
              {language === 'ru' ? 'Добавить слово' : 'Add Word'}
            </Text>
          </Pressable>
          <Pressable style={[styles.actionButton, { backgroundColor: colors.card, borderColor: colors.primary, borderWidth: 1 }]}>
            <MessageSquare size={20} color={colors.primary} />
            <Text style={[styles.actionButtonText, { color: colors.primary }]}>
              {language === 'ru' ? 'Чат' : 'Chat'}
            </Text>
          </Pressable>
        </View>
      </View>
    </ScrollView>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'labs':
        return renderLabsContent();
      case 'social':
        return renderSocialContent();
      default:
        return renderLabsContent();
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
        <Text style={[styles.header, { color: colors.text }]}>
          {language === 'ru' ? 'Сообщество' : 'Community'}
        </Text>
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
            <tab.icon 
              size={20} 
              color={activeTab === tab.id ? colors.primary : colors.textSecondary} 
              style={styles.tabIcon}
            />
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
    flexDirection: 'row',
    justifyContent: 'center',
  },
  tabIcon: {
    marginRight: 8,
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
  content: {
    flex: 1,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginLeft: 12,
  },
  sectionDescription: {
    fontSize: 16,
    lineHeight: 24,
  },
  subsectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  featureCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
      web: {
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
      },
    }),
  },
  featureIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
  eventCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
      web: {
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
      },
    }),
  },
  eventHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
    marginRight: 12,
  },
  eventDate: {
    fontSize: 14,
    fontWeight: '500',
  },
  eventDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  eventDetail: {
    fontSize: 14,
  },
  joinButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  joinButtonText: {
    color: '#fff',
    fontWeight: '600',
    marginRight: 8,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statCard: {
    width: '48%',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
      web: {
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
      },
    }),
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    marginTop: 8,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    textAlign: 'center',
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginHorizontal: 6,
  },
  actionButtonText: {
    color: '#fff',
    fontWeight: '600',
    marginLeft: 8,
    fontSize: 16,
  },
});
