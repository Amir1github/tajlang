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

export default function Gender() {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, []);

  const people = [
    { english: 'man', tajik: 'мард', pronunciation: '[Mardzi]', audio: 'tajik_man', image: 'man2.png' },
    { english: 'woman', tajik: 'зан', pronunciation: '[zan]', audio: 'tajik_woman', image: 'woman2.png' },
    { english: 'husband', tajik: 'шавҳар', pronunciation: '[šavҳar]', audio: 'tajik_husband', image: 'husband.png' },
    { english: 'wife', tajik: 'ҳамсар, зан', pronunciation: '[ҳamsar, zan]', audio: 'tajik_wife', image: 'wife.png' },
    { english: 'boy', tajik: 'писар', pronunciation: '[pisar]', audio: 'tajik_boy', image: 'boy.png' },
    { english: 'girl', tajik: 'духтар', pronunciation: '[duchtar]', audio: 'tajik_girl', image: 'girl.png' },
    { english: 'father', tajik: 'падар', pronunciation: '[padar]', audio: 'tajik_father', image: 'father.png' },
    { english: 'mother', tajik: 'модар', pronunciation: '[modar]', audio: 'tajik_mother', image: 'mother.png' },
  ];

  const grammarExamples = [
    { english: 'my son is a student', tajik: 'писариман донишҷӯ аст', pronunciation: '[pisariman donišҷū astra]', rule: '[masculine + noun]', audio: 'tajik_my_son_is_a_student' },
    { english: 'her daughter is a student', tajik: 'духтарам донишҷӯ аст', pronunciation: '[duchtaram donišҷū astra]', rule: '[feminine + noun]', audio: 'tajik_her_daughter_is_a_student' },
    { english: 'he has a tall brother', tajik: 'ӯ бародари қадбаланд дорад', pronunciation: '[ū barodari k\'adbaland Dorada]', rule: '[adjective + masculine]', audio: 'tajik_he_has_a_tall_brother' },
    { english: 'she has a tall sister', tajik: 'ӯ хоҳари ҳадбаланд дорад', pronunciation: '[ū choҳari ҳadbaland Dorada]', rule: '[adjective + feminine]', audio: 'tajik_she_has_a_tall_sister' },
    { english: 'his brothers are young', tajik: 'бародарони ӯ ҷавонанд', pronunciation: '[barodaroni ū ҷavonand]', rule: '[plural masculine + adjective]', audio: 'tajik_his_brothers_are_young' },
    { english: 'his sisters are young', tajik: 'хоҳарони ӯ ҷавонанд', pronunciation: '[choҳaroni ū ҷavonand]', rule: '[plural feminine + adjective]', audio: 'tajik_his_sisters_are_young' },
  ];

  const familyMembers = [
    { english: 'son', tajik: 'писар', pronunciation: '[pisar]', audio: 'tajik_son', image: 'son.png' },
    { english: 'daughter', tajik: 'духтар', pronunciation: '[duchtar]', audio: 'tajik_daughter', image: 'daughter.png' },
    { english: 'brother', tajik: 'бародар', pronunciation: '[barodar]', audio: 'tajik_brother', image: 'brother.png' },
    { english: 'sister', tajik: 'хоҳар', pronunciation: '[choҳar]', audio: 'tajik_sister', image: 'sister.png' },
    { english: 'grandfather', tajik: 'бобо', pronunciation: '[bobo]', audio: 'tajik_grandfather', image: 'grandfather.png' },
    { english: 'grandmother', tajik: 'бибӣ', pronunciation: '[bibī]', audio: 'tajik_grandmother', image: 'grandmother.png' },
    { english: 'child', tajik: 'фарзанд', pronunciation: '[farzand]', audio: 'tajik_child', image: 'child.png' },
    { english: 'children', tajik: 'фарзандон', pronunciation: '[farzandon]', audio: 'tajik_children', image: 'children.png' },
  ];

  const expressions = [
    { english: 'What do you mean?', tajik: 'Чӣ гӯфтед?', pronunciation: '[Čī hūftied?]', audio: 'tajik_What_do_you_mean' },
    { english: "I don't understand", tajik: 'Ман намефаҳмам', pronunciation: '[Man namiefaҳmam]', audio: 'tajik_I_dont_understand' },
    { english: "I don't know", tajik: 'Ман намедонам', pronunciation: '[Man namiedonam]', audio: 'tajik_I_dont_know' },
    { english: 'What is that called in Tajik?', tajik: 'Ин бо забони тоҷикӣ чӣ мешавад?', pronunciation: '[Jan bo zaboni Bielaruskaja čī miešavad?]', audio: 'tajik_What_is_that_called_in_Tajik' },
    { english: 'What is this?', tajik: 'Ин чист?', pronunciation: '[Jan čysty?]', audio: 'tajik_What_is_this' },
    { english: 'What does that word mean in English?', tajik: 'Ин калима бо забони англисӣ чи маъно дорад?', pronunciation: '[Jan kalima bo zaboni anhlisī čy maʺno Dorada?]', audio: 'tajik_What_does_that_word_mean_in_English' },
    { english: 'Sorry (if you made a mistake)', tajik: 'Бубахшед', pronunciation: '[Bubachšjed]', audio: 'tajik_Sorry' },
  ];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

      {/* Header с использованием PageHeader */}
      <PageHeader
        title="Tajik Gender"
        onBackPress={() => router.push('../grammar')}
      />

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollViewContent}
      >
        {/* IntroSection вместо ручной верстки */}
        <IntroSection
          title="Tajik Gender"
          text="Welcome to the fifth Tajik lesson about gender. This time we will view a list of people, 
            feminine and masculine, followed by grammar rules, finally a list of expressions in Tajik 
            to help you practice your daily phrases. To hear the pronunciation, just click on the sound icon."
          fadeAnim={fadeAnim}
          isSmallPhone={isSmallPhone}
        />

        {/* People Section */}
        <Section title="People" isSmallPhone={isSmallPhone}>
          <WordsGrid
            words={people}
            fadeAnim={fadeAnim}
            getCardWidth={getCardWidth}
            isTablet={isTablet}
            gridStyle={styles.wordsGrid}
          />
        </Section>

        {/* Grammar Rules Section */}
        <Section
          title="Gender Grammar Rules"
          introText="In general, gender is used to distinguish between male and female, sometimes referred to as masculine and feminine. For example: my son and daughter are students the noun [son] is masculine, while [daughter] is feminine. The following examples use gender in different ways and places to demonstrate their behavior."
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

        {/* Family Members Section */}
        <Section
          title="Family Members"
          introText="The list below will probably provide more clarification. These are family members (males and females). I think it would be wise to memorize them as part of your important vocabulary list."
          isSmallPhone={isSmallPhone}
        >
          <WordsGrid
            words={familyMembers}
            fadeAnim={fadeAnim}
            getCardWidth={getCardWidth}
            isTablet={isTablet}
            gridStyle={styles.wordsGrid}
          />
        </Section>

        {/* Expressions Section */}
        <Section
          title="Expressions in Tajik"
          introText="Now it's time to practice expressions used in daily conversations. If you're a beginner in learning Tajik, then the phrases below are something you would want to know."
          isSmallPhone={isSmallPhone}
        >
          <ExamplesSection
            examples={expressions}
            fadeAnim={fadeAnim}
            showRule={false}
            englishStyle={isSmallPhone ? { textAlign: 'center' } : {}}
            tajikStyle={isSmallPhone ? { textAlign: 'center' } : {}}
            pronunciationStyle={isSmallPhone ? { textAlign: 'center' } : {}}
          />
        </Section>

        {/* Quote Section */}
        <QuoteSection
          quote="High achievement always takes place in a framework of high expectation."
          author="Jack Kinder"
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