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

export default function Nouns() {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, []);

  const vegetables = [
    { english: 'potatoes', tajik: 'картошкаҳо', pronunciation: '[kartoškaҳo]', audio: 'tajik_potatoes', image: 'potatoes.png' },
    { english: 'tomatoes', tajik: 'помидорҳо', pronunciation: '[pomidorҳo]', audio: 'tajik_tomatoes', image: 'tomatoes.png' },
    { english: 'onions', tajik: 'пиёзҳо', pronunciation: '[pijezҳo]', audio: 'tajik_onions', image: 'onions.png' },
    { english: 'carrots', tajik: 'сабзиҳо', pronunciation: '[sabziҳo]', audio: 'tajik_carrots', image: 'carrots.png' },
    { english: 'fruits', tajik: 'меваҳо', pronunciation: '[mievaҳo]', audio: 'tajik_fruits', image: 'fruits.png' },
    { english: 'apples', tajik: 'себҳо', pronunciation: '[siebҳo]', audio: 'tajik_apples', image: 'apples.png' },
    { english: 'bananas', tajik: 'бананҳо', pronunciation: '[bananҳo]', audio: 'tajik_bananas', image: 'bananas.png' },
    { english: 'oranges', tajik: 'афлесунҳо', pronunciation: '[afliesunҳo]', audio: 'tajik_oranges', image: 'oranges.png' },
  ];

  const grammarExamples = [
    { english: 'do you have milk?', tajik: 'Шумо шир доред?', pronunciation: '[Šumo šyr doried?]', rule: '[verb + noun]', audio: 'tajik_do_you_have_milk' },
    { english: 'I have milk and coffee', tajik: 'Ман шир ва қаҳва дорам', pronunciation: '[Man šyr va k\'aҳva doram]', rule: '[preposition + noun]', audio: 'tajik_I_have_milk_and_coffee' },
    { english: 'he has three apples', tajik: 'У се себ дорад', pronunciation: '[U sioje sieb Dorada]', rule: '[number + plural noun]', audio: 'tajik_he_has_three_apples' },
    { english: 'she only has one apple', tajik: 'У танҳо як себ дорад', pronunciation: '[U tanҳo jak sieb Dorada]', rule: '[number + singular noun]', audio: 'tajik_she_only_has_one_apple' },
    { english: 'we live in a small house', tajik: 'Мо дар хонаи хурд зиндагонӣ мекунем', pronunciation: '[Mo dar chonai churd zindahonī miekuniem]', rule: '[adjective + noun]', audio: 'tajik_we_live_in_a_small_house' },
    { english: 'I like our breakfast', tajik: 'Ноништаи мо ба ман маҳқул аст', pronunciation: '[Noništai mo ba man maҳk\'ul astra]', rule: '[pronoun + noun]', audio: 'tajik_I_like_our_breakfast' },
  ];

  const foodItems = [
    { english: 'bread', tajik: 'нон', pronunciation: '[non]', audio: 'tajik_bread', image: 'bread.png' },
    { english: 'milk', tajik: 'шир', pronunciation: '[šyr]', audio: 'tajik_milk', image: 'milk.png' },
    { english: 'butter', tajik: 'равғани маска', pronunciation: '[ravġani maska]', audio: 'tajik_butter', image: 'butter.png' },
    { english: 'cheese', tajik: 'панир', pronunciation: '[planuje]', audio: 'tajik_cheese', image: 'cheese.png' },
    { english: 'coffee', tajik: 'қаҳва', pronunciation: '[k\'aҳva]', audio: 'tajik_coffee', image: 'coffee.png' },
    { english: 'sandwich', tajik: 'бутерброд', pronunciation: '[buterbrod]', audio: 'tajik_sandwich', image: 'sandwich.png' },
    { english: 'meat', tajik: 'гўшт', pronunciation: '[hŭšt]', audio: 'tajik_meat', image: 'meat.png' },
    { english: 'chicken', tajik: 'мурғ', pronunciation: '[murġ]', audio: 'tajik_chicken', image: 'chicken.png' },
    { english: 'fish', tajik: 'моҳӣ', pronunciation: '[moҳī]', audio: 'tajik_fish', image: 'fish.png' },
    { english: 'breakfast', tajik: 'ноништа', pronunciation: '[noništa]', audio: 'tajik_breakfast', image: 'breakfast.png' },
    { english: 'lunch', tajik: 'хӯроки пешин', pronunciation: '[chūroki piešin]', audio: 'tajik_lunch', image: 'lunch.png' },
    { english: 'dinner', tajik: 'хўроки шом', pronunciation: '[chŭroki šom]', audio: 'tajik_dinner', image: 'dinner.png' },
  ];

  const conversation = [
    { english: 'Do you speak (English/ Tajik)?', tajik: 'Шумо забони англисиро/тоҷикиро медонед?', pronunciation: '[Šumo zaboni anhlisiro / toҷikiro miedonied?]', audio: 'tajik_Do_you_speak_Tajik' },
    { english: 'Just a little', tajik: 'Камтар', pronunciation: '[Kamtar]', audio: 'tajik_Just_a_little' },
    { english: 'I like Tajik', tajik: 'Ба ман забони тоҷикӣ маҳқул аст', pronunciation: '[Ba man zaboni Bielaruskaja maҳk\'ul astra]', audio: 'tajik_I_like_Tajik' },
    { english: 'Can I practice with you?', tajik: 'Бо шумо каме сӯҳбат кунам мумкин?', pronunciation: '[Bo šumo kamieru sūҳbat kunam mumkin?]', audio: 'tajik_Can_I_practice_with_you' },
    { english: 'How old are you?', tajik: 'Синнусоли шумо чанд аст?', pronunciation: '[Sinnusoli šumo čand astra?]', audio: 'tajik_How_old_are_you' },
    { english: "I'm thirty three years old", tajik: 'Ман сию се сола ҳастам', pronunciation: '[Man hetuju voś Sola ҳastam]', audio: 'tajik_Im_thirty_three_years_old' },
    { english: 'It was nice talking to you', tajik: 'Бо сӯҳбат бо шумо хушҳол шудам', pronunciation: '[Bo sūҳbat bo šumo chušҳol šudam]', audio: 'tajik_It_was_nice_talking_to_you' },
  ];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

      {/* Header с использованием PageHeader */}
      <PageHeader
        title="Tajik Nouns"
        onBackPress={() => router.push('../grammar')}
      />

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollViewContent}
      >
        {/* IntroSection вместо ручной верстки */}
        <IntroSection
          title="Tajik Nouns"
          text="Welcome to the third Tajik lesson about nouns. This time we will first learn about fruits and vegetables, 
            followed by grammar rules, then food items, finally a conversation in Tajik to help 
            you practice your daily phrases. To hear the pronunciation, just click on the sound icon."
          fadeAnim={fadeAnim}
          isSmallPhone={isSmallPhone}
        />

        {/* Fruits and Vegetables Section */}
        <Section title="Fruits and Vegetables" isSmallPhone={isSmallPhone}>
          <WordsGrid
            words={vegetables}
            fadeAnim={fadeAnim}
            getCardWidth={getCardWidth}
            isTablet={isTablet}
            gridStyle={styles.wordsGrid}
          />
        </Section>

        {/* Grammar Rules Section */}
        <Section
          title="Nouns Grammar Rules"
          introText="In general nouns refer to a person, an object, or abstract ideas. For example: a fast runner the noun is [runner] because it refers to a person. The examples below use nouns in different ways and places to demonstrate how they behave in a sentence."
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

        {/* Food Items Section */}
        <Section
          title="Food Items"
          introText="The following are nouns of food items that you might be interested in learning and memorizing."
          isSmallPhone={isSmallPhone}
        >
          <WordsGrid
            words={foodItems}
            fadeAnim={fadeAnim}
            getCardWidth={getCardWidth}
            isTablet={isTablet}
            gridStyle={styles.wordsGrid}
          />
        </Section>

        {/* Conversation Section */}
        <Section
          title="Conversation in Tajik"
          introText="Now we finally reach the fun part, the practice of the daily conversations. These phrases are used to get to know new people, and break the ice."
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
          quote="A coward gets scared and quits. A hero gets scared, but still goes on."
          author=""
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