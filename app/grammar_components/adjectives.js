import React, { useRef } from 'react';
import {
  ScrollView,
  View,
  StyleSheet,
  StatusBar,
  Animated,
  Dimensions
} from 'react-native';
import { router } from 'expo-router';

// Импорт готовых компонентов
import PageHeader from './blocks/PageHeader';
import IntroSection from './blocks/IntroSection';
import Section from './blocks/Section';
import WordsGrid from './blocks/WordsGrid';
import ExamplesSection from './blocks/ExamplesSection';
import QuoteSection from './blocks/QuoteSection';

const { width, height } = Dimensions.get('window');

// Responsive breakpoints
const isTablet = width >= 768;
const isSmallPhone = width < 350;
const isLandscape = width > height;

// Responsive utility functions
const getResponsiveValue = (small, medium, large) => {
  if (isSmallPhone) return small;
  if (isTablet) return large;
  return medium;
};

const getCardWidth = () => {
  if (isTablet) {
    return isLandscape ? (width - 64) / 4 : (width - 48) / 3;
  }
  return isSmallPhone ? width - 32 : (width - 48) / 2;
};

const getFontSize = (baseSize) => {
  const scaleFactor = isSmallPhone ? 0.9 : isTablet ? 1.2 : 1;
  return Math.round(baseSize * scaleFactor);
};

const getSpacing = (baseSpacing) => {
  return getResponsiveValue(baseSpacing * 0.8, baseSpacing, baseSpacing * 1.2);
};

export default function Adjectives() {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, []);

  const colors = [
    { english: 'black', tajik: 'сиёҳ', pronunciation: '[sijeҳ]', audio: 'tajik_black', image: 'black.png' },
    { english: 'grey', tajik: 'хокистарранг', pronunciation: '[chokistarranh]', audio: 'tajik_grey', image: 'grey.png' },
    { english: 'white', tajik: 'сафед', pronunciation: '[safied]', audio: 'tajik_white', image: 'white.png' },
    { english: 'blue', tajik: 'кабуд', pronunciation: '[kabud]', audio: 'tajik_blue', image: 'blue.png' },
    { english: 'green', tajik: 'сабз', pronunciation: '[sabz]', audio: 'tajik_green', image: 'green.png' },
    { english: 'yellow', tajik: 'зард', pronunciation: '[zard]', audio: 'tajik_yellow', image: 'yellow.png' },
    { english: 'red', tajik: 'сурх', pronunciation: '[surch]', audio: 'tajik_red', image: 'red.png' },
    { english: 'brown', tajik: 'қаҳваранг', pronunciation: "[k'aҳvaranh]", audio: 'tajik_brown', image: 'brown.png' },
  ];

  const grammarExamples = [
    { english: 'my house is white', tajik: 'Хонаи ман сафед аст', pronunciation: '[Chonai man safied astra]', rule: '[noun + adjective]', audio: 'tajik_my_house_is_white' },
    { english: 'your country is big', tajik: 'Давлати шумо калон аст', pronunciation: '[Davlati šumo Kalon astra]', rule: '[noun + adjective]', audio: 'tajik_your_country_is_big' },
    { english: 'new books are expensive', tajik: 'Китобҳои нав гарон мебошанд', pronunciation: '[Kitobҳoi nav Haron miebošand]', rule: '[plural + adjective]', audio: 'tajik_new_books_are_expensive' },
    { english: 'we are happy here', tajik: 'Мо дар инҷо шод ҳастем', pronunciation: '[Mo dar inҷo šod ҳastiem]', rule: '[pronoun + verb + adjective]', audio: 'tajik_we_are_happy_here' },
    { english: 'she has three small dogs', tajik: 'Ӯ се саги майда дорад', pronunciation: '[Ū sioje sahi Majda Dorada]', rule: '[adjective + plural]', audio: 'tajik_she_has_three_small_dogs' },
    { english: 'this language is very easy', tajik: 'Ин забон хеле осон аст', pronunciation: '[Jan zabon chielie oson astra]', rule: '[adverb + adjective]', audio: 'tajik_this_language_is_very_easy' },
    { english: 'I have a small green house', tajik: 'Ман хонаи майдаи сабз дорам', pronunciation: '[Man chonai majdan sabz doram]', rule: '[adjective + adjective]', audio: 'tajik_I_have_a_small_green_house' },
  ];

  const weather = [
    { english: 'cold', tajik: 'хунук', pronunciation: '[chunuk]', audio: 'tajik_cold', image: 'cold.png' },
    { english: 'hot', tajik: 'гарм', pronunciation: '[Harmi]', audio: 'tajik_hot', image: 'hot.png' },
    { english: 'cloudy', tajik: 'абрнок', pronunciation: '[abrnok]', audio: 'tajik_cloudy', image: 'cloudy.png' },
    { english: 'rainy', tajik: 'борон меборад', pronunciation: '[baron mieborad]', audio: 'tajik_rainy', image: 'rainy.png' },
    { english: 'snowy', tajik: 'барф меборад', pronunciation: '[barf mieborad]', audio: 'tajik_snowy', image: 'snowy.png' },
    { english: 'sunny', tajik: 'гармӣ', pronunciation: '[harmī]', audio: 'tajik_sunny', image: 'sunny.png' },
    { english: 'windy', tajik: 'шамол', pronunciation: '[šamol]', audio: 'tajik_windy', image: 'windy.png' },
    { english: 'warm', tajik: '', pronunciation: '[]', audio: 'tajik_warm', image: 'warm.png' },
  ];

  const conversation = [
    { english: 'hi', tajik: 'Салом', pronunciation: '[Salam]', audio: 'tajik_hi' },
    { english: 'how are you?', tajik: 'Чӣ ҳол доред?', pronunciation: '[Čī ҳol doried?]', audio: 'tajik_how_are_you' },
    { english: "I'm good, thank you", tajik: 'Хуб, ташаккур', pronunciation: '[Chub, tašakkur]', audio: 'tajik_Im_good_thank_you' },
    { english: 'and you?', tajik: 'Шумо чӣ?', pronunciation: '[Šumo čī?]', audio: 'tajik_and_you' },
    { english: 'what is your name?', tajik: 'Номи шумо чист?', pronunciation: '[Naminalie šumo čysty?]', audio: 'tajik_what_is_your_name' },
    { english: 'my name is Maya', tajik: 'Номи ман Майя', pronunciation: '[Naminalie man Majia]', audio: 'tajik_my_name_is_Maya' },
    { english: 'nice to meet you', tajik: 'Аз шиносои бо шумо шодам', pronunciation: '[Az šinosoi bo šumo šodam]', audio: 'tajik_nice_to_meet_you' },
  ];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

      {/* Header с использованием PageHeader */}
      <PageHeader
        title="Tajik Adjectives"
        onBackPress={() => router.push('../grammar')}
      />

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollViewContent}
      >
        {/* IntroSection вместо ручной верстки */}
        <IntroSection
          title="Tajik Adjectives"
          text="Welcome to the second Tajik lesson about adjectives. This time we will first learn about colors, 
            followed by grammar rules, then weather expressions, finally a conversation in Tajik to help 
            you practice your daily phrases. To hear the pronunciation, just click on the sound icon."
          fadeAnim={fadeAnim}
          isSmallPhone={isSmallPhone}
        />

        {/* Colors Section */}
        <Section title="Colors" isSmallPhone={isSmallPhone}>
          <WordsGrid
            words={colors}
            fadeAnim={fadeAnim}
            getCardWidth={getCardWidth}
            isTablet={isTablet}
            gridStyle={styles.wordsGrid}
          />
        </Section>

        {/* Grammar Rules Section */}
        <Section
          title="Adjectives Grammar Rules"
          introText="In general adjectives are words which describe or modify another person or object in a given sentence. For example: a beautiful flower the adjective is [beautiful] because it describes the noun [flower]. The following examples use adjectives in different ways and places to demonstrate how they behave in a sentence."
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

        {/* Weather Section */}
        <Section
          title="Weather Expressions"
          introText="The following is a list of more adjectives for you, often used when referring to weather conditions. I think it would be wise to memorize them."
          isSmallPhone={isSmallPhone}
        >
          <WordsGrid
            words={weather}
            fadeAnim={fadeAnim}
            getCardWidth={getCardWidth}
            isTablet={isTablet}
            gridStyle={styles.wordsGrid}
          />
        </Section>

        {/* Conversation Section */}
        <Section
          title="Conversation in Tajik"
          introText="Now we finally reach the most exciting part, the practice of the daily expressions used in almost every conversation. I recommend memorizing these phrases, because you will need them for sure."
          isSmallPhone={isSmallPhone}
        >
          <ExamplesSection
            examples={conversation}
            fadeAnim={fadeAnim}
            showRule={false}
            englishStyle={isSmallPhone ? { textAlign: 'center' } : {}}
            tajikStyle={isSmallPhone ? { textAlign: 'center' } : {}}
            pronunciationStyle={isSmallPhone ? { textAlign: 'center' } : {}}
          />
        </Section>

        {/* Quote Section */}
        <QuoteSection
          quote="Success is the sum of small efforts, repeated day in and day out."
          author="Robert Collier"
          fadeAnim={fadeAnim}
          isSmallPhone={isSmallPhone}
        />

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    paddingBottom: getSpacing(32),
  },
  wordsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: isTablet ? 'flex-start' : 'space-between',
    paddingHorizontal: getSpacing(16),
    gap: isTablet ? getSpacing(16) : 0,
  },
  bottomSpacer: {
    height: getSpacing(32),
  },
});
