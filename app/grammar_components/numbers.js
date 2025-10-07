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

export default function Numbers() {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, []);

  const cardinalOrdinal = [
    { english: 'one', tajik: 'як', pronunciation: '[jak]', audio: 'tajik_one' },
    { english: 'first', tajik: 'якум', pronunciation: '[jakum]', audio: 'tajik_first' },
    { english: 'two', tajik: 'ду', pronunciation: '[du]', audio: 'tajik_two' },
    { english: 'second', tajik: 'дуюм', pronunciation: '[dujum]', audio: 'tajik_second' },
    { english: 'three', tajik: 'се', pronunciation: '[voś]', audio: 'tajik_three' },
    { english: 'third', tajik: 'сеюм', pronunciation: '[siejum]', audio: 'tajik_third' },
    { english: 'four', tajik: 'чор', pronunciation: '[čor]', audio: 'tajik_four' },
    { english: 'fourth', tajik: 'чорум, чаҳорум', pronunciation: '[čorum, čaҳorum]', audio: 'tajik_fourth' },
    { english: 'five', tajik: 'панҷ', pronunciation: '[panҷ]', audio: 'tajik_five' },
    { english: 'fifth', tajik: 'панҷум', pronunciation: '[panҷum]', audio: 'tajik_fifth' },
    { english: 'six', tajik: 'шаш', pronunciation: '[šaš]', audio: 'tajik_six' },
    { english: 'sixth', tajik: 'шашум', pronunciation: '[šašum]', audio: 'tajik_sixth' },
    { english: 'seven', tajik: 'ҳафт', pronunciation: '[ҳaft]', audio: 'tajik_seven' },
    { english: 'seventh', tajik: 'ҳафтум', pronunciation: '[ҳaftum]', audio: 'tajik_seventh' },
    { english: 'eight', tajik: 'ҳашт', pronunciation: '[ҳašt]', audio: 'tajik_eight' },
    { english: 'eighth', tajik: 'ҳаштум', pronunciation: '[ҳaštum]', audio: 'tajik_eighth' },
    { english: 'nine', tajik: 'нўҳ', pronunciation: '[nŭҳ]', audio: 'tajik_nine' },
    { english: 'ninth', tajik: 'нӯҳум', pronunciation: '[nūҳum]', audio: 'tajik_ninth' },
    { english: 'ten', tajik: 'даҳ', pronunciation: '[daҳ]', audio: 'tajik_ten' },
    { english: 'tenth', tajik: 'даҳум', pronunciation: '[daҳum]', audio: 'tajik_tenth' },
    { english: 'eleven', tajik: 'ёздаҳ', pronunciation: '[jezdaҳ]', audio: 'tajik_eleven' },
    { english: 'eleventh', tajik: 'ёздаҳум', pronunciation: '[jezdaҳum]', audio: 'tajik_eleventh' },
    { english: 'twelve', tajik: 'дувоздаҳ', pronunciation: '[duvozdaҳ]', audio: 'tajik_twelve' },
    { english: 'twelfth', tajik: 'дувоздаҳум', pronunciation: '[duvozdaҳum]', audio: 'tajik_twelfth' },
    { english: 'thirteen', tajik: 'сездаҳ', pronunciation: '[siezdaҳ]', audio: 'tajik_thirteen' },
    { english: 'thirteenth', tajik: 'сездаҳум', pronunciation: '[siezdaҳum]', audio: 'tajik_thirteenth' },
    { english: 'fourteen', tajik: 'чордаҳ', pronunciation: '[čordaҳ]', audio: 'tajik_fourteen' },
    { english: 'once', tajik: 'як дафа', pronunciation: '[jak Datan]', audio: 'tajik_once' },
    { english: 'fifteen', tajik: 'понздаҳ', pronunciation: '[ponzdaҳ]', audio: 'tajik_fifteen' },
    { english: 'twice', tajik: 'ду дафа', pronunciation: '[du Datan]', audio: 'tajik_twice' },
    { english: 'sixteen', tajik: 'шонздаҳ', pronunciation: '[šonzdaҳ]', audio: 'tajik_sixteen' },
    { english: 'Monday', tajik: 'Душанбе', pronunciation: '[Dušanbie]', audio: 'tajik_Monday' },
    { english: 'seventeen', tajik: 'ҳабдаҳ', pronunciation: '[ҳabdaҳ]', audio: 'tajik_seventeen' },
    { english: 'Tuesday', tajik: 'Сешанбе', pronunciation: '[Siešanbie]', audio: 'tajik_Tuesday' },
    { english: 'eighteen', tajik: 'ҳаждаҳ', pronunciation: '[ҳaždaҳ]', audio: 'tajik_eighteen' },
    { english: 'Wednesday', tajik: 'Чоршанбе', pronunciation: '[Čoršanbie]', audio: 'tajik_Wednesday' },
    { english: 'nineteen', tajik: 'нуздаҳ', pronunciation: '[nuzdaҳ]', audio: 'tajik_nineteen' },
    { english: 'Thursday', tajik: 'Панҷшанбе', pronunciation: '[Panҷšanbie]', audio: 'tajik_Thursday' },
    { english: 'twenty', tajik: 'бист', pronunciation: '[bist]', audio: 'tajik_twenty' },
    { english: 'Friday', tajik: 'Ҷумъа', pronunciation: '[Ҷumʺa]', audio: 'tajik_Friday' },
    { english: 'seventy one', tajik: 'ҳафтоду як', pronunciation: '[ҳaftodu jak]', audio: 'tajik_seventy_one' },
    { english: 'Saturday', tajik: 'Шанбе', pronunciation: '[Šanbie]', audio: 'tajik_Saturday' },
    { english: 'one hundred', tajik: 'сад', pronunciation: '[sad]', audio: 'tajik_one_hundred' },
    { english: 'Sunday', tajik: 'Якшанбе', pronunciation: '[Jakšanbie]', audio: 'tajik_Sunday' },
  ];

  const grammarExamples = [
    { 
      english: 'I have three dogs', 
      tajik: 'Ман се саг дорам', 
      pronunciation: '[Man sioje sah doram]', 
      rule: '[number + noun]', 
      audio: 'tajik_I_have_three_dogs' 
    },
    { 
      english: 'my daughter has two cats', 
      tajik: 'духтари ман ду гурба дорад', 
      pronunciation: '[duchtari man du hurba Dorada]', 
      rule: '[number + noun]', 
      audio: 'tajik_my_daughter_has_two_cats' 
    },
    { 
      english: 'she speaks seven languages', 
      tajik: 'Ӯ ҳафт забон медонад', 
      pronunciation: '[Ū ҳaft zabon miedonad]', 
      rule: '[verb + number]', 
      audio: 'tajik_she_speaks_seven_languages' 
    },
    { 
      english: 'my brother has one son', 
      tajik: 'Бародари ман як писар дорад', 
      pronunciation: '[Barodari man jak pisar Dorada]', 
      rule: '[number + singular noun]', 
      audio: 'tajik_my_brother_has_one_son' 
    },
    { 
      english: 'this is my second lesson', 
      tajik: 'Ин дарси дуюми ман аст', 
      pronunciation: '[Jan Darsi dujumi man astra]', 
      rule: '[ordinal number + noun]', 
      audio: 'tajik_this_is_my_second_lesson' 
    },
    { 
      english: 'did you read the third book?', 
      tajik: 'Шумо китоби сеюмро хондед?', 
      pronunciation: '[Šumo kitobi siejumro chondied?]', 
      rule: '[ordinal number + noun]', 
      audio: 'tajik_did_you_read_the_third_book' 
    },
  ];

  const animals = [
    { english: 'cow', tajik: 'гов', pronunciation: '[hov]', audio: 'tajik_cow', image: 'cow.png' },
    { english: 'goat', tajik: 'буз', pronunciation: '[buz]', audio: 'tajik_goat', image: 'goat.png' },
    { english: 'donkey', tajik: 'хар', pronunciation: '[Char]', audio: 'tajik_donkey', image: 'donkey.png' },
    { english: 'horse', tajik: 'асп', pronunciation: '[ASD]', audio: 'tajik_horse', image: 'horse.png' },
    { english: 'dog', tajik: 'саг', pronunciation: '[sah]', audio: 'tajik_dog', image: 'dog.png' },
    { english: 'cat', tajik: 'гурба', pronunciation: '[hurba]', audio: 'tajik_cat', image: 'cat.png' },
    { english: 'mouse', tajik: 'муш', pronunciation: '[muš]', audio: 'tajik_mouse', image: 'mouse.png' },
    { english: 'bird', tajik: 'парранда', pronunciation: '[parranda]', audio: 'tajik_bird', image: 'bird.png' },
  ];

  const conversation = [
    { english: 'Where are you from?', tajik: 'Шумо аз кучо ҳастед?', pronunciation: '[Šumo az kučo ҳastied?]', audio: 'tajik_Where_are_you_from' },
    { english: "I'm from the U.S", tajik: 'Ман аз И.М.А.', pronunciation: '[Man az I.M.A.]', audio: 'tajik_Im_from_the_US' },
    { english: "I'm American", tajik: 'Ман амрикоҳӣ мебошам', pronunciation: '[Man amrikoҳī miebošam]', audio: 'tajik_Im_American' },
    { english: 'Where do you live?', tajik: 'Шумо дар куҷо зиндагонӣ мекунед?', pronunciation: '[Šumo dar kuҷo zindahonī miekunied?]', audio: 'tajik_Where_do_you_live' },
    { english: 'I live in the U.S', tajik: 'Ман дар И.М.А. Зиндагони мекунам', pronunciation: '[Man dar I.M.A. Zindahoni miekunam]', audio: 'tajik_I_live_in_the_US' },
    { english: 'What do you do for a living?', tajik: 'Шумо чӣ кор мекунед?', pronunciation: '[Šumo čī kor miekunied?]', audio: 'tajik_What_do_you_do_for_a_living' },
    { english: "I'm a student", tajik: 'Ман донишҷӯ мебошам', pronunciation: '[Man donišҷū miebošam]', audio: 'tajik_Im_a_student' },
  ];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

      {/* Header с использованием PageHeader */}
      <PageHeader
        title="Tajik Numbers"
        onBackPress={() => router.push('../grammar')}
      />

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollViewContent}
      >
        {/* IntroSection */}
        <IntroSection
          title="Tajik Numbers"
          text="Welcome to the sixth Tajik lesson about numbers. This time we will learn about cardinal and ordinal numbers, followed by grammar rules, then animal names, finally a conversation in Tajik to help you practice your daily phrases. Click on the sound icon to hear the words."
          fadeAnim={fadeAnim}
          isSmallPhone={isSmallPhone}
        />

        {/* Cardinal and Ordinal Numbers Section */}
        <Section title="Cardinal and Ordinal Numbers" isSmallPhone={isSmallPhone}>
          <ExamplesSection
            examples={cardinalOrdinal}
            fadeAnim={fadeAnim}
            showRule={false}
            englishStyle={isSmallPhone ? { textAlign: 'center' } : {}}
            tajikStyle={isSmallPhone ? { textAlign: 'center' } : {}}
            pronunciationStyle={isSmallPhone ? { textAlign: 'center' } : {}}
          />
        </Section>

        {/* Numbers Grammar Rules Section */}
        <Section
          title="Numbers Grammar Rules"
          introText="Tajik cardinal numbers refer to the counting numbers, because they show quantity. For example: I speak two languages. Ordinal numbers on the other hand tell the order of things and their rank: my first language is Tajik. The examples below use numbers in different ways and places to demonstrate how they behave in a sentence."
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

        {/* Animals Section */}
        <Section
          title="List of Animals"
          introText="We're not done yet! The following is a list of animals."
          isSmallPhone={isSmallPhone}
        >
          <WordsGrid
            words={animals}
            fadeAnim={fadeAnim}
            getCardWidth={getCardWidth}
            isTablet={isTablet}
            gridStyle={styles.wordsGrid}
          />
        </Section>

        {/* Conversation Section */}
        <Section
          title="Conversation in Tajik"
          introText="Now we finally reach the last part, the practice of the daily conversations. These phrases are used to get to know new people, and break the ice."
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
          quote="Do not wait to strike till the iron is hot; but make it hot by striking."
          author="William B. Sprague"
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