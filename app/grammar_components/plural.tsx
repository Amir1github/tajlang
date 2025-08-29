import React, { useRef } from 'react';
import {
  ScrollView,
  View,
  StyleSheet,
  StatusBar,
  Animated,
  Dimensions,
  Text,
} from 'react-native';
import { router } from 'expo-router';

// Импорт компонентов
import Section from './blocks/Section';
import ExamplesSection from './blocks/ExamplesSection';
import QuoteSection from './blocks/QuoteSection';
import WordCard from './blocks/WordCard';
import PageHeader from './blocks/PageHeader';
import IntroSection from './blocks/IntroSection';

const { width, height } = Dimensions.get('window');

// Responsive breakpoints
const isTablet = width >= 768;
const isSmallPhone = width < 350;
const isLandscape = width > height;

// Responsive utility functions
const getResponsiveValue = (small: number, medium: number, large: number) => {
  if (isSmallPhone) return small;
  if (isTablet) return large;
  return medium;
};

const getFontSize = (baseSize: number) => {
  const scaleFactor = isSmallPhone ? 0.9 : isTablet ? 1.2 : 1;
  return Math.round(baseSize * scaleFactor);
};

const getSpacing = (baseSpacing: number) => {
  return getResponsiveValue(baseSpacing * 0.8, baseSpacing, baseSpacing * 1.2);
};

export default function TajikPlural() {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, []);

  const pluralExamples = [
    {
      singular: 'book',
      singularTajik: 'китоб',
      singularPron: '[kitob]',
      plural: 'books',
      pluralTajik: 'китобҳо',
      pluralPron: '[kitobҳo]',
      image: 'book.png',
      pluralImage: 'books.png',
    },
    {
      singular: 'car',
      singularTajik: 'мошин',
      singularPron: '[mošin]',
      plural: 'cars',
      pluralTajik: 'мошинҳо',
      pluralPron: '[mošinҳo]',
      image: 'car.png',
      pluralImage: 'cars.png',
    },
    {
      singular: 'tree',
      singularTajik: 'дарахт',
      singularPron: '[daracht]',
      plural: 'trees',
      pluralTajik: 'дарахтҳо',
      pluralPron: '[darachtҳo]',
      image: 'tree.png',
      pluralImage: 'trees.png',
    },
    {
      singular: 'flower',
      singularTajik: 'гӯл',
      singularPron: '[hūl]',
      plural: 'flowers',
      pluralTajik: 'гӯлҳо',
      pluralPron: '[hūlҳo]',
      image: 'flower.png',
      pluralImage: 'flowers.png',
    },
  ];

  const grammarExamples = [
    {
      english: 'I speak one language',
      tajik: 'Ман як забон медонам',
      pronunciation: '[Man jak zabon miedonam]',
      rule: '[singular form]',
    },
    {
      english: 'we speak three languages',
      tajik: 'Мо се забон медонем',
      pronunciation: '[Mo voś zabon miedoniem]',
      rule: '[plural noun]',
    },
    {
      english: 'he visits many countries',
      tajik: 'У ба давлатҳои зиёд саёҳат мекунад',
      pronunciation: '[U ba davlatҳoi zijed sajeҳat miekunad]',
      rule: '[adverb + plural noun]',
    },
    {
      english: 'they are happy now',
      tajik: 'онҳо шоданд',
      pronunciation: '[onҳo šodand]',
      rule: '[plural pronoun]',
    },
    {
      english: 'she has five red shoes',
      tajik: 'у панҷ пойафзоли сурх дорад',
      pronunciation: '[u panҷ pojafzoli surch Dorada]',
      rule: '[adjective + plural noun]',
    },
    {
      english: 'I want a sandwich without onions',
      tajik: 'Ман бутерброди бепиёз мехоҳам',
      pronunciation: '[Man buterbrody biepijez miechoҳam]',
      rule: '[preposition + plural noun]',
    },
  ];

  const moreExamples = [
    {
      singular: 'woman',
      singularTajik: 'зан',
      singularPron: '[zan]',
      plural: 'women',
      pluralTajik: 'занҳо',
      pluralPron: '[zanҳo]',
      image: 'woman.png',
      pluralImage: 'women.png',
    },
    {
      singular: 'man',
      singularTajik: 'мард',
      singularPron: '[Mardzi]',
      plural: 'men',
      pluralTajik: 'мардҳо',
      pluralPron: '[mardҳo]',
      image: 'man.png',
      pluralImage: 'men.png',
    },
    {
      singular: 'house',
      singularTajik: 'хона',
      singularPron: '[chona]',
      plural: 'houses',
      pluralTajik: 'хонаҳо',
      pluralPron: '[chonaҳo]',
      image: 'house.png',
      pluralImage: 'houses.png',
    },
    {
      singular: 'cup',
      singularTajik: 'пиёла',
      singularPron: '[pijela]',
      plural: 'cups',
      pluralTajik: 'пиёлаҳо',
      pluralPron: '[pijelaҳo]',
      image: 'cup.png',
      pluralImage: 'cups.png',
    },
    {
      singular: 'cow',
      singularTajik: 'гов',
      singularPron: '[hov]',
      plural: 'cows',
      pluralTajik: 'говҳо',
      pluralPron: '[hovҳo]',
      image: 'cow.png',
      pluralImage: 'cows.png',
    },
    {
      singular: 'horse',
      singularTajik: 'асп',
      singularPron: '[ASD]',
      plural: 'horses',
      pluralTajik: 'аспҳо',
      pluralPron: '[aspҳo]',
      image: 'horse.png',
      pluralImage: 'horses.png',
    },
  ];

  const emergencyPhrases = [
    { english: 'Help', tajik: 'ёрӣ', pronunciation: '[jerī]' },
    {
      english: 'Call the ambulance',
      tajik: 'ёрии таъҷилиро ҷеғ занед',
      pronunciation: '[jerii taʺҷiliro ҷjeġ zanied]',
    },
    {
      english: 'I need a doctor',
      tajik: 'ба ман духтур лозим аст',
      pronunciation: '[ba man duchtur lozim astra]',
    },
    {
      english: 'Where is the closest pharmacy?',
      tajik: 'дорухонаи наздиктарин дар куҷост?',
      pronunciation: '[doruchonai nazdiktarin dar kuҷost?]',
    },
    {
      english: 'Are you okay?',
      tajik: 'шумо сиҳаст ҳастед?',
      pronunciation: '[šumo siҳast ҳastied?]',
    },
    {
      english: 'I am sick',
      tajik: 'ман касал шудам',
      pronunciation: '[man kasa šudam]',
    },
    {
      english: 'Call the police',
      tajik: 'милисаро занг занед',
      pronunciation: '[milisaro zanh zanied]',
    },
  ];

  // Компонент для отображения пары singular-plural
  const PluralPairCard = ({ item, index }: any) => (
    <Animated.View
      style={[
        styles.pairCard,
        {
          opacity: fadeAnim,
          transform: [
            {
              translateY: fadeAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [50, 0],
              }),
            },
          ],
        },
      ]}
    >
      <View style={styles.pairContainer}>
        {/* Singular */}
        <View style={styles.singularContainer}>
          <WordCard
            item={{
              english: item.singular,
              tajik: item.singularTajik,
              pronunciation: item.singularPron,
              image: item.image,
            }}
            index={index}
            fadeAnim={new Animated.Value(1)}
            cardStyle={styles.pairWordCard}
          />
        </View>

        {/* Plural */}
        <View style={styles.pluralContainer}>
          <WordCard
            item={{
              english: item.plural,
              tajik: item.pluralTajik,
              pronunciation: item.pluralPron,
              image: item.pluralImage,
            }}
            index={index}
            fadeAnim={new Animated.Value(1)}
            cardStyle={styles.pairWordCard}
          />
        </View>
      </View>
    </Animated.View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

      {/* Header */}
      <PageHeader title="Tajik Plural" onBack={() => router.push('../grammar')} />

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollViewContent}
      >
        {/* Introduction */}
        <IntroSection
          title="Tajik Plural"
          text="Welcome to the fourth Tajik lesson about the plural. This time we will learn about the singular form and what it looks like in the plural, followed by grammar rules, finally a list of emergency phrases. To hear the pronunciation, just click on the sound icon."
          fadeAnim={fadeAnim}
          isSmallPhone={isSmallPhone}
        />

        {/* Basic Examples Section */}
        <Section title="Plural Examples" isSmallPhone={isSmallPhone}>
          <View style={styles.pairCardsContainer}>
            {pluralExamples.map((item, index) => (
              <PluralPairCard key={index} item={item} index={index} />
            ))}
          </View>
        </Section>

        {/* Grammar Rules Section */}
        <Section
          title="Plural Grammar Rules"
          introText="The plural is the form which refers to more than one object or person. For example: I speak two languages the plural here is [languages] because it refers to more than one [language]. The examples below use plurals in different ways and places to demonstrate how they look when converted from their singular form."
          isSmallPhone={isSmallPhone}
        >
          <ExamplesSection
            examples={grammarExamples}
            fadeAnim={fadeAnim}
            englishStyle={isSmallPhone ? { textAlign: 'center' } : {}}
            tajikStyle={isSmallPhone ? { textAlign: 'center' } : {}}
            pronunciationStyle={isSmallPhone ? { textAlign: 'center' } : {}}
            ruleStyle={isSmallPhone ? { textAlign: 'center' } : {}}
          />
        </Section>

        {/* More Examples Section */}
        <Section
          title="More Examples"
          introText="The following is a list of examples showing both the singular and plural form. This demonstrates how the plural is used with humans, objects and animals."
          isSmallPhone={isSmallPhone}
        >
          <View style={styles.pairCardsContainer}>
            {moreExamples.map((item, index) => (
              <PluralPairCard
                key={index + pluralExamples.length}
                item={item}
                index={index}
              />
            ))}
          </View>
        </Section>

        {/* Emergency Phrases Section */}
        <Section
          title="Emergency Phrases"
          introText="Now it's time to practice your Tajik by looking at these phrases which are related to emergencies. Be prepared when traveling abroad, just in case you need help or by offering help to someone else. I recommend writing these expressions down on a notebook before traveling."
          isSmallPhone={isSmallPhone}
        >
          <ExamplesSection
            examples={emergencyPhrases}
            fadeAnim={fadeAnim}
            showRule={false}
            cardStyle={styles.emergencyCard}
            englishStyle={[
              styles.emergencyEnglish,
              isSmallPhone ? { textAlign: 'center' } : {},
            ]}
            tajikStyle={[
              styles.emergencyTajik,
              isSmallPhone ? { textAlign: 'center' } : {},
            ]}
            pronunciationStyle={[
              styles.emergencyPronunciation,
              isSmallPhone ? { textAlign: 'center' } : {},
            ]}
          />
        </Section>

        {/* Quote Section */}
        <QuoteSection
          quote="The secret of success is to know something nobody else knows."
          author="Aristotle"
          fadeAnim={fadeAnim}
          isSmallPhone={isSmallPhone}
        />

        {/* Completion Message */}
        <Animated.View
          style={[styles.completionSection, { opacity: fadeAnim }]}
        >
          <Text style={styles.completionText}>
            Did you enjoy this lesson about the plural in Tajik? I hope so, if
            you have any problem with this lesson contact me
            tajlang@gmail.com
          </Text>
        </Animated.View>

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  scrollView: { flex: 1 },
  scrollViewContent: { paddingBottom: getSpacing(32) },

  pairCardsContainer: { paddingHorizontal: getSpacing(16) },
  pairCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    marginBottom: getSpacing(16),
    borderWidth: 1,
    borderColor: '#e2e8f0',
    overflow: 'hidden',
  },
  pairContainer: { flexDirection: isSmallPhone ? 'column' : 'row' },
  singularContainer: {
    flex: 1,
    padding: getSpacing(16),
    borderRightWidth: isSmallPhone ? 0 : 1,
    borderRightColor: '#e2e8f0',
    borderBottomWidth: isSmallPhone ? 1 : 0,
    borderBottomColor: '#e2e8f0',
  },
  pluralContainer: { flex: 1, padding: getSpacing(16) },
  pairWordCard: {
    borderWidth: 0,
    backgroundColor: 'transparent',
    paddingHorizontal: 0,
    minHeight: getSpacing(120),
  },

  emergencyCard: {
    backgroundColor: '#fff5f5',
    borderLeftWidth: 4,
    borderLeftColor: '#ef4444',
    borderColor: '#fecaca',
  },
  emergencyEnglish: { color: '#dc2626', fontWeight: '700' },
  emergencyTajik: { color: '#ef4444' },
  emergencyPronunciation: { color: '#991b1b' },

  completionSection: {
    backgroundColor: '#f0f9ff',
    marginHorizontal: getSpacing(16),
    marginVertical: getSpacing(16),
    padding: getSpacing(20),
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#0284c7',
  },
  completionText: {
    fontSize: getFontSize(16),
    color: '#0c4a6e',
    lineHeight: getFontSize(24),
    textAlign: isSmallPhone ? 'center' : 'left',
  },
  bottomSpacer: { height: getSpacing(32) },
});
